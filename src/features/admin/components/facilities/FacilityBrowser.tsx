"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Columns3,
  Hospital,
  LayoutList,
  MapPin,
  Search,
  Tags,
} from "lucide-react";
import { Facility } from "@/types/api-response";
import { cn, formatPhones } from "@/lib/utils";
import { SearchableSelect } from "@/features/super-admin/components/ui/SearchableSelect";
import FacilityCard, { CategoryBadge } from "../ui/FacilityCard";

type GroupBy = "none" | "lga" | "category";
type ViewMode = "list" | "board";

const GROUP_TABS: { value: GroupBy; label: string }[] = [
  { value: "none", label: "All" },
  { value: "lga", label: "By LGA" },
  { value: "category", label: "By Category" },
];

const ALL = "all";

interface Option {
  id: string;
  label: string;
  count: number;
}

interface FacilityBrowserProps {
  facilities: Facility[];
  currentFacilityId: string;
  onExplore: (facilityId: string) => void;
}

const groupKeyOf = (f: Facility, by: GroupBy) =>
  by === "lga"
    ? f.facility_lga || "Unknown LGA"
    : by === "category"
      ? f.facility_category || "Uncategorised"
      : "";

/** Distinct values with their counts, for the filter dropdowns. */
function optionsFor(
  facilities: Facility[],
  pick: (f: Facility) => string | undefined,
  allLabel: string,
): Option[] {
  const counts = new Map<string, number>();
  facilities.forEach((f) => {
    const v = pick(f);
    if (v) counts.set(v, (counts.get(v) ?? 0) + 1);
  });
  return [
    { id: ALL, label: allLabel, count: facilities.length },
    ...[...counts.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([v, count]) => ({ id: v, label: v, count })),
  ];
}

/**
 * The facilities an admin can switch between — searchable, filterable by
 * LGA and category, groupable, and shown as a list or a board. Built for the
 * LGA admin with dozens of facilities as much as for a single one.
 */
export default function FacilityBrowser({
  facilities,
  currentFacilityId,
  onExplore,
}: FacilityBrowserProps) {
  const [groupBy, setGroupBy] = useState<GroupBy>("none");
  const [view, setView] = useState<ViewMode>("list");
  const [search, setSearch] = useState("");
  const [lga, setLga] = useState(ALL);
  const [category, setCategory] = useState(ALL);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const lgaOptions = useMemo(
    () => optionsFor(facilities, (f) => f.facility_lga, "All LGAs"),
    [facilities],
  );
  const categoryOptions = useMemo(
    () => optionsFor(facilities, (f) => f.facility_category, "All categories"),
    [facilities],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return facilities
      .filter((f) => lga === ALL || f.facility_lga === lga)
      .filter((f) => category === ALL || f.facility_category === category)
      .filter(
        (f) =>
          !q ||
          [f.facility_name, f.town, f.address, f.facility_lga]
            .filter(Boolean)
            .some((v) => v.toLowerCase().includes(q)),
      )
      .sort((a, b) => a.facility_name.localeCompare(b.facility_name));
  }, [facilities, search, lga, category]);

  const groups = useMemo(() => {
    if (groupBy === "none") return [{ key: "", items: filtered }];
    const map = new Map<string, Facility[]>();
    filtered.forEach((f) => {
      const key = groupKeyOf(f, groupBy);
      map.set(key, [...(map.get(key) ?? []), f]);
    });
    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, items]) => ({ key, items }));
  }, [filtered, groupBy]);

  const hasFilters = search.trim() !== "" || lga !== ALL || category !== ALL;
  const clearFilters = () => {
    setSearch("");
    setLga(ALL);
    setCategory(ALL);
  };

  const toggleGroup = (key: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const GroupIcon = groupBy === "lga" ? MapPin : Tags;

  return (
    <div className="flex flex-col gap-4">
      {/* Row 1 — how to organise, and how to show it */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Group facilities"
          className="flex rounded-lg bg-[#F6F8FA] p-1"
        >
          {GROUP_TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              role="tab"
              aria-selected={groupBy === t.value}
              onClick={() => {
                setGroupBy(t.value);
                setCollapsed(new Set());
              }}
              className={cn(
                "rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors",
                groupBy === t.value
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-[#868C98] hover:text-slate-700",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div
          role="radiogroup"
          aria-label="Layout"
          className="flex rounded-lg border border-slate-200 p-0.5"
        >
          {(
            [
              ["list", "List", LayoutList],
              ["board", "Board", Columns3],
            ] as const
          ).map(([value, label, Icon]) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={view === value}
              onClick={() => setView(value)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                view === value
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:text-slate-800",
              )}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Row 2 — what to show */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search
            size={15}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, town or address…"
            className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-slate-300 py-2 pr-3 pl-9 text-sm focus:ring-2 focus:outline-none"
          />
        </div>
        <SearchableSelect<Option>
          items={lgaOptions}
          value={lga}
          onChange={setLga}
          getItemId={(o) => o.id}
          getItemLabel={(o) => o.label}
          getItemMeta={(o) => o.count}
          searchPlaceholder="Search LGAs…"
          icon={<MapPin size={14} className="text-slate-400" />}
          size="sm"
          className="w-full sm:w-52"
        />
        <SearchableSelect<Option>
          items={categoryOptions}
          value={category}
          onChange={setCategory}
          getItemId={(o) => o.id}
          getItemLabel={(o) => o.label}
          getItemMeta={(o) => o.count}
          searchPlaceholder="Search categories…"
          icon={<Tags size={14} className="text-slate-400" />}
          size="sm"
          className="w-full sm:w-60"
        />
        <p className="text-xs text-slate-500 sm:ml-auto">
          {filtered.length === facilities.length
            ? `${facilities.length} facilities`
            : `${filtered.length} of ${facilities.length} facilities`}
          {hasFilters && (
            <>
              {" · "}
              <button
                type="button"
                onClick={clearFilters}
                className="text-primary font-medium hover:underline"
              >
                Clear filters
              </button>
            </>
          )}
        </p>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-12 text-center">
          <Hospital size={28} className="text-slate-300" />
          <p className="text-sm font-medium text-slate-700">
            No facilities match these filters
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="text-primary text-xs font-medium hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : view === "board" ? (
        groupBy === "none" ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((f) => (
              <FacilityCard
                key={f.facility_id}
                facility={f}
                isActive={f.facility_id === currentFacilityId}
                onExplore={onExplore}
              />
            ))}
          </div>
        ) : (
          /* Kanban: one column per LGA or category */
          <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
            {groups.map(({ key, items }) => (
              <section
                key={key}
                className="flex w-72 shrink-0 flex-col rounded-xl bg-slate-50 p-3"
              >
                <header className="mb-3 flex items-center justify-between gap-2 px-1">
                  <h4
                    className="flex min-w-0 items-center gap-1.5 text-sm font-semibold text-slate-800"
                    title={key}
                  >
                    <GroupIcon size={14} className="shrink-0 text-slate-400" />
                    <span className="truncate">{key}</span>
                  </h4>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500 tabular-nums">
                    {items.length}
                  </span>
                </header>
                <div className="flex max-h-[34rem] flex-col gap-3 overflow-y-auto pr-0.5">
                  {items.map((f) => (
                    <FacilityCard
                      key={f.facility_id}
                      facility={f}
                      isActive={f.facility_id === currentFacilityId}
                      onExplore={onExplore}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )
      ) : (
        /* List */
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="max-h-[34rem] overflow-auto">
            <table className="w-full min-w-[48rem] text-sm">
              <thead className="sticky top-0 z-[1] bg-slate-50 text-left text-xs font-medium text-slate-500">
                <tr>
                  <th className="px-4 py-2.5">Facility</th>
                  <th className="px-4 py-2.5">Category</th>
                  <th className="px-4 py-2.5">LGA</th>
                  <th className="px-4 py-2.5">Town</th>
                  <th className="px-4 py-2.5">Phone</th>
                  <th className="px-4 py-2.5 text-right">
                    <span className="sr-only">Action</span>
                  </th>
                </tr>
              </thead>
              {groups.map(({ key, items }) => {
                const isCollapsed = collapsed.has(key);
                return (
                  <tbody
                    key={key || "all"}
                    className="divide-y divide-slate-100"
                  >
                    {groupBy !== "none" && (
                      <tr className="bg-white">
                        <td
                          colSpan={6}
                          className="border-b border-slate-100 px-2 py-1.5"
                        >
                          <button
                            type="button"
                            onClick={() => toggleGroup(key)}
                            aria-expanded={!isCollapsed}
                            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50"
                          >
                            <ChevronDown
                              size={15}
                              className={cn(
                                "shrink-0 text-slate-400 transition-transform",
                                isCollapsed && "-rotate-90",
                              )}
                            />
                            <GroupIcon
                              size={14}
                              className="shrink-0 text-slate-400"
                            />
                            <span className="truncate">{key}</span>
                            <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 tabular-nums">
                              {items.length}
                            </span>
                          </button>
                        </td>
                      </tr>
                    )}
                    {!isCollapsed &&
                      items.map((f) => {
                        const isActive = f.facility_id === currentFacilityId;
                        return (
                          <tr
                            key={f.facility_id}
                            className={cn(
                              "transition-colors",
                              isActive ? "bg-primary/5" : "hover:bg-slate-50",
                            )}
                          >
                            <td className="max-w-[18rem] px-4 py-2.5">
                              <div className="flex items-center gap-2">
                                <span
                                  className="truncate font-medium text-slate-800"
                                  title={f.facility_name}
                                >
                                  {f.facility_name}
                                </span>
                                {isActive && (
                                  <span className="bg-primary shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium text-white">
                                    Current
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-2.5">
                              <CategoryBadge category={f.facility_category} />
                            </td>
                            <td className="px-4 py-2.5 whitespace-nowrap text-slate-600">
                              {f.facility_lga || "—"}
                            </td>
                            <td className="max-w-[10rem] px-4 py-2.5">
                              <span
                                className="block truncate text-slate-600"
                                title={f.town}
                              >
                                {f.town || "—"}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 whitespace-nowrap text-slate-600 tabular-nums">
                              {formatPhones(f.contact_info?.phone).split(
                                ",",
                              )[0] || "—"}
                            </td>
                            <td className="px-4 py-2.5 text-right">
                              {isActive ? (
                                <span className="text-xs text-slate-400">
                                  Viewing
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => onExplore(f.facility_id)}
                                  className="text-primary inline-flex items-center gap-1 text-xs font-medium whitespace-nowrap hover:underline"
                                >
                                  Switch
                                  <ArrowRight size={13} />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                );
              })}
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
