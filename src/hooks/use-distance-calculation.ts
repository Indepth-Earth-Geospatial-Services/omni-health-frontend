import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Coordinates, mapboxService } from "@/services/mapbox.service";

interface UseSingleFacilityDistanceOptions {
  userLocation: Coordinates | null;
  facilityLocation: Coordinates | null;
  facilityId: string;
  enableAccurateDistance?: boolean;
}

export function useDistanceCalculation({
  userLocation,
  facilityLocation,
  facilityId,
  enableAccurateDistance = true,
}: UseSingleFacilityDistanceOptions) {
  // 1. Stabilized State: This only updates when the user moves significantly.
  // We use this for the Query Key to prevent excessive API calls.
  const [stabilizedLocation, setStabilizedLocation] =
    useState<Coordinates | null>(userLocation);

  useEffect(() => {
    // Guard: Ensure we have valid raw coordinates
    if (!userLocation?.latitude || !userLocation?.longitude) return;

    // Initial Sync: If stabilizedLocation is null, set it to the current user location
    if (!stabilizedLocation) {
      // eslint-disable-next-line
      setStabilizedLocation(userLocation);
      return;
    }

    /**
     * LOGIC FIX:
     * We calculate the distance between the 'last stabilized point' and 'current raw point'.
     * We DO NOT put stabilizedLocation in the dependency array.
     * This ensures we are always comparing current movement against the fixed "last snap" point.
     */
    const movement = mapboxService.calculateHaversineDistance(
      stabilizedLocation,
      userLocation,
    );

    // If movement > 500m, snap the stabilized location to the current raw location
    if (movement >= 500) {
      setStabilizedLocation(userLocation);
    }

    // NOTE: We only watch userLocation. If we watched stabilizedLocation,
    // movement would reset to 0 immediately on every update, breaking the logic.
  }, [userLocation]);

  // 2. Immediate Feedback (Haversine)
  // We use the RAW userLocation here so the UI feels responsive while walking/driving.
  const haversineDistance = useMemo(() => {
    if (
      !userLocation.latitude ||
      !userLocation.longitude ||
      !facilityLocation.latitude ||
      !facilityLocation.longitude
    )
      return null;

    return mapboxService.calculateHaversineDistance(
      userLocation,
      facilityLocation,
    );
  }, [userLocation, facilityLocation]);

  // 3. Accurate Road Distance (Mapbox Matrix API)
  const { data: accurateDistance, isLoading } = useQuery({
    // The query only refetches when the user crosses the 500m threshold
    // OR the facilityId changes.
    queryKey: ["accurate-distance", stabilizedLocation, facilityId],
    queryFn: async () => {
      if (
        !stabilizedLocation ||
        !facilityLocation.latitude ||
        !facilityLocation.longitude
      )
        return null;

      // Type Safety check for Matrix API
      if (
        typeof stabilizedLocation.latitude !== "number" ||
        typeof stabilizedLocation.longitude !== "number" ||
        typeof facilityLocation.latitude !== "number" ||
        typeof facilityLocation.longitude !== "number"
      ) {
        return null;
      }

      const distances = await mapboxService.getDistancesFromMatrix(
        stabilizedLocation,
        [facilityLocation],
      );

      return distances[0] || null;
    },
    enabled:
      enableAccurateDistance && !!stabilizedLocation && !!facilityLocation,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    retry: 2,
  });

  // Final Output Logic: Accurate > Haversine > null
  const distance = accurateDistance ?? haversineDistance;
  const isApproximate = !accurateDistance && haversineDistance !== null;

  return {
    distance,
    isLoading,
    isApproximate,
    formattedDistance: distance
      ? mapboxService.formatDistance(distance)
      : "N/A",
    distanceInKm: distance ? distance / 1000 : null,
  };
}
