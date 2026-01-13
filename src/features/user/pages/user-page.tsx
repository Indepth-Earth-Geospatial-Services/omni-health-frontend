"use client";
import RequestLocationCard from "@/features/user/components/request-location-card";
import SideBar from "@/features/user/components/side-bar";
import { useUserStore } from "@/features/user/store/user-store";
import { useSearchFilterStore } from "@/store/search-filter-store";
import { useCallback } from "react";
import DirectionDrawer from "../components/drawers/direction-drawer";
import FacilityDetailsDrawer from "../components/drawers/facility-details-drawer";
import RequestAppointmentDrawer from "../components/drawers/request-appointment-drawer";
import ResultsDrawer from "../components/drawers/results-drawer";
import DynamicMap from "../components/dynamic-map";
import { useUserLocation } from "../hooks/useUserLocation";
import { useDrawerStore } from "../store/drawer-store";
import { useFacilityStore } from "../store/facility-store";
import { SearchAndFilter } from "../../../components/shared/search-and-filter";

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
  // HACK:
  const isSearchExpanded = useSearchFilterStore(
    (state) => state.isSearchExpanded,
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
      {/* !isLoadingPosition && !locationError */}
      {true && (
        <div className="relative z-10 flex gap-3 px-5 pt-3">
          <SideBar className="shrink-0" />

          <SearchAndFilter
            includeFilter={false}
            className="relative z-60 w-full"
            onApplyFilters={(filters) => {
              // filter logic here TODO
              console.log(filters);
            }}
          />
        </div>
      )}

      <RequestLocationCard />

      <section className="fixed inset-0 z-0 h-full w-full sm:left-1/2 sm:max-w-120 sm:-translate-x-1/2">
        <DynamicMap
          isLoading={isLoadingPosition}
          error={locationError}
          requestLocation={requestLocation}
        />
      </section>
      {!isSearchExpanded && (
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
      )}
    </main>
  );
}
export default UserPage;
