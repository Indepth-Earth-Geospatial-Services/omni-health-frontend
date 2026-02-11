"use client";

import React, { useRef, useEffect } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";

interface MultiSelectDropdownProps<T> {
  items: T[];
  selectedIds: string[];
  getItemId: (item: T) => string;
  getItemLabel: (item: T) => string;
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  isAllSelected: boolean;
  isPartiallySelected: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  emptyText?: string;
  icon?: React.ReactNode;
  renderItemIcon?: (item: T) => React.ReactNode;
}

export function MultiSelectDropdown<T>({
  items,
  selectedIds,
  getItemId,
  getItemLabel,
  onToggle,
  onSelectAll,
  isAllSelected,
  isPartiallySelected,
  placeholder = "Select items...",
  searchPlaceholder = "Search...",
  label,
  required,
  disabled,
  isLoading,
  loadingText = "Loading...",
  emptyText = "No items found",
  icon,
  renderItemIcon,
}: MultiSelectDropdownProps<T>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const filteredItems = items.filter((item) =>
    getItemLabel(item).toLowerCase().includes(search.toLowerCase())
  );

  const getDisplayText = () => {
    if (isLoading) return loadingText;
    if (selectedIds.length === 0) return placeholder;
    if (selectedIds.length === 1) {
      const item = items.find((i) => getItemId(i) === selectedIds[0]);
      return item ? getItemLabel(item) : placeholder;
    }
    return `${selectedIds.length} selected`;
  };

  return (
    <div ref={dropdownRef}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && !isLoading && setIsOpen(!isOpen)}
          disabled={disabled || isLoading}
          className={`flex w-full items-center justify-between rounded-lg border bg-white px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 ${
            selectedIds.length > 0
              ? "border-teal-500 text-gray-700"
              : "border-gray-300 text-gray-500"
          }`}
        >
          <span className="flex items-center gap-2">
            {icon}
            {getDisplayText()}
          </span>
          <ChevronDown
            size={16}
            className={`text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && !isLoading && (
          <div className="absolute z-20 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
            {/* Search */}
            <div className="border-b border-gray-200 p-2">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-md border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Select All */}
            <button
              type="button"
              onClick={onSelectAll}
              className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <div
                className={`flex h-4 w-4 items-center justify-center rounded border ${
                  isAllSelected
                    ? "border-teal-500 bg-teal-500"
                    : isPartiallySelected
                      ? "border-teal-500 bg-teal-100"
                      : "border-gray-300"
                }`}
              >
                {isAllSelected && <Check size={12} className="text-white" />}
                {isPartiallySelected && !isAllSelected && (
                  <div className="h-2 w-2 rounded-sm bg-teal-500" />
                )}
              </div>
              Select All ({items.length})
            </button>

            {/* Item List */}
            <div className="max-h-48 overflow-y-auto">
              {filteredItems.length === 0 ? (
                <p className="px-4 py-3 text-center text-sm text-gray-500">
                  {emptyText}
                </p>
              ) : (
                filteredItems.map((item) => {
                  const id = getItemId(item);
                  const isSelected = selectedIds.includes(id);
                  return (
                    <button
                      type="button"
                      key={id}
                      onClick={() => onToggle(id)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <div
                        className={`flex h-4 w-4 items-center justify-center rounded border ${
                          isSelected
                            ? "border-teal-500 bg-teal-500"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && <Check size={12} className="text-white" />}
                      </div>
                      <span className="flex items-center gap-2">
                        {renderItemIcon?.(item)}
                        {getItemLabel(item)}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {selectedIds.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-2 text-xs text-gray-500">
                {selectedIds.length} of {items.length} selected
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Pills */}
      {selectedIds.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selectedIds.slice(0, 3).map((id) => {
            const item = items.find((i) => getItemId(i) === id);
            if (!item) return null;
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700"
              >
                {getItemLabel(item)}
                <button
                  type="button"
                  onClick={() => onToggle(id)}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-teal-100"
                >
                  <X size={12} />
                </button>
              </span>
            );
          })}
          {selectedIds.length > 3 && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
              +{selectedIds.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}
