"use client";
import MapComponent from "@/components/shared/molecules/map-component";
import RequestLocationCard from "@/features/user/components/request-location-card";
import SideBar from "@/components/shared/molecules/side-bar";
import { useUserStore } from "@/features/user/store/user-store";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchFilterStore } from "@/store/search-filter-store";
import { useCallback, useEffect, useMemo } from "react";
import { SearchAndFilter } from "../../../components/shared/organisms/search-and-filter";
import DirectionDrawer from "../components/drawers/direction-drawer";
import FacilityDetailsDrawer from "../components/drawers/facility-details-drawer";
import RequestAppointmentDrawer from "../components/drawers/request-appointment-drawer";
import ResultsDrawer from "../components/drawers/results-drawer";
import { useDrawerStore } from "../store/drawer-store";
import { useFacilityStore } from "../store/facility-store";
import { Facility } from "../types";
import { useRouteGeometry } from "@/hooks/useRouteGeometry";

function UserPage() {
  // DRAWER STATES ================================
  const activeDrawer = useDrawerStore((state) => state.activeDrawer);
  const openResults = useDrawerStore((state) => state.openResults);
  const openDetails = useDrawerStore((state) => state.openDetails);
  const openDirections = useDrawerStore((state) => state.openDirections);

  // SEARCH FILTER STATE =========================
  const isSearchExpanded = useSearchFilterStore(
    (state) => state.isSearchExpanded,
  );
  const clearAllFilters = useSearchFilterStore(
    (state) => state.clearAllFilters,
  );

  // LOCATION RELATED STATE =========================
  const userLocation = useUserStore((state) => state.userLocation);
  const isLoadingPosition = useUserStore((state) => state.isLoadingPosition);

  // FACILITY STORE STATES ========================
  const setSelectedFacility = useFacilityStore(
    (state) => state.setSelectedFacility,
  );
  const selectedFacility = useFacilityStore((state) => state.selectedFacility);
  // NEARBY & ALL FACILITIES =============
  const nearestFacility = useFacilityStore((s) => s.nearestFacility);
  const allFacilities = useFacilityStore((s) => s.allFacilities);

  const debounceNearestFacilityData = useDebounce(nearestFacility, 500);
  const debounceAllFacilitiesData = useDebounce(allFacilities, 200);

  const allFacilitiesArray = useMemo(() => {
    return debounceAllFacilitiesData
      ? debounceAllFacilitiesData.filter(
          (facility) => facility.facility_id !== nearestFacility?.facility_id,
        )
      : [];
  }, [debounceAllFacilitiesData, nearestFacility?.facility_id]);

  const nearYouFacilitiesArray = useMemo(() => {
    return debounceNearestFacilityData ? [debounceNearestFacilityData] : [];
  }, [debounceNearestFacilityData]);

  // Get route geometry when directions drawer is open
  const shouldFetchRoute =
    activeDrawer === "directions" && !!selectedFacility && !!userLocation;
  const { data: routeData, error: routeError } = useRouteGeometry({
    origin: userLocation,
    // origin: { latitude: 4.8585, longitude: 7.0647 }, // HACK FIX LOCATION FOR DEVELOPMENT
    destination: selectedFacility
      ? {
          latitude: selectedFacility.lat,
          longitude: selectedFacility.lon,
        }
      : null,
    enabled: shouldFetchRoute,
  });

  // HANDLER FOR FACILITY LIST ITEM CLICK AND OTHER RELATED HANDLERS FOR DRAWER STATE ==============
  const handleViewDetails = useCallback(
    (facility: Facility) => {
      setSelectedFacility(facility);
      openDetails();
    },
    [setSelectedFacility, openDetails],
  );

  const handleCloseDetails = useCallback(() => {
    setSelectedFacility(null);
    openResults();
  }, [setSelectedFacility, openResults]);

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
      {!isLoadingPosition && (
        <div className="relative z-10 flex gap-3 px-5 pt-3">
          <SideBar className="shrink-0" />

          <SearchAndFilter
            key="user variant"
            includeExpandedSearchFilter={true}
            className="relative z-60 w-[70%]!"
            includeSearchResults={true}
          />
        </div>
      )}

      <RequestLocationCard />
      {/* MAP SECTION  =================================== */}
      <section className="fixed inset-0 z-0 h-full w-full sm:left-1/2 sm:max-w-120 sm:-translate-x-1/2">
        {activeDrawer !== "directions" && (
          <MapComponent
            nearYouFacilities={nearYouFacilitiesArray}
            showNearYouFacilities={true}
            allFacilities={allFacilitiesArray}
            showAllFacilities={true}
          />
        )}
        {activeDrawer === "directions" &&
          userLocation &&
          selectedFacility &&
          !routeError?.message && (
            <MapComponent
              userLocation={userLocation}
              // userLocation={{ latitude: 4.8585, longitude: 7.0647 }} // HACK FIX LOCATION FOR DEVELOPMENT
              destination={{
                longitude: selectedFacility?.lon,
                latitude: selectedFacility?.lat,
              }}
              routeGeometry={routeData?.geometry || null}
              showUserPin={true}
            />
          )}
      </section>

      {/* DRAWERS SECTION=================================== */}
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
              facility={selectedFacility}
              onShowDirections={handleShowDirections}
            />
          )}

          {activeDrawer === "directions" && (
            <DirectionDrawer isOpen={true} onClose={handleCloseDirections} />
          )}

          {/* {activeDrawer === "requestAppointment" && (
            <RequestAppointmentDrawer
              isOpen={true}
              onClose={handleCloseRequestAppointment}
              facilityId={selectedFacility?.facility_id}
            />
          )} */}
        </section>
      )}
    </main>
  );
}
export default UserPage;
