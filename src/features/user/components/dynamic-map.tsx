import { memo } from "react";
import { useDrawerStore } from "../store/drawerStore";
import DirectionsCard from "./directions-card";
import LocationCard from "./location-card";
import MapComponent from "./map-component";
interface DynamicMapProp {
  isLoading: boolean;
  error: string;
  requestLocation: () => void;
}
function DynamicMap({ isLoading, error, requestLocation }: DynamicMapProp) {
  const activeDrawer = useDrawerStore((state) => state.activeDrawer);
  const hasStartDirections = useDrawerStore(
    (state) => state.hasStartDirections,
  );
  return (
    <div className="w-full">
      {isLoading && (
        <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded bg-white px-4 py-2 shadow">
          Getting your location...
        </div>
      )}
      {error && !isLoading && (
        <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded bg-red-100 px-4 py-2 text-red-700 shadow">
          {error}
          <button onClick={requestLocation} className="ml-2 underline">
            Retry
          </button>
        </div>
      )}
      {activeDrawer === "directions" && !hasStartDirections && (
        <div className="fixed top-4 z-10 w-full px-5">
          <LocationCard facilityAddress="" />
        </div>
      )}
      {hasStartDirections && (
        <div className="fixed top-4 z-10 w-full px-5">
          <DirectionsCard />{" "}
        </div>
      )}
      <MapComponent />
    </div>
  );
}

export default memo(DynamicMap);
