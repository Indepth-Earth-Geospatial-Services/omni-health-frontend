"use client";
import MapComponent from "@/features/home/components/map-component";
import { useState } from "react";
import FacilityDetailsDrawer from "../components/drawers/facility-details-drawer";
import ResultsDrawer from "../components/drawers/results-drawer";
import { useUserLocation } from "../hooks/useUserLocation";
import { useFacilityStore } from "../store/facilityStore";
import { useUserStore } from "../store/userStore";
import DirectionDrawer from "../components/drawers/direction-drawer";
import DynamicMap from "../components/dynamic-map";

export type DrawerState = "results" | "details" | "directions" | null;

export default function HomePage() {
  const [activeDrawer, setActiveDrawer] = useState<DrawerState>("results");
  const setSelectedFacilityId = useFacilityStore(
    (state) => state.setSelectedFacility,
  );
  const selectedFacilityId = useFacilityStore(
    (state) => state.selectedFacility,
  );

  const { error, isLoading, location, requestLocation } = useUserLocation();

  const handleViewDetails = (facilityId: string) => {
    setSelectedFacilityId(facilityId);
    setActiveDrawer("details");
  };

  const handleCloseDetails = () => {
    setSelectedFacilityId(null);
    setActiveDrawer("results");
  };

  const handleShowDirections = () => {
    setActiveDrawer("directions");
  };

  const handleCloseDirections = () => {
    setActiveDrawer("results");
  };

  return (
    <main className="mx-auto h-full max-h-dvh">
      <section className="fixed inset-0 h-full sm:left-1/2 sm:max-w-120 sm:-translate-x-1/2">
        <DynamicMap
          isLoading={isLoading}
          error={error}
          requestLocation={requestLocation}
        />
      </section>

      <section>
        <ResultsDrawer
          isOpen={activeDrawer === "results"}
          onClose={() => setActiveDrawer(null)}
          onViewDetails={handleViewDetails}
        />
        <FacilityDetailsDrawer
          isOpen={activeDrawer === "details"}
          onClose={handleCloseDetails}
          facilityId={selectedFacilityId}
          onShowDirections={handleShowDirections}
        />
        <DirectionDrawer
          isOpen={activeDrawer === "directions"}
          onClose={handleCloseDirections}
        />
      </section>
    </main>
  );
}
