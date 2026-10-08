"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface ConditionBarDatum {
  key: string;
  name: string;
  functional: number;
  notFunctional: number;
  total: number;
}

interface FacilityConditionBarsProps {
  data: ConditionBarDatum[];
  /** Rows shown before "Show all". */
  initialRows?: number;
}

// Categorical slots 1 and 2 of the reference palette — validated as a pair on
// the white surface (CVD ΔE 24.7, normal-vision ΔE 33.6, both ≥ 3:1). Not
// green/red: that pair is the one most colour-blind readers can't separate.
const COLORS = {
  functional: "#2a78d6",
  notFunctional: "#eb6834",
  // Units the survey counted without a condition — recessive, not a series.
  unspecified: "#c3c2b7",
};

const Swatch = ({ color }: { color: string }) => (
  <span
    aria-hidden
    className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
    style={{ backgroundColor: color }}
  />
);

/**
 * Functional vs non-functional per item, as horizontal stacked bars sorted by
 * total. Part-to-whole per row: the bar is the total, split by condition.
 */
export function FacilityConditionBars({
  data,
  initialRows = 12,
}: FacilityConditionBarsProps) {
  const [showAll, setShowAll] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const rows = data
    .filter((d) => d.total > 0)
    .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
  const visible = showAll ? rows : rows.slice(0, initialRows);
  const max = Math.max(1, ...rows.map((d) => d.total));
  const hasUnspecified = rows.some(
    (d) => d.total > d.functional + d.notFunctional,
  );

  if (rows.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-slate-500">
        Nothing held to chart — every recorded item has a count of 0.
      </p>
    );
  }

  return (
    <div>
      {/* Legend — two series, so it is always present. */}
      <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-600">
        <span className="flex items-center gap-1.5">
          <Swatch color={COLORS.functional} />
          Functional
        </span>
        <span className="flex items-center gap-1.5">
          <Swatch color={COLORS.notFunctional} />
          Non-functional
        </span>
        {hasUnspecified && (
          <span className="flex items-center gap-1.5">
            <Swatch color={COLORS.unspecified} />
            Condition not recorded
          </span>
        )}
      </div>

      <ul className="space-y-1">
        {visible.map((d) => {
          const unspecified = Math.max(0, d.total - d.functional - d.notFunctional);
          const segments = [
            { value: d.functional, color: COLORS.functional },
            { value: d.notFunctional, color: COLORS.notFunctional },
            { value: unspecified, color: COLORS.unspecified },
          ].filter((s) => s.value > 0);
          const isActive = active === d.key;

          return (
            <li
              key={d.key}
              tabIndex={0}
              onMouseEnter={() => setActive(d.key)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(d.key)}
              onBlur={() => setActive(null)}
              aria-label={`${d.name}: ${d.functional} functional, ${d.notFunctional} non-functional, ${d.total} total`}
              className={cn(
                "relative grid grid-cols-[minmax(0,10rem)_1fr] items-center gap-3 rounded-md px-2 py-1.5 outline-none sm:grid-cols-[minmax(0,15rem)_1fr]",
                isActive && "bg-slate-50",
              )}
            >
              <span
                className="truncate text-right text-xs text-slate-600"
                title={d.name}
              >
                {d.name}
              </span>

              <div className="flex min-w-0 items-center gap-2">
                {/* The bar: square at the baseline, 4px round at the data end,
                    2px surface gap between segments. */}
                <div
                  className="flex h-4 gap-0.5"
                  style={{ width: `${(d.total / max) * 100}%` }}
                >
                  {segments.map((s, i) => (
                    <span
                      key={i}
                      className={cn(
                        "h-full",
                        i === segments.length - 1 && "rounded-r-[4px]",
                      )}
                      style={{
                        backgroundColor: s.color,
                        flexGrow: s.value,
                        flexBasis: 0,
                        minWidth: 2,
                      }}
                    />
                  ))}
                </div>
                {/* Value at the tip, in ink — never the series colour. */}
                <span className="shrink-0 text-xs font-semibold text-slate-700 tabular-nums">
                  {d.total}
                </span>
              </div>

              {isActive && (
                <div
                  role="tooltip"
                  className="pointer-events-none absolute top-full left-1/2 z-10 mt-1 w-56 -translate-x-1/2 rounded-lg border border-slate-200 bg-white p-3 text-xs shadow-lg sm:left-[16rem] sm:translate-x-0"
                >
                  <p className="mb-2 font-semibold text-slate-800">{d.name}</p>
                  <dl className="space-y-1 tabular-nums">
                    <div className="flex items-center justify-between gap-3">
                      <dt className="flex items-center gap-1.5 text-slate-600">
                        <Swatch color={COLORS.functional} />
                        Functional
                      </dt>
                      <dd className="font-semibold text-slate-800">
                        {d.functional}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="flex items-center gap-1.5 text-slate-600">
                        <Swatch color={COLORS.notFunctional} />
                        Non-functional
                      </dt>
                      <dd className="font-semibold text-slate-800">
                        {d.notFunctional}
                      </dd>
                    </div>
                    {unspecified > 0 && (
                      <div className="flex items-center justify-between gap-3">
                        <dt className="flex items-center gap-1.5 text-slate-600">
                          <Swatch color={COLORS.unspecified} />
                          Not recorded
                        </dt>
                        <dd className="font-semibold text-slate-800">
                          {unspecified}
                        </dd>
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-1">
                      <dt className="text-slate-500">Total</dt>
                      <dd className="font-semibold text-slate-800">{d.total}</dd>
                    </div>
                  </dl>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {rows.length > initialRows && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="text-primary mt-3 ml-2 text-xs font-medium hover:underline"
        >
          {showAll ? "Show top items only" : `Show all ${rows.length} items`}
        </button>
      )}
    </div>
  );
}
