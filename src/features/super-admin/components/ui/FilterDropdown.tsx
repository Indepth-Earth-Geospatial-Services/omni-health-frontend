"use client";

import React from "react";
import { ChevronDown, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface FilterDropdownProps {
  title: string;
  options: FilterOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  dropdownRef: (el: HTMLDivElement | null) => void;
  loading?: boolean;
  icon?: React.ReactNode;
  width?: string;
  dropdownWidth?: string;
}

export function FilterDropdown({
  title,
  options,
  selectedValue,
  onSelect,
  isOpen,
  onToggle,
  onClose,
  dropdownRef,
  loading = false,
  icon,
  width = "auto",
  dropdownWidth = "w-48",
}: FilterDropdownProps) {
  const selectedOption = options.find((opt) => opt.value === selectedValue);
  const hasActiveFilter = selectedValue !== "all";

  const handleSelect = (value: string) => {
    onSelect(value);
    onClose();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        disabled={loading}
        className={cn(
          "flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50",
          hasActiveFilter && "border-primary bg-primary/5",
          width !== "auto" && width
        )}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Loading...
          </>
        ) : (
          <>
            {icon}
            {selectedOption?.label || "Select..."}
            <ChevronDown size={16} className="text-gray-400" />
          </>
        )}
      </button>

      {isOpen && !loading && (
        <div
          className={cn(
            "absolute right-0 z-50 mt-2 rounded-xl border-2 border-slate-200 bg-white shadow-lg",
            dropdownWidth
          )}
        >
          <div className="border-b border-slate-200 px-4 py-3">
            <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-slate-50",
                  selectedValue === option.value &&
                    "bg-primary/5 text-primary font-medium"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {option.icon}
                    {option.label}
                  </span>
                  {selectedValue === option.value && <Check size={16} />}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
