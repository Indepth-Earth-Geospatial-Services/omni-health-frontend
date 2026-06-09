"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Facility } from "@/types";
import { DesktopShell } from "./desktop-shell";
import { DesktopSidebar } from "./desktop-sidebar";
import { ResultsPanel } from "./panels/results-panel";
import { UserMapContainer } from "../organisms/user-map-container";
import RequestLocationCard from "../request-location-card";

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
  const router = useRouter();

  const handleViewDetails = useCallback(
    (facility: Facility) => {
      router.push(`/facilities/${facility.facility_id}`);
    },
    [router],
  );

  return (
    <>
      <RequestLocationCard
        isLoading={isLoadingPosition}
        permissionState={permissionState}
        requestLocation={requestLocation}
      />

      <DesktopShell>
        <DesktopSidebar />

        <ResultsPanel
          isGettingLocation={isLoadingPosition}
          onViewDetails={handleViewDetails}
        />

        <main className="relative flex-1">
          <UserMapContainer
            activeDrawer={activeDrawer}
            userLocation={userLocation}
            selectedFacility={selectedFacility}
            nearYouFacilities={nearYouFacilities}
            allFacilities={otherFacilities}
          />
        </main>
      </DesktopShell>
    </>
  );
}
