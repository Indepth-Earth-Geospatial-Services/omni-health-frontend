"use client";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { MapPin, Star } from "lucide-react";
import { useMemo, useState } from "react";
import FacilityListItem from "../facility-list-item";
import { useUserStore } from "../../store/userStore";
import {
  useLGAFacilities,
  useNearestFacility,
} from "../../hooks/useFacilities";

type Filters = "Distance" | "Ratings";

interface ResultsDrawerProps {
  isOpen: boolean;
  onClose?: () => void;
  onViewDetails: (facilityId: string) => void;
}
const filters = [
  { name: "Distance", icon: <MapPin size={14} /> },
  { name: "Ratings", icon: <Star size={14} /> },
] as const;

function ResultsDrawer({ isOpen, onViewDetails }: ResultsDrawerProps) {
  const [activeFilter, setActiveFilter] = useState<Filters>("Distance");
  const [snap, setSnap] = useState<number | string | null>(0.8);
  const userLocation = useUserStore((state) => state.userLocation);

  const {
    isLoading: isLoadingNearestFacility,
    error: nearestFacilityError,
    data: nearestFacility,
  } = useNearestFacility(userLocation);

  const {
    isLoading: isLoadingLGAFacilities,
    error: LGAFacilitiesError,
    data: LGAFacilities,
  } = useLGAFacilities(userLocation);

  console.log("LGA FACILITIES", LGAFacilities);

  const sortedFacilities = useMemo(() => {
    if (!LGAFacilities) return [];

    const filtered = Object.values(LGAFacilities).filter(
      (facility) => facility.facility_id !== nearestFacility?.facility_id,
    );

    return filtered.sort((a, b) => {
      if (activeFilter === "Distance") {
        return (a.road_distance_meters || 0) - (b.road_distance_meters || 0);
      }
      return (b.average_rating || 0) - (a.average_rating || 0);
    });
  }, [LGAFacilities, nearestFacility?.facility_id, activeFilter]);

  const isLoading = isLoadingNearestFacility || isLoadingLGAFacilities;
  const hasError = nearestFacilityError || LGAFacilitiesError;

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
        <div className="flex h-full flex-1 flex-col p-5">
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

          <div className="scrollbar-hide mt-4 grid gap-y-3 overflow-y-auto">
            {/* Show loading state */}
            {isLoading && (
              <p className="flex items-center justify-center text-sm text-gray-500">
                Loading facilities...
              </p>
            )}

            {/* Show error state */}
            {hasError && (
              <p className="text-sm text-red-500">
                {nearestFacilityError?.message || LGAFacilitiesError?.message}
              </p>
            )}

            {/* NEAREST FACILITY */}
            {!isLoading && nearestFacility && (
              <FacilityListItem
                facility={nearestFacility}
                nearUser={true}
                onViewDetails={onViewDetails}
              />
            )}

            {/* OTHER FACILITIES (sorted and filtered) */}
            {!isLoading &&
              sortedFacilities.map((facility) => (
                <FacilityListItem
                  key={facility.facility_id}
                  facility={facility}
                  onViewDetails={onViewDetails}
                />
              ))}

            {/* Empty state */}
            {!isLoading &&
              !hasError &&
              sortedFacilities.length === 0 &&
              !nearestFacility && (
                <p className="text-sm text-gray-500">
                  No facilities found in your area
                </p>
              )}
            {!isLoading && !hasError && sortedFacilities.length === 0 && (
              <p className="mt-4 flex items-center justify-center text-sm text-gray-500">
                No facilities found in your LGA
              </p>
            )}

            <div className="h-40"></div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default ResultsDrawer;
