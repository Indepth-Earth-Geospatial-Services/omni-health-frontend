"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchableSelectProps<T> {
  items: T[];
  value: string | null;
  onChange: (id: string) => void;
  getItemId: (item: T) => string;
  getItemLabel: (item: T) => string;
  /** Secondary text on the right of each option, e.g. an LGA or a count. */
  getItemMeta?: (item: T) => React.ReactNode;
  label?: string;
  required?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  /** "sm" is the compact toolbar variant; "md" matches the form inputs. */
  size?: "sm" | "md";
  className?: string;
}

/**
 * Single-select dropdown with a search box — for lists too long to scroll
 * (342 facilities, 84 catalogue items). Long labels truncate, with the full
 * text on hover.
 */
export function SearchableSelect<T>({
  items,
  value,
  onChange,
  getItemId,
  getItemLabel,
  getItemMeta,
  label,
  required,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyText = "Nothing found",
  disabled,
  isLoading,
  loadingText = "Loading…",
  icon,
  size = "md",
  className,
}: SearchableSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    searchInputRef.current?.focus();
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => getItemLabel(item).toLowerCase().includes(q));
  }, [items, search, getItemLabel]);

  const selected = items.find((item) => getItemId(item) === value);
  const selectedLabel = selected ? getItemLabel(selected) : null;

  const close = () => {
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div ref={rootRef} className={cn("min-w-0", className)}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => (isOpen ? close() : setIsOpen(true))}
          onKeyDown={(e) => e.key === "Escape" && close()}
          disabled={disabled || isLoading}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          title={selectedLabel ?? undefined}
          className={cn(
            "focus:border-primary focus:ring-primary/20 flex w-full items-center justify-between gap-2 rounded-lg border border-slate-300 bg-white text-left text-slate-600 transition-colors hover:border-slate-400 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            size === "sm" ? "px-3 py-2 text-sm" : "px-4 py-2.5 text-sm",
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            {isLoading ? (
              <>
                <Loader2 size={15} className="shrink-0 animate-spin" />
                <span className="truncate">{loadingText}</span>
              </>
            ) : (
              <>
                {icon && <span className="shrink-0">{icon}</span>}
                <span
                  className={cn(
                    "truncate",
                    selectedLabel ? "text-slate-800" : "text-slate-400",
                  )}
                >
                  {selectedLabel ?? placeholder}
                </span>
              </>
            )}
          </span>
          <ChevronDown
            size={15}
            className={cn(
              "shrink-0 text-slate-400 transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </button>

        {isOpen && !isLoading && (
          <div className="absolute top-full z-20 mt-1 w-full min-w-64 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
            <div className="relative border-b border-slate-100 p-2">
              <Search
                size={14}
                className="absolute top-1/2 left-5 -translate-y-1/2 text-slate-400"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && close()}
                placeholder={searchPlaceholder}
                className="focus:ring-primary/20 w-full rounded-md border border-slate-200 py-1.5 pr-3 pl-8 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
              />
            </div>
            <div role="listbox" className="max-h-60 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="px-4 py-3 text-center text-sm text-slate-500">
                  {emptyText}
                </div>
              ) : (
                filtered.map((item) => {
                  const id = getItemId(item);
                  const itemLabel = getItemLabel(item);
                  return (
                    <button
                      key={id}
                      type="button"
                      role="option"
                      aria-selected={value === id}
                      title={itemLabel}
                      onClick={() => {
                        onChange(id);
                        close();
                      }}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm transition-colors hover:bg-slate-50",
                        value === id && "bg-primary/5 text-primary font-medium",
                      )}
                    >
                      <span className="truncate">{itemLabel}</span>
                      {getItemMeta && (
                        <span className="shrink-0 text-xs text-slate-400">
                          {getItemMeta(item)}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
