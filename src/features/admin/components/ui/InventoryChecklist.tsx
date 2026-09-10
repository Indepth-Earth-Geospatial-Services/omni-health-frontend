"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  Search,
  Minus,
  Loader2,
  ClipboardList,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import type { InventoryItem } from "@/features/admin/hooks/use-equipment-actions";

type StockFilter = "in-stock" | "missing" | "all";

interface InventoryChecklistProps {
  title: string;
  items: InventoryItem[];
  isOpen: boolean;
  onToggle: () => void;
  onAdd: () => void;
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  onSetQuantity: (itemName: string, quantity: number) => Promise<void>;
  onSaveStockTake: (
    changes: { itemName: string; quantity: number }[],
  ) => Promise<void>;
  isAdding: boolean;
  addButtonLabel: string;
  icon: LucideIcon;
  emptyMessage: string;
}

/** How long the stepper waits after the last click before writing. */
const STEPPER_SAVE_DELAY = 700;

export function InventoryChecklist({
  title,
  items,
  isOpen,
  onToggle,
  onAdd,
  onEdit,
  onDelete,
  onSetQuantity,
  onSaveStockTake,
  isAdding,
  addButtonLabel,
  icon: Icon,
  emptyMessage,
}: InventoryChecklistProps) {
  const [filter, setFilter] = useState<StockFilter>("in-stock");
  const [search, setSearch] = useState("");
  const [isStockTake, setIsStockTake] = useState(false);
  const [isSavingStockTake, setIsSavingStockTake] = useState(false);

  /** Quantities shown while a write is in flight, so the number moves at once. */
  const [drafts, setDrafts] = useState<Record<string, number>>({});
  /** Stock-take edits, keyed by item name. */
  const [stockTakeDrafts, setStockTakeDrafts] = useState<
    Record<string, string>
  >({});

  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const quantityOf = (item: InventoryItem) =>
    drafts[item.name] ?? Number(item.quantity) ?? 0;

  const inStockCount = items.filter((i) => Number(i.quantity) > 0).length;
  const missingCount = items.length - inStockCount;

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items
      .filter((item) => {
        const qty = Number(item.quantity) || 0;
        if (filter === "in-stock" && qty <= 0) return false;
        if (filter === "missing" && qty > 0) return false;
        return !query || item.displayName.toLowerCase().includes(query);
      })
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [items, filter, search]);

  /**
   * Move the number immediately and write once the clicking stops — a stepper
   * that fired a request per tap would send five writes for "0 → 5".
   */
  const step = (item: InventoryItem, delta: number) => {
    const next = Math.max(0, quantityOf(item) + delta);
    setDrafts((prev) => ({ ...prev, [item.name]: next }));

    clearTimeout(saveTimers.current[item.name]);
    saveTimers.current[item.name] = setTimeout(() => {
      void onSetQuantity(item.name, next).finally(() => {
        // Drop the draft so the row falls back to the refetched server value.
        setDrafts((prev) => {
          const rest = { ...prev };
          delete rest[item.name];
          return rest;
        });
      });
    }, STEPPER_SAVE_DELAY);
  };

  const startStockTake = () => {
    setStockTakeDrafts(
      Object.fromEntries(items.map((i) => [i.name, String(Number(i.quantity) || 0)])),
    );
    setIsStockTake(true);
  };

  const stockTakeChanges = Object.entries(stockTakeDrafts)
    .map(([itemName, raw]) => ({ itemName, quantity: Number(raw) }))
    .filter(({ itemName, quantity }) => {
      if (!Number.isFinite(quantity) || quantity < 0) return false;
      const original = items.find((i) => i.name === itemName);
      return original && Number(original.quantity) !== quantity;
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
                ? "Nothing tracked yet"
                : `${inStockCount} of ${items.length} in stock · ${missingCount} missing`}
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
          <Button size="sm" onClick={onAdd} disabled={isAdding}>
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
                  Enter the count for every item. Only changed rows are saved.
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

              <div className="grid max-h-150 grid-cols-1 gap-x-6 gap-y-1 overflow-y-auto px-4 py-3 sm:grid-cols-2 sm:px-5 xl:grid-cols-3">
                {items.map((item) => (
                  <label
                    key={item.name}
                    className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 hover:bg-slate-50"
                  >
                    <span className="truncate text-sm text-slate-700">
                      {item.displayName}
                    </span>
                    <input
                      type="number"
                      min={0}
                      inputMode="numeric"
                      value={stockTakeDrafts[item.name] ?? ""}
                      onChange={(e) =>
                        setStockTakeDrafts((prev) => ({
                          ...prev,
                          [item.name]: e.target.value,
                        }))
                      }
                      disabled={isSavingStockTake}
                      className="focus:border-primary focus:ring-primary/20 w-16 shrink-0 rounded-md border border-slate-200 px-2 py-1 text-right text-sm focus:ring-2 focus:outline-none disabled:opacity-50"
                    />
                  </label>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-4 py-3 sm:px-5">
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
                  <div className="flex shrink-0 gap-1">
                    {(
                      [
                        ["in-stock", "In stock", inStockCount],
                        ["missing", "Missing", missingCount],
                        ["all", "All", items.length],
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
                      : filter === "in-stock"
                        ? "No items are in stock yet."
                        : "Nothing is missing — every item has a count."}
                  </p>
                ) : (
                  visibleItems.map((item) => {
                    const qty = quantityOf(item);
                    const isEmpty = qty <= 0;

                    return (
                      <div
                        key={item.name}
                        className="group flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-slate-50 sm:px-5"
                      >
                        {/* Filled dot reads as "we have this" at a glance */}
                        <span
                          aria-hidden
                          className={cn(
                            "h-2 w-2 shrink-0 rounded-full",
                            isEmpty
                              ? "bg-white ring-1 ring-slate-300"
                              : "bg-emerald-500",
                          )}
                        />

                        <p
                          className={cn(
                            "min-w-0 flex-1 truncate text-sm",
                            isEmpty ? "text-slate-400" : "text-slate-800",
                          )}
                        >
                          {item.displayName}
                        </p>

                        {/* Stepper — the common action, no modal in the way */}
                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            type="button"
                            onClick={() => step(item, -1)}
                            disabled={isEmpty}
                            aria-label={`Decrease ${item.displayName}`}
                            className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-200 disabled:opacity-30"
                          >
                            <Minus size={14} />
                          </button>
                          <span
                            className={cn(
                              "w-8 text-center text-sm font-semibold tabular-nums",
                              isEmpty ? "text-slate-300" : "text-slate-800",
                            )}
                          >
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => step(item, 1)}
                            aria-label={`Increase ${item.displayName}`}
                            className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-200"
                          >
                            <Plus size={14} />
                          </button>
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
