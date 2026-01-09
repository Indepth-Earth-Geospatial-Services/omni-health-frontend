// hooks/useFacilities.ts
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { facilityService } from "../services/facility.service";
import { Coordinates } from "../types";

export const facilityKeys = {
  facility: (id: string) => ["facility", id] as const,
  lgaFacilities: (latitude: number, longitude: number) =>
    [
      "lgaFacilities",
      Math.round(latitude * 100) / 100,
      Math.round(longitude * 100) / 100,
    ] as const,
  nearestFacility: (latitude: number, longitude: number) =>
    [
      "nearestFacility",
      Math.round(latitude * 100) / 100,
      Math.round(longitude * 100) / 100,
    ] as const,
};

export const useFacility = (id: string, options = {}) => {
  return useQuery({
    queryKey: facilityKeys.facility(id),
    queryFn: () => facilityService.getFacility(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    enabled: !!id,
    ...options,
  });
};

export const useLGAFacilities = (
  coordinates: Coordinates | null | undefined,
  options = {},
) => {
  return useInfiniteQuery({
    queryKey: coordinates
      ? facilityKeys.lgaFacilities(coordinates.latitude, coordinates.longitude)
      : ["lgaFacilities", "no-coords"],
    queryFn: ({ pageParam = 1 }) => {
      if (!coordinates) {
        throw new Error("Coordinates are required to fetch LGA facilities");
      }
      return facilityService.getLGAFacilities({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        page: pageParam,
        limit: 10,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled: !!coordinates,
    retry: (failureCount, error) => {
      if (error.message.includes("Coordinates")) return false;
      return failureCount < 2;
    },
    ...options,
  });
};

export const useNearestFacility = (
  coordinates: Coordinates | null | undefined,
  options = {},
) => {
  return useQuery({
    queryKey: coordinates
      ? facilityKeys.nearestFacility(
          coordinates.latitude,
          coordinates.longitude,
        )
      : ["nearestFacility", "no-coords"],
    queryFn: () => {
      if (!coordinates) {
        throw new Error("Coordinates are required to fetch nearest facility");
      }
      return facilityService.getNearestFacility(coordinates);
    },
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: true,
    enabled: !!coordinates,
    retry: 1,
    ...options,
  });
};

export const useInvalidateFacilityCache = () => {
  const queryClient = useQueryClient();

  return {
    invalidateFacility: (id?: string) => {
      if (id) {
        return queryClient.invalidateQueries({
          queryKey: facilityKeys.facility(id),
        });
      }
      return queryClient.invalidateQueries({
        queryKey: ["facility"],
      });
    },
    invalidateLGAFacilities: (latitude?: number, longitude?: number) => {
      if (latitude !== undefined && longitude !== undefined) {
        return queryClient.invalidateQueries({
          queryKey: facilityKeys.lgaFacilities(latitude, longitude),
        });
      }
      return queryClient.invalidateQueries({
        queryKey: ["lgaFacilities"],
      });
    },
    invalidateNearestFacility: (latitude?: number, longitude?: number) => {
      if (latitude !== undefined && longitude !== undefined) {
        return queryClient.invalidateQueries({
          queryKey: facilityKeys.nearestFacility(latitude, longitude),
        });
      }
      return queryClient.invalidateQueries({
        queryKey: ["nearestFacility"],
      });
    },
  };
};
