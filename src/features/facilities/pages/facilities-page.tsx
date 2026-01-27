"use client";
import { SearchAndFilter } from "@/components/shared/organisms/search-and-filter";
import FacilityListItem from "@/components/shared/molecules/facility-list-item";
import { useAllFacilities } from "@/hooks/use-facilities";
import { useFacilitySearch } from "@/hooks/use-facility-search";
import { AlertCircle, ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Button } from "../../../components/ui/button";
import { useSearchFilterStore } from "@/store/search-filter-store";
import { useDebounce } from "@/hooks/use-debounce";
import { SelectedFilters } from "@/types/search-filter";
import { Facility } from "@/types";
import { useFacilityStore } from "@/features/user/store/facility-store";
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

  // Debounce the search input (500ms delay)
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

  // Flatten all facilities from pages
  const allFacilities = data?.pages.flatMap((page) => page.facilities) || [];

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

        <SearchAndFilter
          key="facilities variant"
          includeFilter={true}
          onApplyFilters={handleFilter}
        />
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
        <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <h3 className="font-medium text-red-700">
              Unable to load facilities
            </h3>
          </div>
          <p className="mt-2 text-sm text-red-600">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </p>
          <Button
            onClick={() => refetch()}
            disabled={isRefetching}
            variant="outline"
            className="mt-4"
          >
            {isRefetching ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Try Again
          </Button>
        </div>
      )}

      {/* Success State */}
      {!isLoading && !error && (
        <div className="mt-4">
          {allFacilities.length === 0 ? (
            <div className="py-12 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No facilities found
              </h3>
              <p className="mt-2 text-gray-600">
                Try adjusting your filters or check back later.
              </p>
            </div>
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
                  You've reached the end of the list
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* Loading next page indicator */}
      {isFetchingNextPage && (
        <div className="mt-4 flex justify-center">
          <Loader2 className="text-primary h-6 w-6 animate-spin" />
        </div>
      )}
    </main>
  );
}

export default FacilitiesPage;
