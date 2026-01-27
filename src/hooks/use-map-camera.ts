import { useEffect, RefObject } from "react";
import mapboxgl from "mapbox-gl";
import { Facility } from "@/features/user/types";

interface UseMapCameraProps {
  mapRef: RefObject<any>;
  userLocation?: { longitude: number; latitude: number } | null;
  routeGeometry?: any;
  nearYouFacilities: Facility[];
  showNearYouFacilities: boolean;
  allFacilities: Facility[];
  highlightedFacility?: Facility | null;
}

export function useMapCamera({
  mapRef,
  userLocation,
  routeGeometry,
  nearYouFacilities,
  showNearYouFacilities,
  allFacilities,
  highlightedFacility,
}: UseMapCameraProps) {
  // 1. Fit bounds for "Near You"
  useEffect(() => {
    // GUARD: If user selected a facility, ignore "near you" updates temporarily
    if (highlightedFacility) return;

    if (
      showNearYouFacilities &&
      nearYouFacilities.length > 0 &&
      mapRef.current
    ) {
      const bounds = new mapboxgl.LngLatBounds();
      nearYouFacilities.forEach((f) => bounds.extend([f.lon, f.lat]));
      allFacilities.forEach((f) => bounds.extend([f.lon, f.lat]));

      if (userLocation)
        bounds.extend([userLocation.longitude, userLocation.latitude]);

      mapRef.current.fitBounds(bounds, {
        padding: { top: 40, bottom: 350, left: 50, right: 50 },
        duration: 3000, // Slightly longer duration for a smoother transition
      });
    }
  }, [
    showNearYouFacilities,
    nearYouFacilities,
    userLocation,
    allFacilities,
    mapRef,
    highlightedFacility, // Added this dependency to trigger re-zoom when deselecting
  ]);

  // 2. Fit bounds for Route
  useEffect(() => {
    if (routeGeometry && mapRef.current) {
      const coordinates = routeGeometry.coordinates;
      const bounds = coordinates.reduce(
        (b: mapboxgl.LngLatBounds, coord: [number, number]) => b.extend(coord),
        new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]),
      );

      mapRef.current.fitBounds(bounds, {
        padding: { top: 40, bottom: 450, left: 50, right: 50 },
        duration: 2000,
      });
    }
  }, [routeGeometry, mapRef, highlightedFacility]);

  // 3. Fly to Highlighted Facility (The "Real Close" Logic)
  useEffect(() => {
    if (highlightedFacility && mapRef.current) {
      mapRef.current.flyTo({
        center: [highlightedFacility.lon, highlightedFacility.lat],
        // 18.5 is building-level close. (15 is neighborhood, 20 is doorstep)
        zoom: 18.5,
        // Pitch tilts the camera for a 3D effect, making it feel more "immersive"
        pitch: 50,
        duration: 8000, // Slightly longer for a smoother "travel" effect
        padding: { top: 40, bottom: 350, left: 50, right: 50 },
        essential: true,
      });
    }
  }, [highlightedFacility, mapRef]);
}
