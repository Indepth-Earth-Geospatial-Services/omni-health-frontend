import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { facilityService } from "../services/facility.service";
import { Coordinates } from "../features/user/types";
import { FilterQuery } from "@/types/search-filter";
import { FACILITY_KEYS } from "@/constants";

export const useAllFacilities = (filters?: FilterQuery, options = {}) => {
  return useInfiniteQuery({
    queryKey: FACILITY_KEYS.allFacilities(filters),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await facilityService.getAllFacilities({
        page: pageParam,
        limit: 10,
        filters,
      });

      // Transform to the format getNextPageParam expects
      return {
        facilities: response.facilities,
        page: response.pagination.current_page,
        limit: response.pagination.limit,
        totalPages: response.pagination.total_pages,
        totalCount: response.pagination.total_records,
      };
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
    retry: (failureCount, error) => {
      return failureCount < 2;
    },
    ...options,
  });
};

export const useFacility = (id: string, options = {}) => {
  return useQuery({
    queryKey: FACILITY_KEYS.facility(id),
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
      ? FACILITY_KEYS.lgaFacilities(coordinates.latitude, coordinates.longitude)
      : ["lgaFacilities", "no-coords"],
    queryFn: async ({ pageParam = 1 }) => {
      if (!coordinates) {
        throw new Error("Coordinates are required to fetch LGA facilities");
      }

      const response = await facilityService.getLGAFacilities({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        page: pageParam,
        limit: 10,
      });

      // Transform to the format getNextPageParam expects
      return {
        facilities: response.facilities,
        page: response.pagination.current_page,
        limit: response.pagination.limit,
        totalPages: response.pagination.total_pages,
        totalCount: response.pagination.total_records,
      };
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
      ? FACILITY_KEYS.nearestFacility(
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
          queryKey: FACILITY_KEYS.facility(id),
        });
      }
      return queryClient.invalidateQueries({
        queryKey: ["facility"],
      });
    },
    invalidateLGAFacilities: (latitude?: number, longitude?: number) => {
      if (latitude !== undefined && longitude !== undefined) {
        return queryClient.invalidateQueries({
          queryKey: FACILITY_KEYS.lgaFacilities(latitude, longitude),
        });
      }
      return queryClient.invalidateQueries({
        queryKey: ["lgaFacilities"],
      });
    },
    invalidateNearestFacility: (latitude?: number, longitude?: number) => {
      if (latitude !== undefined && longitude !== undefined) {
        return queryClient.invalidateQueries({
          queryKey: FACILITY_KEYS.nearestFacility(latitude, longitude),
        });
      }
      return queryClient.invalidateQueries({
        queryKey: ["nearestFacility"],
      });
    },
  };
};
