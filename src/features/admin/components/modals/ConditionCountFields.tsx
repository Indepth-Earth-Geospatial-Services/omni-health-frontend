"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ConditionDraft {
  functional: string;
  notFunctional: string;
}

/** Parses a draft into counts, or null when either field is not a whole number ≥ 0. */
export function parseConditionDraft(draft: ConditionDraft) {
  const functional = Number(draft.functional || 0);
  const notFunctional = Number(draft.notFunctional || 0);
  const valid = (n: number) => Number.isInteger(n) && n >= 0;
  return valid(functional) && valid(notFunctional)
    ? { functional, notFunctional }
    : null;
}

interface ConditionCountFieldsProps {
  value: ConditionDraft;
  onChange: (next: ConditionDraft) => void;
  disabled?: boolean;
  /** Recorded units the two conditions don't account for — kept on save. */
  surplus?: number;
  error?: string;
}

/**
 * Functional / non-functional inputs with the resulting total. Total is
 * derived, not entered — the API defaults it to the sum.
 */
export function ConditionCountFields({
  value,
  onChange,
  disabled,
  surplus = 0,
  error,
}: ConditionCountFieldsProps) {
  const parsed = parseConditionDraft(value);
  const total = parsed ? parsed.functional + parsed.notFunctional + surplus : null;

  const inputClass = cn(
    "focus:border-primary focus:ring-primary/20 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-700 tabular-nums transition-colors hover:border-slate-400 focus:ring-2 focus:outline-none disabled:opacity-50",
    error ? "border-red-500" : "border-slate-300",
  );

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="functional"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Functional
          </label>
          <input
            id="functional"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            value={value.functional}
            onChange={(e) => onChange({ ...value, functional: e.target.value })}
            placeholder="0"
            disabled={disabled}
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="notFunctional"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Non-functional
          </label>
          <input
            id="notFunctional"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            value={value.notFunctional}
            onChange={(e) =>
              onChange({ ...value, notFunctional: e.target.value })
            }
            placeholder="0"
            disabled={disabled}
            className={inputClass}
          />
        </div>
      </div>
      {error ? (
        <p className="mt-2 text-xs text-red-500">{error}</p>
      ) : (
        <p className="mt-2 text-xs text-slate-500">
          {total === null ? (
            <span className="text-red-500">
              Counts must be whole numbers, 0 or more.
            </span>
          ) : (
            <>
              Total:{" "}
              <span className="font-semibold text-slate-800 tabular-nums">
                {total}
              </span>
              {surplus > 0 && (
                <span className="text-slate-400">
                  {" "}
                  (includes {surplus} recorded without a condition)
                </span>
              )}
            </>
          )}
        </p>
      )}
    </div>
  );
}
