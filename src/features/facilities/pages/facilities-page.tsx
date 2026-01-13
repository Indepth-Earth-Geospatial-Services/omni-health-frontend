"use client";
import FacilityListItem from "@/features/user/components/facility-list-item";
import { AlertCircle, ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { FilterComponent } from "../../../components/shared/filter-component";
import { Button } from "../../../components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { useAllFacilities } from "@/hooks/useFacilities";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";

function FacilitiesPage() {
  const [filters, setFilters] = useState({});
  console.log(filters);
  const router = useRouter();
  const { ref, inView } = useInView({ threshold: 0.5 });

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useAllFacilities(filters);

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

  // Set up infinite scroll with intersection observer
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, inView]);

  const handleViewDetails = (facilityID) => {
    router.push(`/facilities/${facilityID}`);
  };
  // Handle filter changes
  const handleFilter = (filterValues: any) => {
    setFilters(filterValues);
  };
  return (
    <main className="scrollbar-hide h-dvh overflow-auto px-5 pb-5">
      <div className="sticky top-0 z-50 bg-white pt-5">
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

        <FilterComponent onApplyFilters={handleFilter} />
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
