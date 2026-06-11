/* eslint-disable @typescript-eslint/no-explicit-any */
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

// helper: only extend bounds with coordinates that are actually numbers
function safeExtend(
  bounds: mapboxgl.LngLatBounds,
  lng: number | undefined | null,
  lat: number | undefined | null,
) {
  if (isFinite(lng as number) && isFinite(lat as number)) {
    bounds.extend([lng as number, lat as number]);
  }
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
  // 1. Fit bounds for "Near You" browsing view
  useEffect(() => {
    if (highlightedFacility) return;
    if (!showNearYouFacilities) return;
    if (!mapRef.current) return;
    // wait for the map to actually be loaded before calling fitBounds
    const map = mapRef.current.getMap?.() ?? mapRef.current;
    if (!map.isStyleLoaded()) return;

    const bounds = new mapboxgl.LngLatBounds();

    nearYouFacilities.forEach((f) => safeExtend(bounds, f.lon, f.lat));
    allFacilities.forEach((f) => safeExtend(bounds, f.lon, f.lat));

    if (userLocation) {
      safeExtend(bounds, userLocation.longitude, userLocation.latitude);
    }

    // critical: never call fitBounds on an empty bounds object
    if (bounds.isEmpty()) return;

    map.fitBounds(bounds, {
      padding: { top: 40, bottom: 350, left: 50, right: 50 },
      duration: 3000,
    });
  }, [
    showNearYouFacilities,
    nearYouFacilities,
    userLocation,
    allFacilities,
    mapRef,
    highlightedFacility,
  ]);

  // 2. Fit bounds for route geometry
  useEffect(() => {
    if (!routeGeometry || !mapRef.current) return;

    const map = mapRef.current.getMap?.() ?? mapRef.current;
    const coordinates: [number, number][] = routeGeometry.coordinates;

    if (!coordinates?.length) return;

    const validCoords = coordinates.filter(
      ([lng, lat]) => isFinite(lng) && isFinite(lat),
    );
    if (!validCoords.length) return;

    const bounds = validCoords.reduce(
      (b, coord) => b.extend(coord),
      new mapboxgl.LngLatBounds(validCoords[0], validCoords[0]),
    );

    map.fitBounds(bounds, {
      padding: { top: 40, bottom: 450, left: 50, right: 50 },
      duration: 2000,
    });
  }, [routeGeometry, mapRef, highlightedFacility]);

  // 3. Fly to selected facility
  useEffect(() => {
    if (!highlightedFacility || !mapRef.current) return;
    if (
      !isFinite(highlightedFacility.lon) ||
      !isFinite(highlightedFacility.lat)
    )
      return;

    const map = mapRef.current.getMap?.() ?? mapRef.current;

    map.flyTo({
      center: [highlightedFacility.lon, highlightedFacility.lat],
      zoom: 18.5,
      pitch: 50,
      duration: 8000,
      padding: { top: 40, bottom: 350, left: 50, right: 50 },
      essential: true,
    });
  }, [highlightedFacility, mapRef]);
}
