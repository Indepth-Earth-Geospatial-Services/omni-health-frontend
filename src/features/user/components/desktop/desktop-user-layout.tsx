"use client";

import { useCallback, useState } from "react";
import { Facility } from "@/types";
import { DesktopShell } from "./desktop-shell";
import { DesktopSidebar } from "./desktop-sidebar";
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

  return (
    <>
      <RequestLocationCard
        isLoading={isLoadingPosition}
        permissionState={permissionState}
        requestLocation={requestLocation}
      />

      <DesktopShell>
        <DesktopSidebar />

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
      </DesktopShell>
    </>
  );
}
