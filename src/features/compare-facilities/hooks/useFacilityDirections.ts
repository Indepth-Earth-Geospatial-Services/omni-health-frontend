import { useQueries } from "@tanstack/react-query";
import { Facility } from "@/types/api-response";
import { Coordinates, mapboxService } from "@/services/mapbox.service";
import { useMemo } from "react";

export function useFacilityDirections(
  userLocation: Coordinates | null,
  facilityA: Facility | null,
  facilityB: Facility | null
) {
  const queries = useMemo(() => {
    const facilities = [facilityA, facilityB];
    return facilities.map((facility, index) => ({
      // Falls back to the slot index (not just facility?.facility_id) so the
      // two slots never collapse onto the same key — with both undefined,
      // TanStack's QueriesObserver saw two identical query hashes in this
      // useQueries array and warned "Duplicate Queries found" on every render
      // before a facility was picked.
      queryKey: [
        "directions",
        userLocation,
        facility?.facility_id ?? `empty-${index}`,
      ],
      queryFn: async () => {
        if (!userLocation || !facility?.lat || !facility?.lon) {
          return null;
        }
        const destination = {
          latitude: facility.lat,
          longitude: facility.lon,
        };
        const response = await mapboxService.getDirections(
          userLocation,
          destination
        );
        // Return the first route found
        return response.routes[0] ?? null;
      },
      enabled: !!userLocation && !!facility,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      retry: 2,
    }));
  }, [userLocation, facilityA, facilityB]);

  const results = useQueries({ queries });

  const [directionsA, directionsB] = results.map((result) => result.data);

  return {
    directionsA,
    directionsB,
    isLoading: results.some((result) => result.isLoading),
    isError: results.some((result) => result.isError),
  };
}
