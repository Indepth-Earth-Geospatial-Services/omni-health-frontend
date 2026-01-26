import { useQuery } from "@tanstack/react-query";
import {
  superAdminService,
  type GetUsersResponse,
  type User,
} from "../services/super-admin.service";

/**
 * Hook to fetch all users (Super Admin only)
 * Uses TanStack Query for caching and state management
 */
export function useSuperAdminUsers(page: number = 1, limit: number = 20) {
  return useQuery<GetUsersResponse>({
    queryKey: ["super-admin-users", page, limit],
    queryFn: () => superAdminService.getUsers({ page, limit }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
  });
}

// Export types for use in components
export type { User, GetUsersResponse };
