"use client";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { useState } from "react";
import FacilityListItem from "../../../../components/shared/molecules/facility-list-item";
import FacilityListItemErrorCard from "../facility-list-item-error-card";
import { Facility } from "@/types";
import {
  LoadingView,
  LoadMoreTrigger,
  NoFacilitiesView,
} from "../molecules/result-drawer-parts";
import { useDrawerData } from "../../hooks/use-drawer-data";

interface ResultsDrawerProps {
  isOpen: boolean;
  onClose?: () => void;
  isGettingLocation: boolean;
  onViewDetails: (facility: Facility) => void;
}

const SNAP_POINTS = [0.3, 0.4, 0.8, 1.1, 1.2];

function ResultsDrawer({
  isOpen,
  isGettingLocation,
  onViewDetails,
}: ResultsDrawerProps) {
  const [snap, setSnap] = useState<number | string | null>(0.8);

  // Use the extracted logic
  const {
    nearestFacility,
    sortedFacilities,
    isLoading,
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
    <Drawer
      open={isOpen}
      snapPoints={SNAP_POINTS}
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
            </div>
            <h2 className="text-[15px] text-[#868C98]">
              Medical Facilities within your LGA
            </h2>
          </div>

          {/* Scrollable Content */}
          <div className="scrollbar-hide mt-2 grid gap-y-3 overflow-y-auto">
            {/* 1. Loading State */}
            {isLoading && <LoadingView />}

            {/* 2. Nearest Facility (or Error) */}
            {!isLoading && nearestError && (
              <FacilityListItemErrorCard
                message={nearestError.message || "Failed to load"}
                onRetry={refetchNearest}
              />
            )}

            {!isLoading && !nearestError && nearestFacility && (
              <FacilityListItem
                facility={nearestFacility}
                nearUser={true}
                onViewDetails={onViewDetails}
              />
            )}

            {/* 3. List Facilities (or Error) */}
            {!isLoading && lgaError && (
              <FacilityListItemErrorCard
                message={lgaError.message || "Failed to load"}
                onRetry={refetchLGA}
              />
            )}

            {!isLoading &&
              !lgaError &&
              sortedFacilities.map((facility, i) => (
                <FacilityListItem
                  key={`${facility.facility_id}-${i}`}
                  facility={facility}
                  onViewDetails={onViewDetails}
                />
              ))}

            {/* 4. Infinite Scroll Trigger */}
            {!isLoading && !lgaError && (
              <LoadMoreTrigger
                innerRef={loadMoreRef}
                isFetching={isFetchingNextPage}
                hasMore={hasNextPage}
                hasItems={sortedFacilities.length > 0}
              />
            )}

            {/* 5. Empty State */}
            {showEmptyState && <NoFacilitiesView hasLocation={hasLocation} />}

            {/* Spacing for Drawer handle/bottom */}
            <div className="h-40" />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default ResultsDrawer;
