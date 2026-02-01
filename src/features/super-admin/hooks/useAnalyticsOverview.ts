import { useQuery } from "@tanstack/react-query";
import {
  superAdminService,
  AnalyticsOverviewResponse,
} from "../services/super-admin.service";

/**
 * Hook to fetch analytics overview data (KPIs)
 * GET /api/v1/admin/analytics/overview
 */
export function useAnalyticsOverview() {
  return useQuery<AnalyticsOverviewResponse>({
    queryKey: ["analytics", "overview"],
    queryFn: () => superAdminService.getAnalyticsOverview(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}
