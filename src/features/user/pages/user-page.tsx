"use client";
import MapComponent from "@/components/shared/molecules/map-component";
import { FACILITY_KEYS } from "@/constants";
import RequestLocationCard from "@/features/user/components/request-location-card";
import SideBar from "@/features/user/components/side-bar";
import { useUserStore } from "@/features/user/store/user-store";
import { useSearchFilterStore } from "@/store/search-filter-store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import { SearchAndFilter } from "../../../components/shared/organisms/search-and-filter";
import DirectionDrawer from "../components/drawers/direction-drawer";
import FacilityDetailsDrawer from "../components/drawers/facility-details-drawer";
import RequestAppointmentDrawer from "../components/drawers/request-appointment-drawer";
import ResultsDrawer from "../components/drawers/results-drawer";
import { useUserLocation } from "../hooks/useUserLocation";
import { useDrawerStore } from "../store/drawer-store";
import { useFacilityStore } from "../store/facility-store";
import { useDebounce } from "@/hooks/useDebounce";
const allFacilitiesTest = [
  { id: "fac-1", longitude: 7.051, latitude: 4.817, name: "City Clinic" },
  { id: "fac-2", longitude: 7.0485, latitude: 4.8145, name: "Health Plus" },
  { id: "fac-3", longitude: 7.053, latitude: 4.819, name: "Medicare Centre" },
  { id: "fac-4", longitude: 7.046, latitude: 4.814, name: "Care Hospital" },
  { id: "fac-5", longitude: 7.052, latitude: 4.8165, name: "Wellness Clinic" },
  {
    id: "fac-6",
    longitude: 7.049,
    latitude: 4.8155,
    name: "St. Mary's Hospital",
  },
  { id: "fac-7", longitude: 7.054, latitude: 4.82, name: "General Hospital" },
  { id: "fac-8", longitude: 7.047, latitude: 4.8125, name: "Family Clinic" },
  { id: "fac-9", longitude: 7.0505, latitude: 4.8175, name: "Emergency Care" },
  {
    id: "fac-10",
    longitude: 7.0455,
    latitude: 4.815,
    name: "Primary Health Centre",
  },
  {
    id: "fac-11",
    longitude: 7.0535,
    latitude: 4.8185,
    name: "Specialist Hospital",
  },
  {
    id: "fac-12",
    longitude: 7.048,
    latitude: 4.8135,
    name: "Community Health",
  },
  { id: "fac-13", longitude: 7.0515, latitude: 4.8195, name: "Medical Plaza" },
  {
    id: "fac-14",
    longitude: 7.0465,
    latitude: 4.816,
    name: "Diagnostic Centre",
  },
  {
    id: "fac-15",
    longitude: 7.0525,
    latitude: 4.815,
    name: "Urgent Care Clinic",
  },
  {
    id: "fac-16",
    longitude: 7.0495,
    latitude: 4.818,
    name: "Women's Hospital",
  },
  {
    id: "fac-17",
    longitude: 7.045,
    latitude: 4.8145,
    name: "Children's Clinic",
  },
  {
    id: "fac-18",
    longitude: 7.0545,
    latitude: 4.8175,
    name: "Dental & Medical",
  },
];

function UserPage() {
  const queryClient = useQueryClient();

  // DRAWER STATES ================================
  const activeDrawer = useDrawerStore((state) => state.activeDrawer);
  const openResults = useDrawerStore((state) => state.openResults);
  const openDetails = useDrawerStore((state) => state.openDetails);
  const openDirections = useDrawerStore((state) => state.openDirections);

  // SELECTED FACILITY ============
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

  // LOCATION RELATED STATE =========================
  const { requestLocation } = useUserLocation();
  const locationError = useUserStore((state) => state.locationError);
  const userLocation = useUserStore((state) => state.userLocation);
  const isLoadingPosition = useUserStore((state) => state.isLoadingPosition);

  console.log(userLocation); // FIXME REMOVE

  const clearAllFilters = useSearchFilterStore(
    (state) => state.clearAllFilters,
  );

  const nearestFacility = useFacilityStore((s) => s.nearestFacility);

  const nearestFacilityData = useDebounce(nearestFacility, 1000);

  console.log("from userpage NEAREST FACILITY", nearestFacilityData);

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

  useEffect(() => {
    return () => {
      // Clear search query when leaving facilities page
      clearAllFilters();
    };
  }, [clearAllFilters]);
  return (
    <main className="mx-auto h-full max-h-dvh w-full">
      {/* !isLoadingPosition && !locationError */}
      {true && (
        <div className="relative z-10 flex gap-3 px-5 pt-3">
          <SideBar className="shrink-0" />

          <SearchAndFilter
            key="user variant"
            includeExpandedSearchFilter={true}
            className="relative z-60 w-full"
            includeSearchResults={true}
          />
        </div>
      )}

      <RequestLocationCard />

      <section className="fixed inset-0 z-0 h-full w-full sm:left-1/2 sm:max-w-120 sm:-translate-x-1/2">
        <MapComponent
          showUserPin={false}
          nearYouFacilities={nearestFacilityData ? [nearestFacilityData] : []}
          showNearYouFacilities={true}
          allFacilities={[]}
          showAllFacilities={true}
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
