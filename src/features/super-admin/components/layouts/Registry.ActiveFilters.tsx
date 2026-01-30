"use client";

import React from "react";
import { ArrowUpDown, X, MapPin, Building2, LayoutGrid } from "lucide-react";
import {
  FacilityFilterState,
  LGA_OPTIONS,
  CATEGORY_OPTIONS,
  SORT_OPTIONS,
  FacilityOption,
} from "@/features/super-admin/components/types/types"; // Ensure this path points to your types file

interface ActiveFiltersProps {
  filters: FacilityFilterState;
  onFilterChange?: (filters: Partial<FacilityFilterState>) => void;
  onSortChange?: (value: string) => void;
  onClearFilters: () => void;
  facilities: FacilityOption[];
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onFilterChange,
  onSortChange,
  onClearFilters,
  facilities,
}) => {
  const hasActiveFilters =
    filters.selectedLGA !== "all" ||
    filters.selectedFacility !== "all" ||
    filters.selectedCategory !== "all" ||
    filters.sortBy;

  if (!hasActiveFilters) return null;

  // Helper functions
  const getSelectedLGALabel = () =>
    LGA_OPTIONS.find((l) => l.value === filters.selectedLGA)?.label ||
    filters.selectedLGA;

  const getSelectedFacilityLabel = () =>
    facilities.find((f) => f.facility_id === filters.selectedFacility)
      ?.facility_name || filters.selectedFacility;

  const getSelectedCategoryLabel = () =>
    CATEGORY_OPTIONS.find((c) => c.value === filters.selectedCategory)?.label ||
    filters.selectedCategory;

  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === filters.sortBy)?.label ||
    "Sort By";

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-slate-500">
        Active filters:
      </span>

      {filters.sortBy && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 py-1 pr-1.5 pl-3 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
          <ArrowUpDown size={12} />
          {currentSortLabel}
          <button
            onClick={() => onSortChange?.("")}
            className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-300 text-slate-600 transition-colors hover:bg-slate-400 hover:text-white"
          >
            <X size={10} />
          </button>
        </span>
      )}

      {filters.selectedLGA !== "all" && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 py-1 pr-1.5 pl-3 text-xs font-medium text-purple-700 ring-1 ring-purple-200">
          <MapPin size={12} />
          {getSelectedLGALabel()}
          <button
            onClick={() => onFilterChange?.({ selectedLGA: "all" })}
            className="flex h-4 w-4 items-center justify-center rounded-full bg-purple-200 text-purple-600 transition-colors hover:bg-purple-300 hover:text-purple-800"
          >
            <X size={10} />
          </button>
        </span>
      )}

      {filters.selectedFacility !== "all" && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 py-1 pr-1.5 pl-3 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
          <Building2 size={12} />
          {getSelectedFacilityLabel()}
          <button
            onClick={() => onFilterChange?.({ selectedFacility: "all" })}
            className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-200 text-blue-600 transition-colors hover:bg-blue-300 hover:text-blue-800"
          >
            <X size={10} />
          </button>
        </span>
      )}

      {filters.selectedCategory !== "all" && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 py-1 pr-1.5 pl-3 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
          <LayoutGrid size={12} />
          {getSelectedCategoryLabel()}
          <button
            onClick={() => onFilterChange?.({ selectedCategory: "all" })}
            className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-200 text-amber-600 transition-colors hover:bg-amber-300 hover:text-amber-800"
          >
            <X size={10} />
          </button>
        </span>
      )}

      <button
        onClick={onClearFilters}
        className="ml-1 text-xs font-medium text-red-500 hover:text-red-600 hover:underline"
      >
        Clear all
      </button>
    </div>
  );
};
