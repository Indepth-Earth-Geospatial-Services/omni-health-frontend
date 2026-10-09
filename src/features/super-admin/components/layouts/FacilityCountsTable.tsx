"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, ArrowRight, MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFacilityInventory } from "@/features/admin/hooks/useAdminStaff";
import type { InventoryCounts } from "@/services/admin.service";
import {
  useAllLgaFacilities,
  useLgaInventory,
} from "../../hooks/useLgaInventory";

type SurveyFilter = "all" | "surveyed" | "not-surveyed";

interface FacilityCountsTableProps {
  /** One LGA's facilities, or every facility when null. */
  lgaName: string | null;
  onOpenFacility: (facilityId: string) => void;
}

const Shimmer = ({ className }: { className?: string }) => (
  <span
    aria-hidden
    className={cn(
      "inline-block h-3.5 animate-pulse rounded bg-slate-200",
      className,
    )}
  />
);

const sum = (
  counts: InventoryCounts | undefined,
  key: "functional" | "not_functional",
) => Object.values(counts ?? {}).reduce((s, c) => s + c[key], 0);

/** The two count cells, with "—" for a facility the survey never reached. */
function CountCells({
  isLoading,
  isError,
  isSurveyed,
  functional,
  notFunctional,
}: {
  isLoading: boolean;
  isError: boolean;
  isSurveyed: boolean;
  functional: number;
  notFunctional: number;
}) {
  if (isLoading) {
    return (
      <>
        <td className="px-4 py-2.5 text-right">
          <Shimmer className="w-10" />
        </td>
        <td className="px-4 py-2.5 text-right">
          <Shimmer className="w-10" />
        </td>
      </>
    );
  }
  if (isError) {
    return (
      <td colSpan={2} className="px-4 py-2.5 text-right text-xs text-red-600">
        Failed to load
      </td>
    );
  }
  const notRecorded = (
    <span className="text-slate-300" title="Not surveyed yet">
      —
    </span>
  );
  return (
    <>
      <td className="px-4 py-2.5 text-right font-semibold text-slate-800 tabular-nums">
        {isSurveyed ? functional.toLocaleString() : notRecorded}
      </td>
      <td className="px-4 py-2.5 text-right text-slate-700 tabular-nums">
        {isSurveyed ? notFunctional.toLocaleString() : notRecorded}
      </td>
    </>
  );
}

/**
 * Counts for one facility, fetched only once its row scrolls into view — the
 * all-facilities table has 342 rows, and there is no endpoint for every
 * facility's totals at once. Each fetch is the cached per-facility query, so
 * Open is instant afterwards.
 */
function LazyCountCells({ facilityId }: { facilityId: string }) {
  const probeRef = useRef<HTMLTableCellElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible || !probeRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(probeRef.current);
    return () => observer.disconnect();
  }, [isVisible]);

  const { data, isLoading, isError } = useFacilityInventory(
    isVisible ? facilityId : "",
  );

  if (!isVisible) {
    return (
      <>
        <td ref={probeRef} className="px-4 py-2.5 text-right">
          <Shimmer className="w-10" />
        </td>
        <td className="px-4 py-2.5 text-right">
          <Shimmer className="w-10" />
        </td>
      </>
    );
  }

  const inv = data?.inventory;
  return (
    <CountCells
      isLoading={isLoading}
      isError={isError}
      isSurveyed={
        Object.keys(inv?.equipment ?? {}).length +
          Object.keys(inv?.infrastructure ?? {}).length >
        0
      }
      functional={
        sum(inv?.equipment, "functional") +
        sum(inv?.infrastructure, "functional")
      }
      notFunctional={
        sum(inv?.equipment, "not_functional") +
        sum(inv?.infrastructure, "not_functional")
      }
    />
  );
}

function OpenCell({ onOpen }: { onOpen: () => void }) {
  return (
    <td className="px-4 py-2.5 text-right sm:px-5">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        className="text-primary inline-flex items-center gap-1 text-xs font-medium whitespace-nowrap opacity-70 group-hover:opacity-100 hover:underline"
      >
        Open
        <ArrowRight size={13} />
      </button>
    </td>
  );
}

/**
 * Facilities with their functional and non-functional unit counts — one LGA,
 * or every facility. A quick read across facilities; Open shows the items
 * behind the numbers.
 */
export default function FacilityCountsTable({
  lgaName,
  onOpenFacility,
}: FacilityCountsTableProps) {
  const isAllLgas = lgaName === null;
  const lga = useLgaInventory(lgaName);
  const all = useAllLgaFacilities(isAllLgas);

  const [filter, setFilter] = useState<SurveyFilter>("all");
  const [search, setSearch] = useState("");

  const lgaRows = useMemo(
    () =>
      lga.rows
        .filter((r) =>
          filter === "all"
            ? true
            : r.isLoading
              ? false
              : filter === "surveyed"
                ? r.isSurveyed
                : !r.isSurveyed,
        )
        // By name, so rows don't jump around as their counts arrive.
        .sort((a, b) => a.facility_name.localeCompare(b.facility_name)),
    [lga.rows, filter],
  );

  const allRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return all.rows
      .filter(
        (r) =>
          !q ||
          r.facility_name.toLowerCase().includes(q) ||
          r.facility_lga.toLowerCase().includes(q),
      )
      .sort(
        (a, b) =>
          a.facility_lga.localeCompare(b.facility_lga) ||
          a.facility_name.localeCompare(b.facility_name),
      );
  }, [all.rows, search]);

  if (!isAllLgas && lga.isError) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <p className="text-sm font-medium text-slate-800">
          Failed to load {lgaName}&apos;s facilities
        </p>
      </div>
    );
  }

  const isLoadingList = isAllLgas ? all.isLoading : lga.isLoadingFacilities;
  const rowCount = isAllLgas ? allRows.length : lgaRows.length;
  const columnCount = isAllLgas ? 5 : 4;
  const progress = isAllLgas
    ? all.lgasLoaded < all.lgasTotal
      ? `Loading facilities · ${all.lgasLoaded} of ${all.lgasTotal} LGAs`
      : null
    : !lga.isComplete
      ? lga.isLoadingFacilities
        ? "Loading facilities…"
        : `Loading counts · ${lga.loaded} of ${lga.total}`
      : null;
  const progressShare = isAllLgas
    ? all.lgasLoaded / Math.max(1, all.lgasTotal)
    : lga.loaded / Math.max(1, lga.total);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <h3 className="flex items-center gap-1.5 text-base font-semibold text-slate-800">
            <MapPin size={15} className="text-slate-400" />
            {isAllLgas ? "All facilities" : lgaName}
            <span className="text-sm font-normal text-slate-400 tabular-nums">
              {isLoadingList ? "" : isAllLgas ? all.rows.length : lga.total}
            </span>
          </h3>
          {progress && (
            <p className="mt-0.5 text-xs text-slate-500" aria-live="polite">
              {progress}
            </p>
          )}
        </div>

        {isAllLgas ? (
          <div className="relative w-full sm:w-64">
            <Search
              size={14}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search facility or LGA…"
              className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-slate-200 py-1.5 pr-3 pl-8 text-sm focus:ring-2 focus:outline-none"
            />
          </div>
        ) : (
          <div
            role="radiogroup"
            aria-label="Survey status"
            className="flex rounded-lg bg-[#F6F8FA] p-1"
          >
            {(
              [
                ["all", "All", lga.total],
                ["surveyed", "Surveyed", lga.surveyed],
                ["not-surveyed", "Not surveyed", lga.loaded - lga.surveyed],
              ] as const
            ).map(([value, label, count]) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={filter === value}
                onClick={() => setFilter(value)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  filter === value
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-[#868C98] hover:text-slate-700",
                )}
              >
                {label} <span className="tabular-nums">{count}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Thin progress bar while facilities are still arriving. */}
      {progress && (
        <div className="h-0.5 w-full bg-slate-100">
          <div
            className="bg-primary h-full transition-[width] duration-300"
            style={{ width: `${progressShare * 100}%` }}
          />
        </div>
      )}

      <div className="max-h-128 overflow-auto">
        <table
          className={cn(
            "w-full text-sm",
            isAllLgas ? "min-w-152" : "min-w-120",
          )}
        >
          <thead className="sticky top-0 z-1 bg-slate-50 text-left text-xs font-medium text-slate-500">
            <tr>
              <th className="px-4 py-2.5 sm:px-5">Facility</th>
              {isAllLgas && <th className="px-4 py-2.5">LGA</th>}
              <th className="px-4 py-2.5 text-right">Functional</th>
              <th className="px-4 py-2.5 text-right">Non-functional</th>
              <th className="px-4 py-2.5 text-right sm:px-5">
                <span className="sr-only">Open</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoadingList ? (
              [0, 1, 2, 3, 4].map((i) => (
                <tr key={i}>
                  <td colSpan={columnCount} className="px-4 py-3 sm:px-5">
                    <Shimmer className="w-full" />
                  </td>
                </tr>
              ))
            ) : rowCount === 0 ? (
              <tr>
                <td
                  colSpan={columnCount}
                  className="px-4 py-10 text-center text-sm text-slate-400"
                >
                  {search ? (
                    <>Nothing matches &ldquo;{search}&rdquo;</>
                  ) : filter === "surveyed" ? (
                    "No facility here has been surveyed yet."
                  ) : (
                    "No facilities to show."
                  )}
                </td>
              </tr>
            ) : isAllLgas ? (
              allRows.map((r) => (
                <tr
                  key={r.facility_id}
                  className="group cursor-pointer hover:bg-slate-50"
                  onClick={() => onOpenFacility(r.facility_id)}
                >
                  <td className="max-w-[18rem] px-4 py-2.5 sm:px-5">
                    <span
                      className="block truncate font-medium text-slate-800"
                      title={r.facility_name}
                    >
                      {r.facility_name}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-slate-600">
                    {r.facility_lga}
                  </td>
                  <LazyCountCells facilityId={r.facility_id} />
                  <OpenCell onOpen={() => onOpenFacility(r.facility_id)} />
                </tr>
              ))
            ) : (
              lgaRows.map((r) => (
                <tr
                  key={r.facility_id}
                  className="group cursor-pointer hover:bg-slate-50"
                  onClick={() => onOpenFacility(r.facility_id)}
                >
                  <td className="max-w-[18rem] px-4 py-2.5 sm:px-5">
                    <span
                      className="block truncate font-medium text-slate-800"
                      title={r.facility_name}
                    >
                      {r.facility_name}
                    </span>
                  </td>
                  <CountCells
                    isLoading={r.isLoading}
                    isError={r.isError}
                    isSurveyed={r.isSurveyed}
                    functional={r.functional}
                    notFunctional={r.notFunctional}
                  />
                  <OpenCell onOpen={() => onOpenFacility(r.facility_id)} />
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
