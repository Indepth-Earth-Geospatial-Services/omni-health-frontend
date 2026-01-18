"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FacilityListItem from "@/components/shared/molecules/facility-list-item";
import { useFacilitySearch } from "@/hooks/useFacilitySearch";
import { cn } from "@/lib/utils";
import { useSearchFilterStore } from "@/store/search-filter-store";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Loader2, Search, SlidersHorizontal, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useDebounce } from "@/hooks/useDebounce";
import { ActiveFilters } from "../atoms/active-filters";
import { SelectedFilters } from "@/types/search-filter";
import { useShallow } from "zustand/react/shallow";
import { Facility } from "@/types";

interface SearchResultsProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onViewDetails?: (facility: Facility) => void;
  includeFilter?: boolean;
  className?: string;
}

export function SearchResults({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  onViewDetails,
  includeFilter = false,
  className,
}: SearchResultsProps) {
  // ==================== REFS & HOOKS ====================
  const inputRef = useRef<HTMLInputElement>(null);
  const { ref: loadMoreRef, inView } = useInView();
  const [filterData, setFilterData] = useState<SelectedFilters>({});

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300, 2);
  const optimisedSearchQuery =
    debouncedSearchQuery.length >= 3 ? debouncedSearchQuery : undefined;

  // ==================== STORE STATE ====================
  const { selectedFilters, setIsFilterOpen, toggleFilter, isFilterOpen } =
    useSearchFilterStore(
      useShallow((state) => ({
        selectedFilters: state.selectedFilters,
        setIsFilterOpen: state.setIsFilterOpen,
        toggleFilter: state.toggleFilter,
        isFilterOpen: state.isFilterOpen,
      })),
    );

  // ==================== COMPUTED VALUES ====================
  const selectedFilterCount = useMemo(
    () =>
      Object.values(selectedFilters).reduce(
        (acc, curr) => acc + curr.length,
        0,
      ),
    [selectedFilters],
  );

  const hasActiveSearch = Boolean(optimisedSearchQuery);
  const hasActiveFilters = selectedFilterCount > 0;
  const hasAnyActiveInput = hasActiveSearch || hasActiveFilters;

  // ==================== DATA FETCHING ====================
  const {
    data: searchData,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = useFacilitySearch({ name: optimisedSearchQuery, ...filterData });
  // Flatten all facilities from all pages
  const facilities = useMemo(() => {
    if (!searchData?.pages) return [];
    return searchData.pages.flatMap((page) =>
      Object.values(page.facilities || []),
    );
  }, [searchData]);

  const totalResultsCount = facilities.length;
  const hasResults = totalResultsCount > 0;

  // ==================== EVENT HANDLERS ====================
  const handleRemoveFilter = (category: string, value: string) => {
    toggleFilter(category, value);
  };

  const handleClearSearch = () => {
    onSearchChange("");
  };

  const handleViewDetails = useCallback(
    (facility: Facility) => {
      onViewDetails?.(facility);
    },
    [onViewDetails],
  );

  // ==================== EFFECTS ====================
  // Auto-focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Load more when scrolled to bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Update filter data when filter sheet closes
  useEffect(() => {
    if (!isFilterOpen) {
      setFilterData(selectedFilters);
    }
  }, [isFilterOpen, selectedFilters]);

  // ==================== RENDER HELPERS ====================
  const renderSearchStatus = () => {
    if (!hasAnyActiveInput) return null;

    const statusText = hasActiveSearch
      ? `"${searchQuery}"`
      : "selected filters";

    if (isLoading) {
      return (
        <p className="text-sm text-gray-500">
          <span className="flex items-center gap-2">
            <Loader2 className="h-3 w-3 animate-spin" />
            Searching...
          </span>
        </p>
      );
    }

    if (isError) {
      return <p className="text-sm text-red-500">Error searching facilities</p>;
    }

    if (hasResults) {
      return (
        <p className="text-sm text-gray-500">
          {totalResultsCount} result{totalResultsCount === 1 ? "" : "s"} for{" "}
          {statusText}
        </p>
      );
    }

    return <p className="text-sm text-gray-500">No results for {statusText}</p>;
  };

  const renderContent = () => {
    // Loading state (initial load)
    if (isLoading && !hasResults) {
      return (
        <div className="space-y-3 p-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-29.5 rounded-lg bg-gray-200"></div>
            </div>
          ))}
        </div>
      );
    }

    // Error state
    if (isError) {
      return (
        <div className="flex h-full flex-col items-center p-4 pt-25">
          <div className="rounded-full bg-red-100 p-4">
            <X className="h-8 w-8 text-red-500" />
          </div>
          <p className="mt-4 text-center text-base font-medium text-gray-900">
            Failed to load search results
          </p>
          <p className="mt-1 text-center text-sm text-gray-500">
            {error?.message || "Please try again"}
          </p>
        </div>
      );
    }

    // Empty state - No search input or filters
    if (!hasAnyActiveInput) {
      return (
        <div className="flex h-full flex-col items-center p-4 pt-25">
          <div className="rounded-full bg-gray-50 p-4">
            <Search className="text-primary h-8 w-8" />
          </div>
          <p className="mt-4 text-center text-base font-medium text-gray-900">
            Start searching
          </p>
          <p className="mt-1 text-center text-sm text-gray-500">
            Search by facility name or use filters
          </p>
        </div>
      );
    }

    // No results state
    if (!hasResults) {
      return (
        <div className="flex h-full flex-col items-center p-4 pt-25">
          <div className="rounded-full bg-gray-100 p-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <p className="mt-4 text-center text-base font-medium text-gray-900">
            No facilities found
          </p>
          <p className="mt-1 text-center text-sm text-gray-500">
            {hasActiveSearch
              ? "Try different search terms or adjust filters"
              : "Try adjusting your filters"}
          </p>
        </div>
      );
    }

    // Results list
    return (
      <div className="space-y-3 p-4 pb-6">
        {facilities.map((facility) => (
          <FacilityListItem
            key={facility.facility_id}
            facility={facility}
            onViewDetails={() => handleViewDetails(facility)}
          />
        ))}

        {/* Load More Section */}
        {hasNextPage && (
          <div
            ref={loadMoreRef}
            className="flex items-center justify-center py-4"
          >
            {isFetchingNextPage ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading more...
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                className="w-full"
              >
                Load More
              </Button>
            )}
          </div>
        )}

        {/* End of results indicator */}
        {!hasNextPage && (
          <div className="py-4 text-center text-sm text-gray-500">
            You&apos;ve reached the end
          </div>
        )}
      </div>
    );
  };

  // ==================== MAIN RENDER ====================
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className={cn("fixed inset-0 z-50 flex flex-col bg-white", className)}
        >
          {/* ==================== HEADER ==================== */}
          <div className="shrink-0 border-b border-[#E2E4E9] bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              {/* Back Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-10 w-10 shrink-0"
                aria-label="Close search"
              >
                <ArrowLeft size={20} />
              </Button>

              {/* Search Input */}
              <div className="relative flex-1">
                <Input
                  ref={inputRef}
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="h-12 rounded-full border border-[#E2E4E9] bg-white pr-10 pl-4"
                  placeholder="Search for facilities..."
                  autoFocus
                />

                {/* Clear Button */}
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClearSearch}
                    className="absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2"
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>

              {/* Filter Button */}
              {includeFilter && (
                <Button
                  size="icon"
                  onClick={() => setIsFilterOpen(true)}
                  className="relative h-10 w-10 shrink-0"
                  aria-label="Open filters"
                >
                  <SlidersHorizontal size={20} />
                  {selectedFilterCount > 0 && (
                    <span className="bg-primary absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium text-white">
                      {selectedFilterCount}
                    </span>
                  )}
                </Button>
              )}
            </div>

            {/* Active Filters & Status Section */}
            <div className="mt-3 space-y-2">
              {/* Active Filters Display */}
              {hasActiveFilters && (
                <ActiveFilters
                  selectedFilters={selectedFilters}
                  onRemoveFilter={handleRemoveFilter}
                />
              )}

              {/* Search Status */}
              {renderSearchStatus()}
            </div>
          </div>

          {/* ==================== RESULTS CONTAINER ==================== */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            {renderContent()}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
