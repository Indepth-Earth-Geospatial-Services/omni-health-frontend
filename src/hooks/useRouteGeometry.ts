import { useQuery } from "@tanstack/react-query";
import { mapboxService, Coordinates } from "@/services/mapbox.service";

interface UseRouteGeometryOptions {
  origin: Coordinates | null;
  destination: Coordinates | null;
  profile?: "driving" | "driving-traffic" | "walking" | "cycling";
  enabled?: boolean;
}

export function useRouteGeometry({
  origin,
  destination,
  profile = "driving-traffic",
  enabled = true,
}: UseRouteGeometryOptions) {
  return useQuery({
    queryKey: ["route-geometry", origin, destination, profile],
    queryFn: async () => {
      if (!origin || !destination) {
        throw new Error("Origin and destination are required");
      }

      const response = await mapboxService.getDirections(origin, destination, {
        profile,
        language: "en",
        voiceUnits: "metric",
        alternatives: false,
      });

      const route = response.routes[0];
      return {
        geometry: route.geometry,
        distance: route.distance,
        duration: route.duration,
        distanceFormatted: mapboxService.formatDistance(route.distance),
        durationFormatted: mapboxService.formatDuration(route.duration),
      };
    },
    enabled: enabled && !!origin && !!destination,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}
