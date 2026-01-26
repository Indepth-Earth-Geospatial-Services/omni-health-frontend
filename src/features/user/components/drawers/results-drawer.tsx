"use client";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { MapIcon, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  useLGAFacilities,
  useNearestFacility,
} from "../../../../hooks/useFacilities";
import { useUserStore } from "../../store/user-store";
import FacilityListItem from "../../../../components/shared/molecules/facility-list-item";
import FacilityListItemErrorCard from "../facility-list-item-error-card";
import FilterCard from "../filter-card";
import { useInView } from "react-intersection-observer";
import { useFacilityStore } from "../../store/facility-store";
import { Facility } from "@/types";

interface ResultsDrawerProps {
  isOpen: boolean;
  onClose?: () => void;
  isGettingLocation: boolean;
  onViewDetails: (facility: Facility) => void;
}

function ResultsDrawer({
  isOpen,
  isGettingLocation,
  onViewDetails,
}: ResultsDrawerProps) {
  // State
  const [activeFilter, setActiveFilter] = useState("Distance");

  const setNearestFacility = useFacilityStore(
    (state) => state.setNearestFacility,
  );
  const setAllFacilities = useFacilityStore((state) => state.setAllFacilities);

  const [snap, setSnap] = useState<number | string | null>(0.8);
  const router = useRouter();
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "50px",
  });
  // Store
  const userLocation = useUserStore((state) => state.userLocation);

  // Data fetching
  const {
    isLoading: isLoadingNearestFacility,
    error: nearestFacilityError,
    data: nearestFacilityData,
    refetch: refetchNearestFacility,
  } = useNearestFacility(userLocation);

  // Data fetching with infinite query
  const {
    data: LGAFacilitiesData,
    isLoading: isLoadingLGAFacilities,
    error: LGAFacilitiesError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchLGAFacilities,
  } = useLGAFacilities(userLocation);
  // console.log(LGAFacilitiesData);

  // Derived values
  const nearestFacility = nearestFacilityData?.facility;
  const isLoading =
    isLoadingNearestFacility || isLoadingLGAFacilities || isGettingLocation;
  const hasNearestFacilityError = !!nearestFacilityError;
  const hasLGAFacilitiesError = !!LGAFacilitiesError;
  const hasLocation = !!userLocation;
  const nearestFacilityErrorMessage =
    nearestFacilityError?.message || "Failed to load nearest facility";
  const LGAFacilitiesErrorMessage =
    LGAFacilitiesError?.message || "Failed to load LGA facilities";

  const allFacilities = useMemo(() => {
    if (!LGAFacilitiesData?.pages) return [];
    return LGAFacilitiesData.pages.flatMap((page) => page.facilities);
  }, [LGAFacilitiesData]);

  // Filter out nearest facility and sort
  const sortedFacilities = useMemo(() => {
    const filtered = allFacilities.filter(
      (facility) => facility.facility_id !== nearestFacility?.facility_id,
    );

    return filtered.sort((a, b) => {
      if (activeFilter === "Distance") {
        return (a.road_distance_meters || 0) - (b.road_distance_meters || 0);
      }
      return (b.average_rating || 0) - (a.average_rating || 0);
    });
  }, [allFacilities, nearestFacility?.facility_id, activeFilter]);

  const showEmptyState =
    !isGettingLocation &&
    !isLoading &&
    !hasLGAFacilitiesError &&
    sortedFacilities.length === 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // setter =====================
  useEffect(() => {
    if (Object.values(nearestFacility || []).length === 0) return;
    setNearestFacility(nearestFacility);
  }, [nearestFacility, setNearestFacility]);

  useEffect(() => {
    if (!LGAFacilitiesData?.pages || LGAFacilitiesData.pages.length === 0)
      return;

    // Flatten all facilities from all pages
    const allFacilitiesFlattened = LGAFacilitiesData.pages.flatMap(
      (page) => page.facilities,
    );

    setAllFacilities(allFacilitiesFlattened);
  }, [LGAFacilitiesData, setAllFacilities]);

  return (
    <Drawer
      open={isOpen}
      snapPoints={[0.3, 0.4, 0.8, 1.1, 1.2]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      dismissible={false}
      modal={false}
      shouldScaleBackground={false}
    >
      <DrawerContent className="flex h-full">
        <DrawerTitle className="sr-only">
          List of Medical Facilities
        </DrawerTitle>

        <div className="flex h-full flex-1 flex-col p-5">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="text-[19px] font-normal">
                HealthCare Facilities near you
              </h1>
              {/* FIXME IMPLEMENT FILTER WHEN YOU ARE READY */}
              <div>{/* <FilterCard /> */}</div>
            </div>
            <h2 className="text-[15px] text-[#868C98]">
              Medical Facilities within your LGA
            </h2>
          </div>

          {/* Content */}
          <div className="scrollbar-hide mt-2 grid gap-y-3 overflow-y-auto">
            {/* Nearest Facility Section */}
            {!isLoadingNearestFacility && (
              <>
                {hasNearestFacilityError ? (
                  <FacilityListItemErrorCard
                    message={nearestFacilityErrorMessage}
                    onRetry={() => refetchNearestFacility()}
                  />
                ) : (
                  nearestFacility && (
                    <FacilityListItem
                      facility={nearestFacility}
                      nearUser={true}
                      onViewDetails={onViewDetails}
                    />
                  )
                )}
              </>
            )}

            {/* LGA Facilities Section */}
            {!isLoadingLGAFacilities && (
              <>
                {LGAFacilitiesError ? (
                  <FacilityListItemErrorCard
                    message={LGAFacilitiesErrorMessage}
                    onRetry={() => refetchLGAFacilities()}
                  />
                ) : (
                  <>
                    {sortedFacilities.map((facility, i) => (
                      <FacilityListItem
                        key={`${facility.facility_id}-${i}`}
                        facility={facility}
                        onViewDetails={onViewDetails}
                      />
                    ))}

                    {/* Load More Trigger */}
                    <div
                      ref={ref}
                      className="flex h-5 items-center justify-center"
                    >
                      {isFetchingNextPage && (
                        <div className="text-gray-500">
                          Loading more facilities...
                        </div>
                      )}
                      {!hasNextPage && sortedFacilities.length > 0 && (
                        <div className="text-gray-500">
                          No more facilities to load
                        </div>
                      )}
                    </div>
                  </>
                )}
              </>
            )}

            {/* Loading state */}
            {isLoading && (
              <>
                <FacilityListItem facility={null} isLoading={true} />
                <FacilityListItem facility={null} isLoading={true} />
                <FacilityListItem facility={null} isLoading={true} />
              </>
            )}

            {/* Empty state - Different UI based on location permission */}
            {showEmptyState && (
              <div className="flex flex-col items-center justify-center px-4 text-center">
                <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-gray-100">
                  <MapPin size={24} className="text-gray-400" />
                </div>

                {hasLocation ? (
                  // Has location but no facilities found
                  <>
                    <h4 className="mb-1 text-[15px] font-medium text-gray-700">
                      No facilities found nearby
                    </h4>
                    <p className="mb-4 text-[13px] text-gray-500">
                      There are no medical facilities in your area. Try browsing
                      all facilities.
                    </p>
                    <Button
                      onClick={() => router.push("/facilities")}
                      className="bg-primary hover:bg-primary/90 rounded-full"
                    >
                      Browse All Facilities
                    </Button>
                  </>
                ) : (
                  // No location permission
                  <>
                    <h4 className="mb-1 text-[15px] font-medium text-gray-700">
                      Location access needed
                    </h4>
                    <p className="mb-4 text-[13px] text-gray-500">
                      Enable location access to see facilities near you, or
                      browse all available facilities
                    </p>
                    <div className="flex w-full max-w-xs flex-col gap-2">
                      <Button
                        onClick={() => router.push("/facilities")}
                        className="bg-primary hover:bg-primary/90 rounded-full"
                      >
                        <MapPin size={16} />
                        Browse All Facilities
                      </Button>
                      <Button
                        onClick={() => router.push("/explore-facilities")}
                        className="bg-primary hover:bg-primary/90 rounded-full"
                      >
                        <MapIcon size={16} />
                        Explore Facilities using a map
                      </Button>
                      <Button
                        onClick={() => {
                          window.location.reload();
                        }}
                        variant="outline"
                        className="rounded-full border-gray-300"
                      >
                        Enable Location Access
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="h-40"></div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default ResultsDrawer;
