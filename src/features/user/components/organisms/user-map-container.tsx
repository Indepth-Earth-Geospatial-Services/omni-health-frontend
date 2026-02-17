import MapComponent from "@/components/shared/molecules/map-component";
import { useRouteGeometry } from "@/hooks/use-route-geometry";
import { Facility } from "@/types";
import { memo } from "react";

interface UserMapContainerProps {
  activeDrawer: string;
  userLocation: { latitude: number; longitude: number } | null;
  selectedFacility: Facility | null;
  nearYouFacilities: Facility[];
  allFacilities: Facility[];
}

function UserMapContainerBase({
  activeDrawer,
  userLocation,
  selectedFacility,
  nearYouFacilities,
  allFacilities,
}: UserMapContainerProps) {
  const isDirectionMode = activeDrawer === "directions";
  const shouldFetchRoute =
    isDirectionMode && !!selectedFacility && !!userLocation;

  const { data: routeData, error: routeError } = useRouteGeometry({
    origin: userLocation,
    destination: selectedFacility
      ? { latitude: selectedFacility.lat, longitude: selectedFacility.lon }
      : null,
    enabled: shouldFetchRoute,
  });

  // 2. Render Direction Map
  if (
    isDirectionMode &&
    userLocation &&
    selectedFacility &&
    !routeError?.message
  ) {
    return (
      <MapComponent
        userLocation={userLocation}
        destination={{
          longitude: selectedFacility.lon,
          latitude: selectedFacility.lat,
        }}
        routeGeometry={routeData?.geometry || null}
        showUserPin={true}
      />
    );
  }

  // 3. Render Default "Browsing" Map
  return (
    <MapComponent
      nearYouFacilities={nearYouFacilities}
      showNearYouFacilities={true}
      allFacilities={allFacilities}
      showAllFacilities={true}
    />
  );
}
export const UserMapContainer = memo(UserMapContainerBase);
UserMapContainer.displayName = "UserMapContainer";
