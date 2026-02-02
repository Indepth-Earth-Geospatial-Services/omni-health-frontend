import { useQuery } from "@tanstack/react-query";
import {
  superAdminService,
  type NotificationsResponse,
} from "../services/super-admin.service";

/**
 * Hook to fetch notifications for a specific user
 * GET /api/v1/admin/notifications?user_id={user_id}
 */
export function useNotifications(userId: number | string | undefined) {
  // Ensure userId is a valid number (handles string values from localStorage)
  const numericUserId = userId !== undefined ? Number(userId) : undefined;
  const isValidUserId = numericUserId !== undefined && !isNaN(numericUserId);

  return useQuery<NotificationsResponse>({
    queryKey: ["notifications", numericUserId],
    queryFn: () => superAdminService.getNotifications(numericUserId!),
    enabled: isValidUserId, // Only fetch if userId is a valid number
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes for real-time alerts
  });
}
