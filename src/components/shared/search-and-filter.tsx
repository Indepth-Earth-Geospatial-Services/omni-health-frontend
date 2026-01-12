"use client";

import { useSearchFilterStore } from "@/store/search-filter-store";
import { SearchBar } from "./search-bar";
import { FilterButton } from "./filter-button";
import { ActiveFilters } from "./active-filters";
import { FilterSheet } from "./filter-sheet";
import { SearchResults } from "./search-Results";
import { useCallback } from "react";
import { useDrawerStore } from "@/features/user/store/drawer-store";
import { useFacilityStore } from "@/features/user/store/facility-store";

interface SearchAndFilterProps {
  onApplyFilters?: (filters: Record<string, string[]>) => void;
  includeFilter?: boolean;
  className?: string;
}

export function SearchAndFilter({
  onApplyFilters,
  includeFilter = false,
  className,
}: SearchAndFilterProps) {
  // Get state and actions from Zustand store
  const {
    searchQuery,
    isSearchExpanded,
    selectedFilters,
    isFilterOpen,
    setSearchQuery,
    setIsSearchExpanded,
    toggleFilter,
    clearAllFilters,
    setIsFilterOpen,
  } = useSearchFilterStore();
  const openDetails = useDrawerStore((state) => state.openDetails);
  const setSelectedFacilityId = useFacilityStore(
    (state) => state.setSelectedFacility,
  );
  // Calculate selected count for badge
  const selectedCount = Object.values(selectedFilters).reduce(
    (acc, curr) => acc + curr.length,
    0,
  );

  // Handle search focus
  const handleSearchFocus = () => {
    setIsSearchExpanded(true);
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    onApplyFilters?.(selectedFilters);
    setIsFilterOpen(false);
  };

  // Handle remove filter
  const handleRemoveFilter = (category: string, value: string) => {
    toggleFilter(category, value);
  };

  const handleViewDetails = useCallback(
    (facilityId: string) => {
      setSelectedFacilityId(facilityId);
      openDetails();
      setIsSearchExpanded(false);
    },
    [setSelectedFacilityId, openDetails, setIsSearchExpanded],
  );

  return (
    <div className={className}>
      {/* Search Bar with Filter Button */}
      <div className="relative mb-6 w-full">
        <div className="relative w-full">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onFocus={handleSearchFocus}
            // HACK
            onClick={handleSearchFocus}
          />

          {includeFilter && (
            <div className="absolute top-1/2 right-4 -translate-y-1/2">
              <FilterButton
                onClick={() => setIsFilterOpen(true)}
                badgeCount={selectedCount}
              />
            </div>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {includeFilter && (
        <>
          <ActiveFilters
            selectedFilters={selectedFilters}
            onRemoveFilter={handleRemoveFilter}
          />

          <FilterSheet
            isOpen={isFilterOpen}
            onOpenChange={setIsFilterOpen}
            selectedFilters={selectedFilters}
            onFilterChange={toggleFilter}
            onApplyFilters={handleApplyFilters}
            onClearAll={clearAllFilters}
          />
        </>
      )}

      {/* Expanded Search Results Panel */}
      <SearchResults
        isOpen={isSearchExpanded}
        onClose={() => setIsSearchExpanded(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
}
