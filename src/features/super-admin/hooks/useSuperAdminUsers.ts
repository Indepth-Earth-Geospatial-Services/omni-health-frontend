import { useQuery } from "@tanstack/react-query";
import {
  superAdminService,
  type GetUsersResponse,
  type User,
  type SearchFacilityParams,
  type SearchFacilityResponse,
  type GetAllStaffResponse,
  type GetUsersParams,
  type GetUniqueEquipmentParams,
  type UniqueEquipmentItem,
} from "../services/super-admin.service";

/**
 * Hook to fetch all users (Super Admin only)
 * Uses TanStack Query for caching and state management
 * Supports search by name and filter by status
 */
export function useSuperAdminUsers(params: GetUsersParams = {}) {
  const { page = 1, limit = 20, name, is_active } = params;

  return useQuery<GetUsersResponse>({
    queryKey: ["super-admin-users", page, limit, name, is_active],
    queryFn: () => superAdminService.getUsers({ page, limit, name, is_active }),
    staleTime: 0,
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
  });
}

/**
 * Hook to fetch all Unique equipment and infrastructure (Super Admin only)
 * Uses TanStack Query for caching and state management
 * Returns equipment and infrastructure arrays for filtering/display
 */
export function useUniqueInventory() {
  return useQuery<UniqueEquipmentItem>({
    queryKey: ["unique-inventory"],
    queryFn: () => superAdminService.getUniqueInventory(),
    staleTime: 1000 * 60 * 5, // 5 minutes - cache for 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes garbage collection
  });
}

/**
 * Custom hook to fetch all staff with pagination
 * @param page - Current page number
 * @param limit - Number of records per page
 */
export const useSuperAdminStaff = (page: number = 1, limit: number = 10) => {
  return useQuery<GetAllStaffResponse>({
    queryKey: ["super-admin-staff", page, limit],
    queryFn: () => superAdminService.getAllStaff({ page, limit }),
    staleTime: 5000, // 5 seconds
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Custom hook to search and filter facilities
 * connect to /api/v1/facilities/search via superAdminService
 */
export const useFacilities = (params: SearchFacilityParams) => {
  return useQuery<SearchFacilityResponse>({
    // IMPORTANT: 'params' must be in the queryKey so the hook refetches when filters change
    queryKey: ["facilities", params],

    queryFn: async () => {
      // Calls the search method in superAdminService
      return superAdminService.searchFacilities(params);
    },

    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (previousData) => previousData, // Keeps table stable while loading new filter results
  });
};

// Export types for use in components
export type { User, GetUsersResponse };
