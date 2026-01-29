"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Plus, X } from "lucide-react";
import { Button } from "@/features/admin/components/ui/button";
import { apiClient } from "@/lib/client";

// Import modules
import {
  ExportFormat,
  FacilityFilterState,
  INITIAL_FILTER_STATE,
  FacilityOption,
} from "@/features/super-admin/components/types/types";
import { SortDropdown } from "./Registry.SortDropdown";
import { FilterDropdown } from "./Registry.FilterDropdown";
import { ExportDropdown } from "./Registry.ExportDropdown";
import { ActiveFilters } from "./Registry.ActiveFilters";

interface RegistryHeaderProps {
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  showSortBy?: boolean;
  onSortChange?: (sortValue: string) => void;
  showFilters?: boolean;
  onFilterChange?: (filters: Partial<FacilityFilterState>) => void;
  showExport?: boolean;
  onExport?: (format: ExportFormat) => void;
  buttonLabel?: string;
  onButtonClick?: () => void;
  buttonIcon?: React.ReactNode;
  filters?: FacilityFilterState;
}

const RegistryHeader: React.FC<RegistryHeaderProps> = ({
  searchPlaceholder = "Search",
  onSearch,
  showSortBy = true,
  onSortChange,
  showFilters = true,
  onFilterChange,
  showExport = true,
  onExport,
  buttonLabel,
  onButtonClick,
  buttonIcon = <Plus size={18} />,
  filters = INITIAL_FILTER_STATE,
}) => {
  // --- States ---
  const [activeDropdown, setActiveDropdown] = useState<
    "none" | "sort" | "filter" | "export"
  >("none");
  const [facilities, setFacilities] = useState<FacilityOption[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(false);

  // --- Refs ---
  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  // --- Data Fetching ---
  useEffect(() => {
    if (activeDropdown === "filter" && facilities.length === 0) {
      const fetchFacilities = async () => {
        setLoadingFacilities(true);
        try {
          const response = await apiClient.get("/facilities", {
            params: { limit: 100 },
          });
          setFacilities(response.data.facilities || response.data || []);
        } catch (error) {
          console.error("Failed to fetch facilities:", error);
        } finally {
          setLoadingFacilities(false);
        }
      };
      fetchFacilities();
    }
  }, [activeDropdown, facilities.length]);

  // --- Click Outside Logic ---
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        activeDropdown === "sort" &&
        sortRef.current &&
        !sortRef.current.contains(target)
      ) {
        setActiveDropdown("none");
      }
      if (
        activeDropdown === "filter" &&
        filterRef.current &&
        !filterRef.current.contains(target)
      ) {
        setActiveDropdown("none");
      }
      if (
        activeDropdown === "export" &&
        exportRef.current &&
        !exportRef.current.contains(target)
      ) {
        setActiveDropdown("none");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);

  // --- Handlers ---
  const handleClearFilters = () => {
    onFilterChange?.({
      selectedCategory: "all",
      selectedLGA: "all",
      selectedFacility: "all",
    });
    onSortChange?.("");
  };

  const activeFilterCount = [
    filters.selectedCategory !== "all" ? 1 : 0,
    filters.selectedLGA !== "all" ? 1 : 0,
    filters.selectedFacility !== "all" ? 1 : 0,
    filters.sortBy ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="w-full bg-white pb-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={filters.searchQuery}
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-2 pr-10 pl-10 text-sm transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onSearch?.("")}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Actions Row */}
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <div className="hidden h-10 w-px bg-gray-200 md:block" />

          {/* Sort Dropdown */}
          {showSortBy && (
            <SortDropdown
              isOpen={activeDropdown === "sort"}
              onToggle={() =>
                setActiveDropdown(activeDropdown === "sort" ? "none" : "sort")
              }
              currentSort={filters.sortBy}
              onSortChange={onSortChange}
              dropdownRef={sortRef}
            />
          )}

          {/* Filter Dropdown */}
          {showFilters && (
            <FilterDropdown
              isOpen={activeDropdown === "filter"}
              onToggle={() =>
                setActiveDropdown(
                  activeDropdown === "filter" ? "none" : "filter",
                )
              }
              filters={filters}
              onFilterChange={onFilterChange}
              onClearFilters={handleClearFilters}
              activeFilterCount={activeFilterCount - (filters.sortBy ? 1 : 0)}
              dropdownRef={filterRef}
              facilities={facilities}
              loadingFacilities={loadingFacilities}
            />
          )}

          {/* Export Dropdown */}
          {showExport && (
            <ExportDropdown
              isOpen={activeDropdown === "export"}
              onToggle={() =>
                setActiveDropdown(
                  activeDropdown === "export" ? "none" : "export",
                )
              }
              onExport={onExport}
              dropdownRef={exportRef}
            />
          )}

          {/* Add New Button */}
          {buttonLabel && (
            <Button
              onClick={onButtonClick}
              size="xl"
              className="flex items-center gap-2 shadow-sm"
            >
              {buttonIcon}
              {buttonLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Active Filter Chips */}
      <ActiveFilters
        filters={filters}
        onFilterChange={onFilterChange}
        onSortChange={onSortChange}
        onClearFilters={handleClearFilters}
        facilities={facilities}
      />
    </div>
  );
};

export default RegistryHeader;
