"use client";
import FacilityListItem from "@/components/shared/molecules/facility-list-item";
import { SearchAndFilter } from "@/components/shared/organisms/search-and-filter";
import { useFacilityStore } from "@/features/user/store/facility-store";
import { useDebounce } from "@/hooks/useDebounce";
import { useAllFacilities } from "@/hooks/use-facilities";
import { useFacilitySearch } from "@/hooks/use-facility-search";
import { useSearchFilterStore } from "@/store/search-filter-store";
import { Facility } from "@/types";
import { SelectedFilters } from "@/types/search-filter";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Button } from "../../../components/ui/button";
import EmptyState from "../components/empty-state";
import Error from "../components/error";
function FacilitiesPage() {
  const router = useRouter();
  const { ref, inView } = useInView({ threshold: 0.5 });
  const [filters, setFilters] = useState<SelectedFilters>({});

  const searchInput = useSearchFilterStore((state) => state.searchQuery);

  const setSelectedFacility = useFacilityStore(
    (state) => state.setSelectedFacility,
  );

  const clearAllFilters = useSearchFilterStore(
    (state) => state.clearAllFilters,
  );

  const debouncedSearchInput = useDebounce(searchInput, 500);

  // Combine filters with search input only when search is at least 3 characters
  const searchFilters = {
    ...filters,
    name:
      debouncedSearchInput.trim().length >= 3
        ? debouncedSearchInput.trim()
        : undefined,
  };

  // Check if we have any active filters (including search)
  const hasActiveFilters =
    (filters.facilityType && filters.facilityType.length > 0) ||
    (filters.performanceTier && filters.performanceTier.length > 0) ||
    (filters.serviceAvailability && filters.serviceAvailability.length > 0) ||
    (filters.lga && filters.lga.length > 0) ||
    debouncedSearchInput.trim().length >= 3;

  // Use search hook when filters are applied, otherwise use all facilities
  const searchQuery = useFacilitySearch(searchFilters);
  const allQuery = useAllFacilities();

  // Pick the right query based on filter state
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

  // Calculate total facilities
  const totalFacilities = data?.pages[0]?.totalCount;

  // Flatten all facilities from pages and cache
  const allFacilities = useMemo(
    () => data?.pages.flatMap((page) => page.facilities) || [],
    [data],
  );

  // Function to load more facilities
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleViewDetails = useCallback(
    (facility: Facility) => {
      setSelectedFacility(facility);
      router.push(`/facilities/${facility.facility_id}`);
    },
    [router, setSelectedFacility],
  );

  // eslint-disable-next-line
  const handleFilter = useCallback((filterValues: any) => {
    setFilters(filterValues);
  }, []);

  // Set up infinite scroll with intersection observer
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, inView]);

  useEffect(() => {
    return () => {
      // Clear search query when leaving facilities page
      clearAllFilters();
    };
  }, [clearAllFilters]);

  return (
    <main className="scrollbar-hide h-dvh overflow-auto px-5 pb-5">
      <div className="sticky top-0 z-30 bg-white pt-5">
        <div className="mb-3 flex items-start gap-3">
          <Link href="/user">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex-1">
            <h1 className="text-[23px] font-medium">Facilities</h1>
            {!isLoading && !error && (
              <p className="text-sm text-gray-500">
                {totalFacilities} facilities found
              </p>
            )}
          </div>
        </div>

        <SearchAndFilter includeFilter={true} onApplyFilters={handleFilter} />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="mt-8 flex flex-col items-center justify-center py-12">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="mt-4 text-gray-600">Loading facilities...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Error error={error} isRefetching={isRefetching} refetch={refetch} />
      )}

      {/* Success State */}
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

              {/* Load more indicator */}
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

              {/* Infinite scroll sentinel */}
              <div ref={ref} className="h-1" />

              {/* No more facilities */}
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
  );
}

export default FacilitiesPage;
