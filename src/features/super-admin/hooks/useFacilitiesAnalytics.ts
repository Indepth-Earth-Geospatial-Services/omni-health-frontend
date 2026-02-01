import { useQuery } from "@tanstack/react-query";
import { superAdminService } from "../services/super-admin.service";
import { FacilitiesAnalyticsResponse } from "../services/super-admin.service";

export const useFacilitiesAnalytics = () => {
  return useQuery<FacilitiesAnalyticsResponse>({
    queryKey: ["analytics", "facilities"],
    queryFn: async () => {
      return await superAdminService.getFacilitiesAnalytics();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
