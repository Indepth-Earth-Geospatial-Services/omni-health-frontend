"use client";

import React, { useMemo, useState } from "react";
import {
  ClipboardList,
  Hospital,
  Loader2,
  Package,
  Pencil,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/features/admin/components/ui/button";
import type {
  ConditionCounts,
  InventoryItem,
} from "@/features/admin/hooks/use-equipment-actions";
import type { InventoryType } from "@/services/admin.service";

export type InventoryRow = InventoryItem & { type: InventoryType };

export type StockTakeChange = { item: InventoryRow } & ConditionCounts;

interface InventoryTableProps {
  rows: InventoryRow[];
  /** Shown as a Facility column when set — the super-admin view, where the
   *  facility is a choice rather than the login's own. */
  facilityName?: string;
  /** The catalogue key column — useful to a super admin cross-referencing
   *  data, noise to a facility admin counting stock. */
  showItemId?: boolean;
  onEdit: (row: InventoryRow) => void;
  onDelete: (row: InventoryRow) => void;
  onSaveStockTake: (changes: StockTakeChange[]) => Promise<void>;
}

const rowKey = (r: InventoryRow) => `${r.type}:${r.name}`;

const toCount = (raw: string | undefined) => {
  const n = Number(raw || 0);
  return Number.isInteger(n) && n >= 0 ? n : null;
};

/** Units recorded without a condition — carried through a stock take. */
const surplusOf = (r: InventoryRow) =>
  Math.max(0, r.total - r.functional - r.notFunctional);

/**
 * Inventory rows as a table — item, catalogue ID, counts, actions — with a
 * stock-take mode that turns the two condition columns into inputs so a
 * whole count can be entered in one pass. Also serves as the condition
 * chart's table view.
 */
export function InventoryTable({
  rows,
  facilityName,
  showItemId = true,
  onEdit,
  onDelete,
  onSaveStockTake,
}: InventoryTableProps) {
  const [search, setSearch] = useState("");
  const [isStockTake, setIsStockTake] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [drafts, setDrafts] = useState<
    Record<string, { functional: string; notFunctional: string }>
  >({});

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows
      .filter(
        (r) =>
          !q || r.displayName.toLowerCase().includes(q) || r.name.includes(q),
      )
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [rows, search]);

  const startStockTake = () => {
    setDrafts(
      Object.fromEntries(
        rows.map((r) => [
          rowKey(r),
          {
            functional: String(r.functional),
            notFunctional: String(r.notFunctional),
          },
        ]),
      ),
    );
    setIsStockTake(true);
  };

  const invalid = Object.values(drafts).some(
    (d) => toCount(d.functional) === null || toCount(d.notFunctional) === null,
  );

  const changes: StockTakeChange[] =
    !isStockTake || invalid
      ? []
      : rows.flatMap((item) => {
          const d = drafts[rowKey(item)];
          if (!d) return [];
          const functional = toCount(d.functional)!;
          const notFunctional = toCount(d.notFunctional)!;
          return functional === item.functional &&
            notFunctional === item.notFunctional
            ? []
            : [{ item, functional, notFunctional }];
        });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveStockTake(changes);
      setIsStockTake(false);
    } catch {
      // The actions hook already toasted the failure; stay in stock-take mode
      // so the entered numbers are not lost.
    } finally {
      setIsSaving(false);
    }
  };

  const setDraft = (
    key: string,
    field: "functional" | "notFunctional",
    value: string,
  ) => setDrafts((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));

  const countInputClass =
    "focus:border-primary focus:ring-primary/20 w-20 rounded-md border border-slate-300 px-2 py-1 text-right text-sm tabular-nums focus:ring-2 focus:outline-none disabled:opacity-50";

  const columnCount = 5 + (showItemId ? 1 : 0) + (facilityName ? 1 : 0);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5">
        <h3 className="text-base font-semibold text-slate-800">
          Items{" "}
          <span className="text-sm font-normal text-slate-400">
            {visible.length}
          </span>
        </h3>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <div className="relative flex-1 sm:w-64 sm:flex-none">
            <Search
              size={14}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items…"
              className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-slate-200 py-1.5 pr-3 pl-8 text-sm focus:ring-2 focus:outline-none"
            />
          </div>
          {!isStockTake && rows.length > 0 && (
            <button
              type="button"
              onClick={startStockTake}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              <ClipboardList size={14} />
              Stock take
            </button>
          )}
        </div>
      </div>

      {isStockTake && (
        <div className="flex items-center justify-between gap-3 border-b border-amber-100 bg-amber-50/60 px-4 py-2.5 sm:px-5">
          <p className="text-xs text-amber-800">
            Stock take: enter what is functional and non-functional for each
            item. Only changed rows are saved.
          </p>
          <button
            type="button"
            onClick={() => setIsStockTake(false)}
            disabled={isSaving}
            aria-label="Cancel stock take"
            className="shrink-0 rounded-lg p-1 text-amber-700 hover:bg-amber-100 disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="max-h-[32rem] overflow-auto">
        <table
          className={cn(
            "w-full text-sm",
            facilityName
              ? "min-w-[52rem]"
              : showItemId
                ? "min-w-[44rem]"
                : "min-w-[36rem]",
          )}
        >
          <thead className="sticky top-0 z-[1] bg-slate-50 text-left text-xs font-medium text-slate-500">
            <tr>
              <th className="px-4 py-2.5 sm:px-5">Item</th>
              {showItemId && <th className="px-4 py-2.5">Item ID</th>}
              {facilityName && <th className="px-4 py-2.5">Facility</th>}
              <th className="px-4 py-2.5 text-right">Total</th>
              <th className="px-4 py-2.5 text-right">Functional</th>
              <th className="px-4 py-2.5 text-right">Non-functional</th>
              <th className="px-4 py-2.5 text-right sm:px-5">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.length === 0 ? (
              <tr>
                <td
                  colSpan={columnCount}
                  className="px-4 py-10 text-center text-sm text-slate-400"
                >
                  {rows.length === 0
                    ? "Nothing recorded yet."
                    : <>Nothing matches &ldquo;{search}&rdquo;</>}
                </td>
              </tr>
            ) : (
              visible.map((r) => {
                const key = rowKey(r);
                const TypeIcon = r.type === "equipment" ? Package : Hospital;
                const draft = drafts[key];
                const draftTotal =
                  isStockTake && draft
                    ? (toCount(draft.functional) ?? 0) +
                      (toCount(draft.notFunctional) ?? 0) +
                      surplusOf(r)
                    : r.total;

                return (
                  <tr key={key} className="group hover:bg-slate-50">
                    <td className="max-w-[18rem] px-4 py-2.5 sm:px-5">
                      <div className="flex items-center gap-2">
                        <TypeIcon
                          size={14}
                          className="shrink-0 text-slate-400"
                          aria-label={r.type}
                        />
                        <span
                          className={cn(
                            "truncate",
                            r.total > 0 ? "text-slate-800" : "text-slate-400",
                          )}
                          title={r.displayName}
                        >
                          {r.displayName}
                        </span>
                      </div>
                    </td>
                    {showItemId && (
                      <td className="max-w-[14rem] px-4 py-2.5">
                        <code
                          className="block truncate text-xs text-slate-500"
                          title={r.name}
                        >
                          {r.name}
                        </code>
                      </td>
                    )}
                    {facilityName && (
                      <td className="max-w-[12rem] px-4 py-2.5">
                        <span
                          className="block truncate text-slate-600"
                          title={facilityName}
                        >
                          {facilityName}
                        </span>
                      </td>
                    )}
                    <td className="px-4 py-2.5 text-right font-semibold text-slate-800 tabular-nums">
                      {draftTotal}
                    </td>
                    {isStockTake && draft ? (
                      <>
                        <td className="px-4 py-1.5 text-right">
                          <input
                            type="number"
                            min={0}
                            step={1}
                            inputMode="numeric"
                            aria-label={`${r.displayName} functional`}
                            value={draft.functional}
                            onChange={(e) =>
                              setDraft(key, "functional", e.target.value)
                            }
                            disabled={isSaving}
                            className={countInputClass}
                          />
                        </td>
                        <td className="px-4 py-1.5 text-right">
                          <input
                            type="number"
                            min={0}
                            step={1}
                            inputMode="numeric"
                            aria-label={`${r.displayName} non-functional`}
                            value={draft.notFunctional}
                            onChange={(e) =>
                              setDraft(key, "notFunctional", e.target.value)
                            }
                            disabled={isSaving}
                            className={countInputClass}
                          />
                        </td>
                        <td className="px-4 py-2.5 sm:px-5" />
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-2.5 text-right text-slate-700 tabular-nums">
                          {r.functional}
                        </td>
                        <td className="px-4 py-2.5 text-right text-slate-700 tabular-nums">
                          {r.notFunctional}
                        </td>
                        <td className="px-4 py-2.5 sm:px-5">
                          {/* Always rendered — hover-only actions are
                              unreachable on touch devices. */}
                          <div className="flex justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => onEdit(r)}
                              aria-label={`Edit ${r.displayName}`}
                              className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDelete(r)}
                              aria-label={`Delete ${r.displayName}`}
                              className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {isStockTake && (
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-4 py-3 sm:px-5">
          {invalid && (
            <p className="mr-auto text-xs text-red-600">
              Counts must be whole numbers, 0 or more.
            </p>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsStockTake(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving || changes.length === 0}
          >
            {isSaving ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Saving…
              </>
            ) : (
              `Save ${changes.length} change${changes.length === 1 ? "" : "s"}`
            )}
          </Button>
        </div>
      )}
    </section>
  );
}
