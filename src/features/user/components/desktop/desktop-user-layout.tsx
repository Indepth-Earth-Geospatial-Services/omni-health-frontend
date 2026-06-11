"use client";

import { useCallback, useEffect, useState } from "react";
import { Facility } from "@/types";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarContentNav } from "./sidebar-content";
import { ResultsPanel } from "./panels/results-panel";
import { FacilityDetailsPanel } from "./panels/facility-details-panel";
import { DirectionsPanel } from "./panels/directions-panel";
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
  const [directionsFacility, setDirectionsFacility] = useState<Facility | null>(
    null,
  );
  const setSelectedFacility = useFacilityStore((s) => s.setSelectedFacility);

  const handleViewDetails = useCallback(
    (facility: Facility) => {
      setDetailsFacility(facility);
      setDirectionsFacility(null);
      setSelectedFacility(facility);
    },
    [setSelectedFacility],
  );

  const handleCloseDetails = useCallback(() => {
    setDetailsFacility(null);
    setDirectionsFacility(null);
    setSelectedFacility(null);
  }, [setSelectedFacility]);

  const handleShowDirections = useCallback(() => {
    if (detailsFacility) {
      setDirectionsFacility(detailsFacility);
    }
  }, [detailsFacility]);

  const handleBackToDetails = useCallback(() => {
    setDirectionsFacility(null);
  }, []);

  const effectiveUserLocation = userLocation
    ? { latitude: userLocation.latitude, longitude: userLocation.longitude }
    : null;

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

      <SidebarProvider
        defaultOpen={false}
        className="!mx-0 !max-w-full h-dvh overflow-hidden"
      >
        <SidebarContentNav />

        <div className="flex flex-1">
          {directionsFacility ? (
            <DirectionsPanel
              facility={directionsFacility}
              userLocation={effectiveUserLocation}
              onBackToDetails={handleBackToDetails}
              onClose={handleCloseDetails}
            />
          ) : detailsFacility ? (
            <FacilityDetailsPanel
              facility={detailsFacility}
              onClose={handleCloseDetails}
              onShowDirections={handleShowDirections}
            />
          ) : (
            <ResultsPanel
              isGettingLocation={isLoadingPosition}
              onViewDetails={handleViewDetails}
            />
          )}

          <main className="relative flex-1">
            <UserMapContainer
              activeDrawer={directionsFacility ? "directions" : activeDrawer}
              userLocation={userLocation}
              selectedFacility={
                directionsFacility ?? detailsFacility ?? selectedFacility
              }
              nearYouFacilities={nearYouFacilities}
              allFacilities={otherFacilities}
            />
          </main>
        </div>
      </SidebarProvider>
    </>
  );
}
