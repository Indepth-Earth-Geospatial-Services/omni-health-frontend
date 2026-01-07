"use client";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { MapPin, Star } from "lucide-react";
import { useMemo, useState } from "react";
import {
  useLGAFacilities,
  useNearestFacility,
} from "../../hooks/useFacilities";
import { useUserStore } from "../../store/userStore";
import FacilityListItem from "../facility-list-item";
import FacilityListItemErrorCard from "../facility-list-item-error-card";
import { useRouter } from "next/navigation";
type Filters = "Distance" | "Ratings";

interface ResultsDrawerProps {
  isOpen: boolean;
  onClose?: () => void;
  isGettingLocation: boolean;
  onViewDetails: (facilityId: string) => void;
}

const filters = [
  { name: "Distance", icon: <MapPin size={14} /> },
  { name: "Ratings", icon: <Star size={14} /> },
] as const;

function ResultsDrawer({
  isOpen,
  isGettingLocation,
  onViewDetails,
}: ResultsDrawerProps) {
  // State
  const [activeFilter, setActiveFilter] = useState<Filters>("Distance");
  const [snap, setSnap] = useState<number | string | null>(0.8);
  const router = useRouter();

  // Store
  const userLocation = useUserStore((state) => state.userLocation);

  // Data fetching
  const {
    isLoading: isLoadingNearestFacility,
    error: nearestFacilityError,
    data: nearestFacility,
    refetch: refetchNearestFacility,
  } = useNearestFacility(userLocation);

  const {
    isLoading: isLoadingLGAFacilities,
    error: LGAFacilitiesError,
    data: LGAFacilities,
    refetch: refetchLGAFacilities,
  } = useLGAFacilities(userLocation);

  // Derived values
  const isLoading =
    isLoadingNearestFacility || isLoadingLGAFacilities || isGettingLocation;
  const hasNearestFacilityError = !!nearestFacilityError;
  const hasLGAFacilitiesError = !!LGAFacilitiesError;
  const hasLocation = !!userLocation;
  const nearestFacilityErrorMessage =
    nearestFacilityError?.message || "Failed to load nearest facility";
  const LGAFacilitiesErrorMessage =
    LGAFacilitiesError?.message || "Failed to load LGA facilities";

  // Sorted facilities
  const sortedFacilities = useMemo(() => {
    if (!LGAFacilities?.facilities) return [];

    const filtered = Object.values(LGAFacilities.facilities).filter(
      (facility) => facility.facility_id !== nearestFacility?.facility_id,
    );

    return filtered.sort((a, b) => {
      if (activeFilter === "Distance") {
        return (a.road_distance_meters || 0) - (b.road_distance_meters || 0);
      }
      return (b.average_rating || 0) - (a.average_rating || 0);
    });
  }, [LGAFacilities, nearestFacility?.facility_id, activeFilter]);

  const showEmptyState =
    !isGettingLocation &&
    !isLoading &&
    !hasLGAFacilitiesError &&
    sortedFacilities.length === 0;

  return (
    <Drawer
      open={isOpen}
      snapPoints={[0.3, 0.4, 0.8, 1.1, 1.2]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      dismissible={false}
      modal={false}
    >
      <DrawerContent className="flex h-full">
        <DrawerTitle className="sr-only">
          List of Medical Facilities
        </DrawerTitle>

        <div className="flex h-full flex-1 flex-col p-5">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-[23px] font-normal">Medical Facilities</h1>
            <div className="space-x-4">
              {filters.map((filter) => (
                <Button
                  onClick={() => setActiveFilter(filter.name)}
                  key={filter.name}
                  className={cn(
                    "cursor-pointer rounded-full text-[11px]",
                    activeFilter === filter.name
                      ? "bg-[#51A199] hover:bg-[#51A199]"
                      : "border border-black bg-transparent text-black hover:bg-gray-50",
                  )}
                  size="sm"
                >
                  {filter.icon}
                  {filter.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="scrollbar-hide mt-4 grid gap-y-3 overflow-y-auto">
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
                {hasLGAFacilitiesError ? (
                  <FacilityListItemErrorCard
                    message={LGAFacilitiesErrorMessage}
                    onRetry={() => refetchLGAFacilities()}
                  />
                ) : (
                  sortedFacilities.map((facility, i) => (
                    <FacilityListItem
                      key={facility.facility_id || i}
                      facility={facility}
                      onViewDetails={onViewDetails}
                    />
                  ))
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
              <div className="mt-8 flex flex-col items-center justify-center px-4 text-center">
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
