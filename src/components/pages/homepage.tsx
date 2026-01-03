"use client";
import Image from "next/image";
import DirectionDrawer from "../../features/home/components/drawers/direction-drawer";
import FacilityDetailsDrawer from "../../features/home/components/drawers/facility-details-drawer";
import RequestAppointmentDrawer from "../../features/home/components/drawers/request-appointment-drawer";
import ResultsDrawer from "../../features/home/components/drawers/results-drawer";
import DynamicMap from "../../features/home/components/dynamic-map";
import { useUserLocation } from "../../features/home/hooks/useUserLocation";
import { useDrawerStore } from "../../features/home/store/drawerStore";
import { useFacilityStore } from "../../features/home/store/facilityStore";
import SideBar from "@/features/home/components/side-bar";

export default function HomePage() {
  const activeDrawer = useDrawerStore((state) => state.activeDrawer);
  const openResults = useDrawerStore((state) => state.openResults);
  const openDetails = useDrawerStore((state) => state.openDetails);
  const openDirections = useDrawerStore((state) => state.openDirections);
  const setSelectedFacilityId = useFacilityStore(
    (state) => state.setSelectedFacility,
  );
  const selectedFacilityId = useFacilityStore(
    (state) => state.selectedFacility,
  );

  const { error, isLoading, location, requestLocation } = useUserLocation();

  const handleViewDetails = (facilityId: string) => {
    setSelectedFacilityId(facilityId);
    openDetails();
  };

  const handleCloseDetails = () => {
    setSelectedFacilityId(null);
    openResults();
  };

  const handleShowDirections = () => {
    openDirections();
  };

  const handleCloseDirections = () => {
    openResults();
  };
  const handleCloseRequestAppointment = () => {
    openDetails();
  };
  return (
    <main className="mx-auto h-full max-h-dvh w-full">
      <SideBar />

      <section className="fixed inset-0 h-full w-full sm:left-1/2 sm:max-w-120 sm:-translate-x-1/2">
        <DynamicMap
          isLoading={isLoading}
          error={error}
          requestLocation={requestLocation}
        />
      </section>

      <section>
        {activeDrawer === "results" && (
          <ResultsDrawer
            isOpen={activeDrawer === "results"}
            onViewDetails={handleViewDetails}
          />
        )}

        {activeDrawer === "details" && (
          <FacilityDetailsDrawer
            isOpen={activeDrawer === "details"}
            onClose={handleCloseDetails}
            facilityId={selectedFacilityId}
            onShowDirections={handleShowDirections}
          />
        )}

        {activeDrawer === "directions" && (
          <DirectionDrawer
            isOpen={activeDrawer === "directions"}
            onClose={handleCloseDirections}
          />
        )}

        {activeDrawer === "requesetAppointment" && (
          <RequestAppointmentDrawer
            isOpen={activeDrawer === "requesetAppointment"}
            onClose={handleCloseRequestAppointment}
            facilityId={selectedFacilityId}
          />
        )}
      </section>
    </main>
  );
}
