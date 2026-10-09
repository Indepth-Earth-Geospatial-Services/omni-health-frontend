"use client";

import { useMemo, useState } from "react";
import { AlertCircle, ArrowRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryBadge } from "@/features/admin/components/ui/FacilityCard";
import { useLgaInventory } from "../../hooks/useLgaInventory";

type SurveyFilter = "all" | "surveyed" | "not-surveyed";

interface LgaInventoryOverviewProps {
  lgaName: string;
  onOpenFacility: (facilityId: string) => void;
}

const pct = (part: number, whole: number) =>
  whole > 0 ? `${Math.round((part / whole) * 100)}%` : "—";

const Shimmer = ({ className }: { className?: string }) => (
  <span
    aria-hidden
    className={cn(
      "inline-block h-3.5 animate-pulse rounded bg-slate-200",
      className,
    )}
  />
);

/**
 * Every facility in one LGA with its inventory at a glance. Rows fill in as
 * each facility's inventory arrives — the list itself is one request, the
 * counts are one cached request per facility — so the table is usable before
 * the last facility has loaded.
 */
export default function LgaInventoryOverview({
  lgaName,
  onOpenFacility,
}: LgaInventoryOverviewProps) {
  const lga = useLgaInventory(lgaName);
  const [filter, setFilter] = useState<SurveyFilter>("all");

  const rows = useMemo(
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

  if (lga.isError) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <p className="text-sm font-medium text-slate-800">
          Failed to load {lgaName}&apos;s facilities
        </p>
      </div>
    );
  }

  const notSurveyed = lga.loaded - lga.surveyed;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <h3 className="flex items-center gap-1.5 text-base font-semibold text-slate-800">
            <MapPin size={15} className="text-slate-400" />
            {lgaName}
            <span className="text-sm font-normal text-slate-400">
              {lga.isLoadingFacilities ? "" : `${lga.total} facilities`}
            </span>
          </h3>
          {!lga.isComplete && (
            <p className="mt-0.5 text-xs text-slate-500" aria-live="polite">
              {lga.isLoadingFacilities
                ? "Loading facilities…"
                : `Loading inventory · ${lga.loaded} of ${lga.total}`}
            </p>
          )}
        </div>

        <div
          role="radiogroup"
          aria-label="Survey status"
          className="flex rounded-lg bg-[#F6F8FA] p-1"
        >
          {(
            [
              ["all", "All", lga.total],
              ["surveyed", "Surveyed", lga.surveyed],
              ["not-surveyed", "Not surveyed", notSurveyed],
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
      </div>

      {/* Thin progress bar while facilities are still arriving. */}
      {!lga.isComplete && lga.total > 0 && (
        <div className="h-0.5 w-full bg-slate-100">
          <div
            className="bg-primary h-full transition-[width] duration-300"
            style={{ width: `${(lga.loaded / lga.total) * 100}%` }}
          />
        </div>
      )}

      <div className="max-h-[32rem] overflow-auto">
        <table className="w-full min-w-[46rem] text-sm">
          <thead className="sticky top-0 z-[1] bg-slate-50 text-left text-xs font-medium text-slate-500">
            <tr>
              <th className="px-4 py-2.5 sm:px-5">Facility</th>
              <th className="px-4 py-2.5">Category</th>
              <th className="px-4 py-2.5">Survey</th>
              <th className="px-4 py-2.5 text-right">Types in stock</th>
              <th className="px-4 py-2.5 text-right">Units</th>
              <th className="px-4 py-2.5 text-right">Functional</th>
              <th className="px-4 py-2.5 text-right sm:px-5">
                <span className="sr-only">Open</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {lga.isLoadingFacilities ? (
              [0, 1, 2, 3, 4].map((i) => (
                <tr key={i}>
                  <td colSpan={7} className="px-4 py-3 sm:px-5">
                    <Shimmer className="w-full" />
                  </td>
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-sm text-slate-400"
                >
                  {filter === "surveyed"
                    ? "No facility here has been surveyed yet."
                    : "No facilities to show."}
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr
                  key={r.facility_id}
                  className="group cursor-pointer hover:bg-slate-50"
                  onClick={() => onOpenFacility(r.facility_id)}
                >
                  <td className="max-w-[16rem] px-4 py-2.5 sm:px-5">
                    <span
                      className="block truncate font-medium text-slate-800"
                      title={r.facility_name}
                    >
                      {r.facility_name}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <CategoryBadge category={r.facility_category} />
                  </td>
                  <td className="px-4 py-2.5 text-xs">
                    {r.isLoading ? (
                      <Shimmer className="w-16" />
                    ) : r.isError ? (
                      <span className="text-red-600">Failed to load</span>
                    ) : r.isSurveyed ? (
                      <span className="text-slate-700">Surveyed</span>
                    ) : (
                      <span className="text-slate-400">Not surveyed</span>
                    )}
                  </td>
                  {r.isLoading ? (
                    <>
                      <td className="px-4 py-2.5 text-right">
                        <Shimmer className="w-8" />
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <Shimmer className="w-10" />
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <Shimmer className="w-10" />
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2.5 text-right text-slate-700 tabular-nums">
                        {r.isSurveyed ? r.typesInStock : "—"}
                      </td>
                      <td className="px-4 py-2.5 text-right font-semibold text-slate-800 tabular-nums">
                        {r.isSurveyed ? r.units.toLocaleString() : "—"}
                      </td>
                      <td className="px-4 py-2.5 text-right text-slate-700 tabular-nums">
                        {r.isSurveyed
                          ? pct(r.functional, r.functional + r.notFunctional)
                          : "—"}
                      </td>
                    </>
                  )}
                  <td className="px-4 py-2.5 text-right sm:px-5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenFacility(r.facility_id);
                      }}
                      className="text-primary inline-flex items-center gap-1 text-xs font-medium whitespace-nowrap opacity-70 group-hover:opacity-100 hover:underline"
                    >
                      Open
                      <ArrowRight size={13} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
