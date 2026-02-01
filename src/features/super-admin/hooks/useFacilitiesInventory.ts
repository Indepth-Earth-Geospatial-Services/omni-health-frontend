import { useQuery } from "@tanstack/react-query";
import { superAdminService } from "../services/super-admin.service";

export const useFacilitiesInventory = () => {
  return useQuery({
    queryKey: ["facilities", "inventory"],
    queryFn: async () => {
      // Fetch all facilities across all 23 LGAs (increase limit to capture all)
      return await superAdminService.searchFacilities({
        page: 1,
        limit: 1000,
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
