"use client";

import SideBar from "@/components/shared/molecules/side-bar";
import RequestLocationCard from "@/features/user/components/request-location-card";
import { useEffect } from "react";
import { SearchAndFilter } from "../../../components/shared/organisms/search-and-filter";

import { useUserStore } from "@/features/user/store/user-store";
import { useSearchFilterStore } from "@/store/search-filter-store";
import { UserDrawerManager } from "../components/organisms/user-drawer-manager";
import { UserMapContainer } from "../components/organisms/user-map-container";
import { useDrawerActions } from "../hooks/use-drawer-actions";
import { useFacilityData } from "../hooks/use-facility-data";
import { useDrawerStore } from "../store/drawer-store";
import { useFacilityStore } from "../store/facility-store";
import { useUserLocation } from "../hooks/use-user-location";

function UserPage() {
  // 1. Global State
  const userLocation = useUserStore((state) => state.userLocation);
  const isLoadingPosition = useUserStore((state) => state.isLoadingPosition);
  const permissionState = useUserStore((state) => state.permissionState);

  const { requestLocation } = useUserLocation();
  const { isSearchExpanded, clearAllFilters } = useSearchFilterStore();
  const activeDrawer = useDrawerStore((s) => s.activeDrawer);
  const selectedFacility = useFacilityStore((s) => s.selectedFacility);

  // 2. Derived Data & Actions
  const { nearYouFacilities, otherFacilities } = useFacilityData();
  console.log(otherFacilities);
  const drawerActions = useDrawerActions();
  // 3. Cleanup Effect
  useEffect(() => {
    return () => clearAllFilters();
  }, [clearAllFilters]);

  return (
    <main className="mx-auto h-full max-h-dvh w-full">
      {/* --- Top Bar (Sidebar + Search) --- */}
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

      {/* --- Permission Card --- */}
      <RequestLocationCard
        isLoading={isLoadingPosition}
        permissionState={permissionState}
        requestLocation={requestLocation}
      />

      {/* --- Map Layer --- */}
      <section className="fixed inset-0 z-0 h-full w-full sm:left-1/2 sm:max-w-120 sm:-translate-x-1/2">
        <UserMapContainer
          activeDrawer={activeDrawer}
          userLocation={userLocation}
          selectedFacility={selectedFacility}
          nearYouFacilities={nearYouFacilities}
          allFacilities={otherFacilities}
        />
      </section>

      {/* --- Drawer Layer --- */}
      {!isSearchExpanded && (
        <UserDrawerManager
          activeDrawer={activeDrawer}
          selectedFacility={selectedFacility}
          isLoadingPosition={isLoadingPosition}
          actions={drawerActions}
        />
      )}
    </main>
  );
}

export default UserPage;
