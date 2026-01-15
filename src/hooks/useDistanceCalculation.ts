// FIXME STABLIZE USER LOCATION APPROX SO IT DOES NOT FIRE UNLESS USER MOVES 500M FROM WHEN IT FIRED LAST AND RETAIN THIS EXACT FUNCTIONALITY ELSE YOU WILL CRY😢
import { Coordinates, mapboxService } from "@/services/mapbox.service";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

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
  // Calculate Haversine distance immediately
  const haversineDistance = useMemo(() => {
    if (!userLocation || !facilityLocation) return null;
    return mapboxService.calculateHaversineDistance(
      userLocation,
      facilityLocation,
    );
  }, [userLocation, facilityLocation]);

  // Fetch accurate road distance
  const { data: accurateDistance, isLoading } = useQuery({
    queryKey: ["accurate-distance", userLocation, facilityId],
    queryFn: async () => {
      // Check if coordinates are valid (not undefined/null)
      if (!userLocation || !facilityLocation) return null;

      // Check if coordinates have valid numbers
      if (
        typeof userLocation.latitude !== "number" ||
        typeof userLocation.longitude !== "number" ||
        typeof facilityLocation.latitude !== "number" ||
        typeof facilityLocation.longitude !== "number"
      ) {
        console.warn("Invalid coordinates:", {
          userLocation,
          facilityLocation,
        });
        return null;
      }

      const distances = await mapboxService.getDistancesFromMatrix(
        userLocation,
        [facilityLocation],
      );
      console.log("HOOK FIRED-------------------------");
      return distances[0] || null;
    },
    enabled:
      enableAccurateDistance &&
      !!userLocation &&
      !!facilityLocation &&
      typeof userLocation.latitude === "number" &&
      typeof userLocation.longitude === "number" &&
      typeof facilityLocation.latitude === "number" &&
      typeof facilityLocation.longitude === "number",
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  // Use accurate if available, otherwise fallback to haversine
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
