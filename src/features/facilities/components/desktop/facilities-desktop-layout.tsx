"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarContentNav } from "@/features/user/components/desktop/sidebar-content";
import FacilityListItem from "@/components/shared/molecules/facility-list-item";
import { SearchAndFilter } from "@/components/shared/organisms/search-and-filter";
import { FacilityDetailsView } from "@/components/shared/organisms/facility-details-view";
import { useDebounce } from "@/hooks/use-debounce";
import { useAllFacilities } from "@/hooks/use-facilities";
import { useFacilitySearch } from "@/hooks/use-facility-search";
import { useSearchFilterStore } from "@/store/search-filter-store";
import { Facility } from "@/types";
import { SelectedFilters } from "@/types/search-filter";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import EmptyState from "../empty-state";
import Error from "../error";

export function FacilitiesDesktopLayout() {
  const { ref, inView } = useInView({ threshold: 0.5 });
  const [filters, setFilters] = useState<SelectedFilters>({});
  const [detailsFacility, setDetailsFacility] = useState<Facility | null>(null);

  const searchInput = useSearchFilterStore((state) => state.searchQuery);
  const clearAllFilters = useSearchFilterStore(
    (state) => state.clearAllFilters,
  );

  const debouncedSearchInput = useDebounce(searchInput, 500);

  const searchFilters = {
    ...filters,
    name:
      debouncedSearchInput.trim().length >= 3
        ? debouncedSearchInput.trim()
        : undefined,
  };

  const hasActiveFilters =
    (filters.facilityType && filters.facilityType.length > 0) ||
    (filters.serviceAvailability && filters.serviceAvailability.length > 0) ||
    (filters.lga && filters.lga.length > 0) ||
    debouncedSearchInput.trim().length >= 3;

  const searchQuery = useFacilitySearch(searchFilters);
  const allQuery = useAllFacilities();

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = hasActiveFilters ? searchQuery : allQuery;

  const totalFacilities = data?.pages[0]?.totalCount;

  const allFacilities = useMemo(
    () => data?.pages.flatMap((page) => page.facilities) || [],
    [data],
  );

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleViewDetails = useCallback((facility: Facility) => {
    setDetailsFacility(facility);
  }, []);

  const handleFilter = useCallback((filterValues: SelectedFilters) => {
    setFilters(filterValues);
  }, []);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, inView]);

  useEffect(() => {
    return () => {
      clearAllFilters();
    };
  }, [clearAllFilters]);

  return (
    <SidebarProvider
      defaultOpen={false}
      className="!mx-0 h-dvh !max-w-full overflow-hidden"
    >
      <SidebarContentNav />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#E2E4E9] px-5 py-4">
          <SidebarTrigger className="flex size-9 items-center justify-center rounded-full bg-[#E2E4E9] transition-colors hover:bg-gray-200" />
          <div className="flex-1">
            <h1 className="text-[23px] font-medium">Facilities</h1>
            {!isLoading && !error && (
              <p className="text-sm text-gray-500">
                {totalFacilities} facilities found
              </p>
            )}
          </div>
        </div>

        {/* Search & Filter */}
        <div className="shrink-0 border-b border-[#E2E4E9] px-5 py-3">
          <SearchAndFilter includeFilter={true} onApplyFilters={handleFilter} />
        </div>

        {/* Facility List */}
        <main className="scrollbar-hide flex-1 overflow-auto px-5 pb-5">
          {isLoading && (
            <div className="mt-8 flex flex-col items-center justify-center py-12">
              <Loader2 className="text-primary h-8 w-8 animate-spin" />
              <p className="mt-4 text-gray-600">Loading facilities...</p>
            </div>
          )}

          {error && (
            <Error
              error={error}
              isRefetching={isRefetching}
              refetch={refetch}
            />
          )}

          {!isLoading && !error && (
            <div className="mt-4">
              {allFacilities.length === 0 ? (
                <EmptyState />
              ) : (
                <>
                  <div className="space-y-3">
                    {allFacilities.map((facility) => (
                      <FacilityListItem
                        key={facility.facility_id}
                        facility={facility}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>

                  {hasNextPage && (
                    <div className="mt-6 flex justify-center">
                      <Button
                        onClick={loadMore}
                        disabled={isFetchingNextPage}
                        variant="outline"
                        className="w-full max-w-sm"
                      >
                        {isFetchingNextPage ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading more...
                          </>
                        ) : (
                          "Load More"
                        )}
                      </Button>
                    </div>
                  )}

                  <div ref={ref} className="h-1" />

                  {!hasNextPage && allFacilities.length > 0 && (
                    <p className="mt-6 text-center text-sm text-gray-500">
                      You&apos;ve reached the end of the list
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </main>
      </div>

      <FacilityDetailsView
        facility={detailsFacility}
        onClose={() => setDetailsFacility(null)}
      />
    </SidebarProvider>
  );
}
