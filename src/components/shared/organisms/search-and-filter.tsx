"use client";
import { useDrawerStore } from "@/features/user/store/drawer-store";
import { useFacilityStore } from "@/features/user/store/facility-store";
import { useSearchFilterStore } from "@/store/search-filter-store";
import { Facility } from "@/types";
import { SelectedFilters } from "@/types/search-filter";
import { useCallback, useEffect } from "react";
import { ActiveFilters } from "../atoms/active-filters";
import { FilterButton } from "../atoms/filter-button";
import { SearchBar } from "../atoms/search-bar";
import { FilterSheet } from "../molecules/filter-sheet";
import { SearchResults } from "../molecules/search-results";

interface SearchAndFilterProps {
  onApplyFilters?: (filters: SelectedFilters) => void;
  includeFilter?: boolean;
  includeExpandedSearchFilter?: boolean;
  includeSearchResults?: boolean;
  className?: string;
}

export function SearchAndFilter({
  onApplyFilters,
  includeFilter = false,
  includeExpandedSearchFilter = false,
  includeSearchResults = false,
  className,
}: SearchAndFilterProps) {
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
  const setSelectedFacility = useFacilityStore(
    (state) => state.setSelectedFacility,
  );
  // Calculate selected count for badge
  const selectedCount = Object.values(selectedFilters).reduce(
    (acc, curr) => acc + curr.length,
    0,
  );

  // Handle search focus
  const handleSearchFocus = useCallback(() => {
    if (!includeSearchResults) return;
    setIsSearchExpanded(true);
  }, [setIsSearchExpanded, includeSearchResults]);

  // Handle apply filters
  const handleApplyFilters = useCallback(() => {
    onApplyFilters?.(selectedFilters);
    setIsFilterOpen(false);
  }, [onApplyFilters, selectedFilters, setIsFilterOpen]);

  // Handle remove filter
  const handleRemoveFilter = (category: string, value: string) => {
    toggleFilter(category, value);
  };

  const handleViewDetails = useCallback(
    (facility: Facility) => {
      setSelectedFacility(facility);
      openDetails();
      setIsSearchExpanded(false);
    },
    [setSelectedFacility, openDetails, setIsSearchExpanded],
  );

  useEffect(() => {
    if (isFilterOpen) return;
    onApplyFilters?.(selectedFilters);
  }, [isFilterOpen, onApplyFilters, selectedFilters]);

  return (
    <div className={className}>
      {/* Search Bar with Filter Button */}
      <div className="relative mb-6 w-full">
        <div className="relative w-full">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
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
      {includeFilter && selectedFilters && (
        <ActiveFilters
          selectedFilters={selectedFilters}
          onRemoveFilter={handleRemoveFilter}
        />
      )}
      {(includeFilter || includeExpandedSearchFilter) && (
        <FilterSheet
          isOpen={isFilterOpen}
          onOpenChange={setIsFilterOpen}
          selectedFilters={selectedFilters}
          onFilterChange={toggleFilter}
          onApplyFilters={handleApplyFilters}
          onClearAll={clearAllFilters}
        />
      )}

      {/* Expanded Search Results Panel */}
      {includeSearchResults && (
        <SearchResults
          includeFilter={includeExpandedSearchFilter}
          isOpen={isSearchExpanded}
          onClose={() => setIsSearchExpanded(false)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onViewDetails={handleViewDetails}
        />
      )}
    </div>
  );
}
