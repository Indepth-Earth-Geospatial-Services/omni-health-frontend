"use client";

import React, { useMemo, useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  ClipboardList,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import type {
  ConditionCounts,
  InventoryItem,
} from "@/features/admin/hooks/use-equipment-actions";

type StockFilter = "functional" | "non-functional" | "all";

type StockTakeChange = { item: InventoryItem } & ConditionCounts;

interface InventoryChecklistProps {
  title: string;
  items: InventoryItem[];
  isOpen: boolean;
  onToggle: () => void;
  onAdd: () => void;
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  onSaveStockTake: (changes: StockTakeChange[]) => Promise<void>;
  isAdding: boolean;
  addButtonLabel: string;
  /** Extra classes merged onto the "Add" button — e.g. to bump up its text size. */
  buttonClassName?: string;
  icon: LucideIcon;
  emptyMessage: string;
}

const toCount = (raw: string | undefined) => {
  const n = Number(raw || 0);
  return Number.isInteger(n) && n >= 0 ? n : null;
};

export function InventoryChecklist({
  title,
  items,
  isOpen,
  onToggle,
  onAdd,
  onEdit,
  onDelete,
  onSaveStockTake,
  isAdding,
  addButtonLabel,
  buttonClassName,
  icon: Icon,
  emptyMessage,
}: InventoryChecklistProps) {
  const [filter, setFilter] = useState<StockFilter>("functional");
  const [search, setSearch] = useState("");
  const [isStockTake, setIsStockTake] = useState(false);
  const [isSavingStockTake, setIsSavingStockTake] = useState(false);

  /** Stock-take edits, keyed by item name. */
  const [stockTakeDrafts, setStockTakeDrafts] = useState<
    Record<string, { functional: string; notFunctional: string }>
  >({});

  // An item can be both: 3 working and 1 not working counts in each.
  const functionalCount = items.filter((i) => i.functional > 0).length;
  const nonFunctionalCount = items.filter((i) => i.notFunctional > 0).length;

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items
      .filter((item) => {
        if (filter === "functional" && item.functional <= 0) return false;
        if (filter === "non-functional" && item.notFunctional <= 0)
          return false;
        return !query || item.displayName.toLowerCase().includes(query);
      })
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [items, filter, search]);

  const startStockTake = () => {
    setStockTakeDrafts(
      Object.fromEntries(
        items.map((i) => [
          i.name,
          {
            functional: String(i.functional),
            notFunctional: String(i.notFunctional),
          },
        ]),
      ),
    );
    setIsStockTake(true);
  };

  const stockTakeInvalid = Object.values(stockTakeDrafts).some(
    (d) => toCount(d.functional) === null || toCount(d.notFunctional) === null,
  );

  const stockTakeChanges: StockTakeChange[] = stockTakeInvalid
    ? []
    : items.flatMap((item) => {
        const draft = stockTakeDrafts[item.name];
        if (!draft) return [];
        const functional = toCount(draft.functional)!;
        const notFunctional = toCount(draft.notFunctional)!;
        return functional === item.functional &&
          notFunctional === item.notFunctional
          ? []
          : [{ item, functional, notFunctional }];
      });

  const handleSaveStockTake = async () => {
    setIsSavingStockTake(true);
    try {
      await onSaveStockTake(stockTakeChanges);
      setIsStockTake(false);
    } catch {
      // The hook has already surfaced the failure; stay in stock-take mode so
      // the entered numbers are not lost.
    } finally {
      setIsSavingStockTake(false);
    }
  };

  const setStockTakeField = (
    itemName: string,
    field: "functional" | "notFunctional",
    value: string,
  ) =>
    setStockTakeDrafts((prev) => ({
      ...prev,
      [itemName]: { ...prev[itemName], [field]: value },
    }));

  const stockTakeInputClass =
    "focus:border-primary focus:ring-primary/20 w-16 shrink-0 rounded-md border border-slate-200 px-2 py-1 text-right text-sm tabular-nums focus:ring-2 focus:outline-none disabled:opacity-50";

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border-2 border-slate-200 bg-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100">
            <Icon size={20} className="text-slate-600" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold text-slate-800">
              {title}
            </h3>
            {/* The question an admin actually opens this page to answer. */}
            <p className="mt-0.5 text-xs text-slate-500">
              {items.length === 0
                ? "Nothing recorded yet"
                : `${functionalCount} of ${items.length} functional · ${nonFunctionalCount} non-functional`}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {!isStockTake && items.length > 0 && (
            <button
              type="button"
              onClick={startStockTake}
              className="hidden items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 sm:flex"
            >
              <ClipboardList size={14} />
              Stock take
            </button>
          )}
          <Button
            size="lg"
            onClick={onAdd}
            disabled={isAdding}
            className={cn("shrink-0", buttonClassName)}
          >
            <Plus size={16} className="text-white" />
            <span className="hidden sm:inline">{addButtonLabel}</span>
            <span className="sm:hidden">Add</span>
          </Button>
          <button
            type="button"
            onClick={onToggle}
            aria-label={isOpen ? `Collapse ${title}` : `Expand ${title}`}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100"
          >
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <>
          {isStockTake ? (
            /* ── Stock take ─────────────────────────────────────────────── */
            <div className="flex flex-col">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-amber-50/60 px-4 py-3 sm:px-5">
                <p className="text-xs text-amber-800">
                  Count what works and what doesn&apos;t for every item. Only
                  changed rows are saved.
                </p>
                <button
                  type="button"
                  onClick={() => setIsStockTake(false)}
                  disabled={isSavingStockTake}
                  className="shrink-0 rounded-lg p-1 text-amber-700 hover:bg-amber-100 disabled:opacity-50"
                  aria-label="Cancel stock take"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex items-center justify-end gap-3 border-b border-slate-100 px-6 py-2 text-xs font-medium text-slate-500 sm:px-7">
                <span className="w-16 text-right">Working</span>
                <span className="w-16 text-right">Not working</span>
              </div>

              <div className="max-h-150 divide-y divide-slate-50 overflow-y-auto px-4 py-2 sm:px-5">
                {items
                  .slice()
                  .sort((a, b) => a.displayName.localeCompare(b.displayName))
                  .map((item) => {
                    const draft = stockTakeDrafts[item.name];
                    return (
                      <div
                        key={item.name}
                        className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 hover:bg-slate-50"
                      >
                        <span
                          className="min-w-0 truncate text-sm text-slate-700"
                          title={item.displayName}
                        >
                          {item.displayName}
                        </span>
                        <div className="flex shrink-0 items-center gap-3">
                          <input
                            type="number"
                            min={0}
                            step={1}
                            inputMode="numeric"
                            aria-label={`${item.displayName} working`}
                            value={draft?.functional ?? ""}
                            onChange={(e) =>
                              setStockTakeField(
                                item.name,
                                "functional",
                                e.target.value,
                              )
                            }
                            disabled={isSavingStockTake}
                            className={stockTakeInputClass}
                          />
                          <input
                            type="number"
                            min={0}
                            step={1}
                            inputMode="numeric"
                            aria-label={`${item.displayName} not working`}
                            value={draft?.notFunctional ?? ""}
                            onChange={(e) =>
                              setStockTakeField(
                                item.name,
                                "notFunctional",
                                e.target.value,
                              )
                            }
                            disabled={isSavingStockTake}
                            className={stockTakeInputClass}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-4 py-3 sm:px-5">
                {stockTakeInvalid && (
                  <p className="mr-auto text-xs text-red-600">
                    Counts must be whole numbers, 0 or more.
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setIsStockTake(false)}
                  disabled={isSavingStockTake}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <Button
                  size="sm"
                  onClick={handleSaveStockTake}
                  disabled={isSavingStockTake || stockTakeChanges.length === 0}
                >
                  {isSavingStockTake ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Saving…
                    </>
                  ) : (
                    `Save ${stockTakeChanges.length} change${stockTakeChanges.length === 1 ? "" : "s"}`
                  )}
                </Button>
              </div>
            </div>
          ) : (
            /* ── Checklist ──────────────────────────────────────────────── */
            <>
              {items.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-3 sm:px-5">
                  <div className="flex shrink-0 flex-wrap gap-1">
                    {(
                      [
                        ["all", "All", items.length],
                        ["functional", "Functional", functionalCount],
                        ["non-functional", "Non-functional", nonFunctionalCount],
                      ] as const
                    ).map(([value, label, count]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setFilter(value)}
                        className={cn(
                          "rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                          filter === value
                            ? "bg-primary text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                        )}
                      >
                        {label} {count}
                      </button>
                    ))}
                  </div>

                  <div className="relative min-w-40 flex-1">
                    <Search
                      size={15}
                      className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={`Search ${items.length} items…`}
                      className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-slate-200 py-1.5 pr-3 pl-9 text-sm focus:ring-2 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="max-h-150 divide-y divide-slate-100 overflow-y-auto">
                {items.length === 0 ? (
                  <p className="px-4 py-10 text-center text-sm text-slate-500">
                    {emptyMessage}
                  </p>
                ) : visibleItems.length === 0 ? (
                  <p className="px-4 py-10 text-center text-sm text-slate-400">
                    {search
                      ? `Nothing matches “${search}”`
                      : filter === "functional"
                        ? "No functional items yet."
                        : "Nothing is non-functional — every item works."}
                  </p>
                ) : (
                  visibleItems.map((item) => {
                    const { functional, notFunctional, total } = item;
                    const isEmpty = total <= 0;

                    return (
                      <div
                        key={item.name}
                        className="group flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-slate-50 sm:px-5"
                      >
                        {/* Dot: green = some work, amber = held but none
                            work, hollow = none held. */}
                        <span
                          aria-hidden
                          className={cn(
                            "h-2 w-2 shrink-0 rounded-full",
                            isEmpty
                              ? "bg-white ring-1 ring-slate-300"
                              : functional > 0
                                ? "bg-emerald-500"
                                : "bg-amber-500",
                          )}
                        />

                        <div className="min-w-0 flex-1">
                          <p
                            className={cn(
                              "truncate text-sm",
                              isEmpty ? "text-slate-400" : "text-slate-800",
                            )}
                            title={item.displayName}
                          >
                            {item.displayName}
                          </p>
                          <p className="text-xs text-slate-400 tabular-nums">
                            {total} total
                          </p>
                        </div>

                        {/* Read-only counts — editing is the pencil's job */}
                        <div className="flex shrink-0 items-center gap-3 text-sm font-semibold tabular-nums">
                          <span
                            title="Working"
                            className={cn(
                              "text-right",
                              functional > 0 ? "text-emerald-700" : "text-slate-300",
                            )}
                          >
                            {functional}
                            <span className="ml-1 hidden text-xs font-normal text-slate-400 sm:inline">
                              working
                            </span>
                          </span>
                          <span
                            title="Not working"
                            className={cn(
                              "text-right",
                              notFunctional > 0 ? "text-amber-700" : "text-slate-300",
                            )}
                          >
                            {notFunctional}
                            <span className="ml-1 hidden text-xs font-normal text-slate-400 sm:inline">
                              not working
                            </span>
                          </span>
                        </div>

                        {/* Always rendered — hover-only actions are unreachable
                            on touch devices. They just soften until hover. */}
                        <div className="flex shrink-0 items-center gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => onEdit(item)}
                            aria-label={`Edit ${item.displayName}`}
                            className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(item)}
                            aria-label={`Delete ${item.displayName}`}
                            className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
