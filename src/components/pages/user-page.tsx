"use client";
import RequestLocationCard from "@/features/user/components/request-location-card";
import SideBar from "@/features/user/components/side-bar";
import { useUserStore } from "@/features/user/store/userStore";
import { useCallback } from "react";
import DirectionDrawer from "../../features/user/components/drawers/direction-drawer";
import FacilityDetailsDrawer from "../../features/user/components/drawers/facility-details-drawer";
import RequestAppointmentDrawer from "../../features/user/components/drawers/request-appointment-drawer";
import ResultsDrawer from "../../features/user/components/drawers/results-drawer";
import DynamicMap from "../../features/user/components/dynamic-map";
import { useUserLocation } from "../../features/user/hooks/useUserLocation";
import { useDrawerStore } from "../../features/user/store/drawerStore";
import { useFacilityStore } from "../../features/user/store/facilityStore";
import { FilterComponent } from "../shared/filter-component";

function UserPage() {
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

  const { requestLocation } = useUserLocation();
  const locationError = useUserStore((state) => state.locationError);
  const isLoadingPosition = useUserStore((state) => state.isLoadingPosition);

  const handleViewDetails = useCallback(
    (facilityId: string) => {
      setSelectedFacilityId(facilityId);
      openDetails();
    },
    [setSelectedFacilityId, openDetails],
  );

  const handleCloseDetails = useCallback(() => {
    setSelectedFacilityId(null);
    openResults();
  }, [setSelectedFacilityId, openResults]);

  const handleShowDirections = useCallback(() => {
    openDirections();
  }, [openDirections]);

  const handleCloseDirections = useCallback(() => {
    openResults();
  }, [openResults]);

  const handleCloseRequestAppointment = useCallback(() => {
    openDetails();
  }, [openDetails]);

  return (
    <main className="mx-auto h-full max-h-dvh w-full">
      <div className="flex gap-3 px-5 pt-3">
        <SideBar className="relative z-10 shrink-0" />
        <FilterComponent includeFilter={false} />
      </div>
      <RequestLocationCard />
      <section className="fixed inset-0 h-full w-full sm:left-1/2 sm:max-w-120 sm:-translate-x-1/2">
        <DynamicMap
          isLoading={isLoadingPosition}
          error={locationError}
          requestLocation={requestLocation}
        />
      </section>

      <section>
        {activeDrawer === "results" && (
          <ResultsDrawer
            isOpen={true}
            onViewDetails={handleViewDetails}
            isGettingLocation={isLoadingPosition}
          />
        )}

        {activeDrawer === "details" && (
          <FacilityDetailsDrawer
            isOpen={true}
            onClose={handleCloseDetails}
            facilityId={selectedFacilityId}
            onShowDirections={handleShowDirections}
          />
        )}

        {activeDrawer === "directions" && (
          <DirectionDrawer isOpen={true} onClose={handleCloseDirections} />
        )}

        {activeDrawer === "requestAppointment" && (
          <RequestAppointmentDrawer
            isOpen={true}
            onClose={handleCloseRequestAppointment}
            facilityId={selectedFacilityId}
          />
        )}
      </section>
    </main>
  );
}
export default UserPage;
