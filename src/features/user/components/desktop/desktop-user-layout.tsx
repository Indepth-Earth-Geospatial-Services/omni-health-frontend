"use client";

import { useCallback, useEffect, useState } from "react";
import { Facility } from "@/types";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarContentNav } from "./sidebar-content";
import { ResultsPanel } from "./panels/results-panel";
import { FacilityDetailsPanel } from "./panels/facility-details-panel";
import { UserMapContainer } from "../organisms/user-map-container";

import RequestLocationCard from "../request-location-card";
import { useFacilityStore } from "../../store/facility-store";

interface DesktopUserLayoutProps {
  userLocation: { longitude: number; latitude: number } | null;
  isLoadingPosition: boolean;
  permissionState: string;
  requestLocation: () => void;
  activeDrawer: string | null;
  selectedFacility: Facility | null;
  nearYouFacilities: Facility[];
  otherFacilities: Facility[];
}

export function DesktopUserLayout({
  userLocation,
  isLoadingPosition,
  permissionState,
  requestLocation,
  activeDrawer,
  selectedFacility,
  nearYouFacilities,
  otherFacilities,
}: DesktopUserLayoutProps) {
  const [detailsFacility, setDetailsFacility] = useState<Facility | null>(null);
  const setSelectedFacility = useFacilityStore((s) => s.setSelectedFacility);

  const handleViewDetails = useCallback(
    (facility: Facility) => {
      setDetailsFacility(facility);
      setSelectedFacility(facility);
    },
    [setSelectedFacility],
  );

  const handleCloseDetails = useCallback(() => {
    setDetailsFacility(null);
    setSelectedFacility(null);
  }, [setSelectedFacility]);

  useEffect(() => {
    if (selectedFacility && selectedFacility !== detailsFacility) {
      // eslint-disable-next-line
      setDetailsFacility(selectedFacility);
    }
  }, [selectedFacility, detailsFacility]);

  return (
    <>
      <RequestLocationCard
        isLoading={isLoadingPosition}
        permissionState={permissionState}
        requestLocation={requestLocation}
      />

      <SidebarProvider defaultOpen={false} className="!mx-0 !max-w-full h-dvh overflow-hidden">
        <SidebarContentNav />

        <div className="flex flex-1">
          {detailsFacility ? (
            <FacilityDetailsPanel
              facility={detailsFacility}
              onClose={handleCloseDetails}
            />
          ) : (
            <ResultsPanel
              isGettingLocation={isLoadingPosition}
              onViewDetails={handleViewDetails}
            />
          )}

          <main className="relative flex-1">
            <UserMapContainer
              activeDrawer={activeDrawer}
              userLocation={userLocation}
              selectedFacility={detailsFacility ?? selectedFacility}
              nearYouFacilities={nearYouFacilities}
              allFacilities={otherFacilities}
            />
          </main>
        </div>
      </SidebarProvider>
    </>
  );
}
