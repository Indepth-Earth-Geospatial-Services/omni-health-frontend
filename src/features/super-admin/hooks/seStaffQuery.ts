// hooks/useStaffQuery.ts
import { useQuery } from "@tanstack/react-query";
import { superAdminService } from "@/features/super-admin/services/super-admin.service";
import { FilterState } from "../components/layouts/StaffTableHeader"; // Adjust path as needed

export const useStaffQuery = (
  page: number,
  limit: number,
  filters: FilterState,
) => {
  const hasActiveFilters =
    filters.searchQuery !== "" ||
    filters.selectedFacility !== "all" ||
    filters.selectedGender !== "all" ||
    filters.selectedStatus !== "all";

  return useQuery({
    queryKey: ["all-staff", page, limit, filters],
    queryFn: async () => {
      // If facility is selected and we have filters, use search endpoint
      if (filters.selectedFacility !== "all" && hasActiveFilters) {
        return await superAdminService.searchStaff({
          facility_id: filters.selectedFacility,
          name: filters.searchQuery || undefined,
          gender:
            filters.selectedGender !== "all"
              ? filters.selectedGender
              : undefined,
          is_active:
            filters.selectedStatus !== "all"
              ? filters.selectedStatus === "true"
              : undefined,
          page,
          limit,
        });
      }

      // Otherwise use the getAllStaff endpoint
      return await superAdminService.getAllStaff({ page, limit });
    },
    // Refetch when filters change (using 0 staleTime ensures fresh data on filter change)
    staleTime: 0,
  });
};
