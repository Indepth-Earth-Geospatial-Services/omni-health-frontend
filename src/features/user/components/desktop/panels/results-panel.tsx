"use client";

import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import FacilityListItem from "@/components/shared/molecules/facility-list-item";
import { useDrawerData } from "@/features/user/hooks/use-drawer-data";
import { useFacilitySearch } from "@/hooks/use-facility-search";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchFilterStore } from "@/store/search-filter-store";
import { Facility } from "@/types";
import { SearchBar } from "@/components/shared/atoms/search-bar";
import {
  LoadingView,
  LoadMoreTrigger,
  NoFacilitiesView,
} from "../../molecules/result-drawer-parts";
import FacilityListItemErrorCard from "../../facility-list-item-error-card";
import { Loader2 } from "lucide-react";
import { DesktopMobileNav } from "../desktop-mobile-nav";

interface ResultsPanelProps {
  className?: string;
  isGettingLocation: boolean;
  onViewDetails?: (facility: Facility) => void;
}

export function ResultsPanel({
  className,
  isGettingLocation,
  onViewDetails,
}: ResultsPanelProps) {
  const searchInput = useSearchFilterStore((state) => state.searchQuery);
  const setSearchQuery = useSearchFilterStore((state) => state.setSearchQuery);

  const debouncedSearchInput = useDebounce(searchInput, 500);
  const effectiveSearchName =
    debouncedSearchInput.trim().length >= 3
      ? debouncedSearchInput.trim()
      : undefined;
  const isSearching = !!effectiveSearchName;

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isError: isSearchError,
    error: searchError,
    fetchNextPage: fetchNextSearchPage,
    hasNextPage: hasNextSearchPage,
    isFetchingNextPage: isFetchingNextSearchPage,
  } = useFacilitySearch({ name: effectiveSearchName });

  const searchFacilities = useMemo(
    () => searchData?.pages.flatMap((page) => page.facilities) || [],
    [searchData],
  );

  const { ref: searchLoadMoreRef, inView: searchInView } = useInView();

  useEffect(() => {
    if (searchInView && hasNextSearchPage && !isFetchingNextSearchPage) {
      fetchNextSearchPage();
    }
  }, [
    searchInView,
    hasNextSearchPage,
    isFetchingNextSearchPage,
    fetchNextSearchPage,
  ]);

  const typedLessThan3 =
    searchInput.trim().length > 0 && searchInput.trim().length < 3;

  const {
    nearestFacility,
    sortedFacilities,
    isLoading: isDrawerLoading,
    showEmptyState,
    hasLocation,
    nearestError,
    lgaError,
    refetchNearest,
    refetchLGA,
    loadMoreRef,
    isFetchingNextPage,
    hasNextPage,
  } = useDrawerData(isGettingLocation);

  return (
    <aside
      className={cn(
        "flex h-dvh w-[380px] shrink-0 flex-col border-r border-[#E2E4E9] bg-white pb-6 xl:w-[420px]",
        className,
      )}
    >
      {/* Header */}
      <div className="shrink-0 border-b border-[#E2E4E9] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="lg:hidden">
            <DesktopMobileNav />
          </div>
          <div>
            <h1 className="text-[17px] font-medium">
              Healthcare Facilities near you
            </h1>
            <p className="mt-0.5 text-[13px] text-[#868C98]">
              Medical Facilities within your LGA
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="shrink-0 border-b border-[#E2E4E9] px-5 py-3">
        <SearchBar
          value={searchInput}
          onChange={setSearchQuery}
          placeholder="Search facilities..."
          className="[&_input]:h-10 [&_input]:px-10 [&_input]:text-[13px]"
        />
      </div>

      {/* Facility List */}
      <div className="scrollbar-hide flex-1 overflow-y-auto px-5 py-3">
        <div className="space-y-3">
          {/* ── Searching: Loading ── */}
          {isSearching && isSearchLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          )}

          {/* ── Searching: Error ── */}
          {isSearching && isSearchError && (
            <FacilityListItemErrorCard
              message={searchError?.message || "Search failed"}
              onRetry={() => fetchNextSearchPage()}
            />
          )}

          {/* ── Searching: Empty results ── */}
          {isSearching && !isSearchLoading && !isSearchError && searchFacilities.length === 0 && (
            <div className="flex flex-col items-center py-12 text-center">
              <p className="text-sm font-medium text-gray-700">
                No facilities found for &quot;{searchInput}&quot;
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Try a different search term
              </p>
            </div>
          )}

          {/* ── Searching: Results ── */}
          {isSearching &&
            !isSearchLoading &&
            !isSearchError &&
            searchFacilities.length > 0 &&
            searchFacilities.map((facility) => (
              <FacilityListItem
                key={facility.facility_id}
                facility={facility}
                onViewDetails={onViewDetails}
              />
            ))}

          {/* ── Searching: Infinite scroll ── */}
          {isSearching && hasNextSearchPage && (
            <div ref={searchLoadMoreRef} className="flex justify-center py-2">
              {isFetchingNextSearchPage && (
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              )}
            </div>
          )}

          {/* ── Not searching: typed less than 3 chars ── */}
          {!isSearching && typedLessThan3 && (
            <p className="py-2 text-center text-xs text-gray-400">
              Type at least 3 characters to search
            </p>
          )}

          {/* ── Not searching: Drawer data ── */}
          {!isSearching && (
            <>
              {isDrawerLoading && <LoadingView />}

              {!isDrawerLoading && nearestError && (
                <FacilityListItemErrorCard
                  message={nearestError.message || "Failed to load"}
                  onRetry={refetchNearest}
                />
              )}

              {!isDrawerLoading && !nearestError && nearestFacility && (
                <FacilityListItem
                  facility={nearestFacility}
                  nearUser={true}
                  onViewDetails={onViewDetails}
                />
              )}

              {!isDrawerLoading && lgaError && (
                <FacilityListItemErrorCard
                  message={lgaError.message || "Failed to load"}
                  onRetry={refetchLGA}
                />
              )}

              {!isDrawerLoading &&
                !lgaError &&
                sortedFacilities.map((facility, i) => (
                  <FacilityListItem
                    key={`${facility.facility_id}-${i}`}
                    facility={facility}
                    onViewDetails={onViewDetails}
                  />
                ))}

              {!isDrawerLoading && !lgaError && (
                <LoadMoreTrigger
                  innerRef={loadMoreRef}
                  isFetching={isFetchingNextPage}
                  hasMore={hasNextPage}
                  hasItems={sortedFacilities.length > 0}
                />
              )}

              {showEmptyState && <NoFacilitiesView hasLocation={hasLocation} />}
            </>
          )}
        </div>

        {/* Bottom padding */}
        <div className="h-8" />
      </div>
    </aside>
  );
}
