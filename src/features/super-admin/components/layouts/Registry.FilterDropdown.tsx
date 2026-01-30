"use client";

import React, { useState, useMemo } from "react";
import {
  Filter,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Search,
  Check,
  MapPin,
  Building2,
  LayoutGrid,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FacilityFilterState,
  LGA_OPTIONS,
  CATEGORY_OPTIONS,
  FacilityOption,
} from "@/features/super-admin/components/types/types";

interface FilterDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  filters: FacilityFilterState;
  onFilterChange?: (filters: Partial<FacilityFilterState>) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  facilities: FacilityOption[];
  loadingFacilities: boolean;
}

type FilterView = "root" | "lga" | "facility" | "category";

// Add "All" option to LGA and Category lists
const ALL_LGA_OPTIONS = [{ value: "all", label: "All LGAs" }, ...LGA_OPTIONS];
const ALL_CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  ...CATEGORY_OPTIONS,
];

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  isOpen,
  onToggle,
  filters,
  onFilterChange,
  onClearFilters,
  activeFilterCount,
  dropdownRef,
  facilities,
  loadingFacilities,
}) => {
  const [filterView, setFilterView] = useState<FilterView>("root");
  const [internalSearch, setInternalSearch] = useState("");

  // Filter facilities by selected LGA
  const filteredFacilitiesByLGA = useMemo(() => {
    if (filters.selectedLGA === "all") {
      return facilities;
    }
    // Normalize both strings for comparison (trim, lowercase)
    const selectedLGA = filters.selectedLGA.toLowerCase().trim();
    return facilities.filter((f) => {
      const facilityLGA = f.facility_lga?.toLowerCase().trim() || "";
      // Check for exact match or if the facility LGA contains the selected LGA
      return facilityLGA === selectedLGA || facilityLGA.includes(selectedLGA);
    });
  }, [facilities, filters.selectedLGA]);

  // Build facility options with "All Facilities" at the top
  const facilityOptions = useMemo(() => {
    const allOption = { value: "all", label: "All Facilities" };
    const facilityList = filteredFacilitiesByLGA.map((f) => ({
      value: f.facility_id,
      label: f.facility_name,
    }));
    return [allOption, ...facilityList];
  }, [filteredFacilitiesByLGA]);

  // Get current selection labels for display
  const getSelectedLGALabel = () => {
    if (filters.selectedLGA === "all") return "All LGAs";
    return (
      LGA_OPTIONS.find((l) => l.value === filters.selectedLGA)?.label ||
      filters.selectedLGA
    );
  };

  const getSelectedFacilityLabel = () => {
    if (filters.selectedFacility === "all") return "All Facilities";
    return (
      facilities.find((f) => f.facility_id === filters.selectedFacility)
        ?.facility_name || "All Facilities"
    );
  };

  const getSelectedCategoryLabel = () => {
    if (filters.selectedCategory === "all") return "All Categories";
    return (
      CATEGORY_OPTIONS.find((c) => c.value === filters.selectedCategory)
        ?.label || filters.selectedCategory
    );
  };

  const renderFilterRoot = () => (
    <div className="p-2">
      {/* LGA Filter */}
      <button
        onClick={() => setFilterView("lga")}
        className={cn(
          "flex w-full items-center justify-between rounded-lg px-3 py-3 text-left hover:bg-slate-50",
          filters.selectedLGA !== "all" && "bg-purple-50"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg",
              filters.selectedLGA !== "all"
                ? "bg-purple-200 text-purple-700"
                : "bg-purple-100 text-purple-600"
            )}
          >
            <MapPin size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">LGAs</p>
            <p className="text-xs text-slate-500">{getSelectedLGALabel()}</p>
          </div>
        </div>
        <ChevronRight size={16} className="text-slate-400" />
      </button>

      {/* Facility Filter */}
      <button
        onClick={() => setFilterView("facility")}
        className={cn(
          "mt-1 flex w-full items-center justify-between rounded-lg px-3 py-3 text-left hover:bg-slate-50",
          filters.selectedFacility !== "all" && "bg-blue-50"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg",
              filters.selectedFacility !== "all"
                ? "bg-blue-200 text-blue-700"
                : "bg-blue-100 text-blue-600"
            )}
          >
            <Building2 size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">
              Facilities
              {filters.selectedLGA !== "all" && (
                <span className="ml-1 text-xs font-normal text-slate-400">
                  ({filteredFacilitiesByLGA.length} found)
                </span>
              )}
            </p>
            <p className="text-xs text-slate-500">
              {getSelectedFacilityLabel()}
              {filters.selectedLGA !== "all" && (
                <span className="ml-1 text-purple-600">
                  in {getSelectedLGALabel()}
                </span>
              )}
            </p>
          </div>
        </div>
        <ChevronRight size={16} className="text-slate-400" />
      </button>

      {/* Category Filter */}
      <button
        onClick={() => setFilterView("category")}
        className={cn(
          "mt-1 flex w-full items-center justify-between rounded-lg px-3 py-3 text-left hover:bg-slate-50",
          filters.selectedCategory !== "all" && "bg-amber-50"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg",
              filters.selectedCategory !== "all"
                ? "bg-amber-200 text-amber-700"
                : "bg-amber-100 text-amber-600"
            )}
          >
            <LayoutGrid size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">Categories</p>
            <p className="text-xs text-slate-500">{getSelectedCategoryLabel()}</p>
          </div>
        </div>
        <ChevronRight size={16} className="text-slate-400" />
      </button>
    </div>
  );

  const renderFilterList = (
    title: string,
    options: { value: string; label: string }[],
    selectedValue: string,
    onSelect: (val: string) => void,
    emptyMessage?: string
  ) => {
    const filteredOptions = options.filter((opt) =>
      opt.label.toLowerCase().includes(internalSearch.toLowerCase())
    );

    return (
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-slate-100 px-2 py-3">
          <button
            onClick={() => {
              setFilterView("root");
              setInternalSearch("");
            }}
            className="rounded-md p-1 hover:bg-slate-100"
          >
            <ChevronLeft size={18} className="text-slate-500" />
          </button>
          <span className="text-sm font-semibold text-slate-800">{title}</span>
        </div>

        {/* Search */}
        <div className="p-2">
          <div className="relative">
            <Search
              size={14}
              className="absolute top-1/2 left-2.5 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              autoFocus
              placeholder={`Search ${title.replace("Select ", "")}...`}
              value={internalSearch}
              onChange={(e) => setInternalSearch(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 pr-3 pl-8 text-xs focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>

        {/* List */}
        <div className="max-h-60 flex-1 overflow-y-auto p-2">
          {loadingFacilities && title === "Select Facility" ? (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin text-slate-400" size={20} />
            </div>
          ) : (
            <>
              {filteredOptions.length === 0 && (
                <p className="py-4 text-center text-xs text-slate-400">
                  {emptyMessage || "No results found"}
                </p>
              )}
              {filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onSelect(opt.value);
                    onToggle(); // Close on select
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs transition-colors hover:bg-slate-50",
                    selectedValue === opt.value
                      ? "bg-primary/5 text-primary font-medium"
                      : "text-slate-600"
                  )}
                >
                  <span>{opt.label}</span>
                  {selectedValue === opt.value && (
                    <Check size={14} className="text-primary" />
                  )}
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    );
  };

  // Handle LGA selection - also reset facility if LGA changes
  const handleLGASelect = (value: string) => {
    // If LGA changes, reset facility selection to "all"
    if (value !== filters.selectedLGA) {
      onFilterChange?.({ selectedLGA: value, selectedFacility: "all" });
    } else {
      onFilterChange?.({ selectedLGA: value });
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={onToggle}
        className={cn(
          "flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50",
          activeFilterCount > 0 && "border-primary bg-primary/5"
        )}
      >
        <Filter size={16} className="text-slate-500" />
        Filter
        {activeFilterCount > 0 && (
          <span className="bg-primary flex h-5 w-5 items-center justify-center rounded-full text-xs text-white">
            {activeFilterCount}
          </span>
        )}
        <ChevronDown size={16} className="text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl ring-1 ring-black/5">
          {filterView === "root" && renderFilterRoot()}

          {filterView === "lga" &&
            renderFilterList(
              "Select LGA",
              ALL_LGA_OPTIONS,
              filters.selectedLGA,
              handleLGASelect
            )}

          {filterView === "facility" &&
            renderFilterList(
              filters.selectedLGA !== "all"
                ? `Facilities in ${getSelectedLGALabel()}`
                : "Select Facility",
              facilityOptions,
              filters.selectedFacility,
              (val) => onFilterChange?.({ selectedFacility: val }),
              filters.selectedLGA !== "all"
                ? `No facilities found in ${getSelectedLGALabel()}`
                : "No facilities found"
            )}

          {filterView === "category" &&
            renderFilterList(
              "Select Category",
              ALL_CATEGORY_OPTIONS,
              filters.selectedCategory,
              (val) => onFilterChange?.({ selectedCategory: val })
            )}

          {/* Footer: Clear All (only on root) */}
          {filterView === "root" && activeFilterCount > 0 && (
            <div className="border-t border-slate-100 bg-slate-50 p-2">
              <button
                onClick={onClearFilters}
                className="w-full rounded-md py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
