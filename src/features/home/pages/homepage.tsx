"use client";
import DirectionDrawer from "../components/drawers/direction-drawer";
import FacilityDetailsDrawer from "../components/drawers/facility-details-drawer";
import RequestAppointmentDrawer from "../components/drawers/request-appointment-drawer";
import ResultsDrawer from "../components/drawers/results-drawer";
import DynamicMap from "../components/dynamic-map";
import { useUserLocation } from "../hooks/useUserLocation";
import { useDrawerStore } from "../store/drawerStore";
import { useFacilityStore } from "../store/facilityStore";

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

        <RequestAppointmentDrawer
          isOpen={activeDrawer === "requesetAppointment"}
          onClose={handleCloseRequestAppointment}
          facilityId={selectedFacilityId}
        />
      </section>
    </main>
  );
}
