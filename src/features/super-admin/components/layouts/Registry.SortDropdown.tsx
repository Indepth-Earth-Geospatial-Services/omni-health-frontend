import React from "react";
import { ArrowUpDown, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { SORT_OPTIONS } from "@/features/super-admin/components/types/types";

interface SortDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  currentSort: string;
  onSortChange?: (value: string) => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({
  isOpen,
  onToggle,
  currentSort,
  onSortChange,
  dropdownRef,
}) => {
  const currentLabel =
    SORT_OPTIONS.find((opt) => opt.value === currentSort)?.label || "Sort By";

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={onToggle}
        className={cn(
          "flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50",
          currentSort && "border-primary bg-primary/5",
        )}
      >
        <ArrowUpDown size={16} className="text-slate-500" />
        {currentLabel}
        <ChevronDown size={16} className="text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-lg ring-1 ring-black/5">
          <div className="border-b border-slate-200 px-4 py-3">
            <h3 className="text-sm font-semibold text-slate-900">Sort By</h3>
          </div>
          <div className="max-h-60 overflow-y-auto py-1">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onSortChange?.(
                    currentSort === option.value ? "" : option.value,
                  );
                  onToggle(); // Close on select
                }}
                className={cn(
                  "flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-slate-50",
                  currentSort === option.value &&
                    "bg-primary/5 text-primary font-medium",
                )}
              >
                <span>{option.label}</span>
                {currentSort === option.value && <Check size={16} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
