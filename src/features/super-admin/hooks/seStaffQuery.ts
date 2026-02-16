// hooks/useStaffQuery.ts
import { useQuery } from "@tanstack/react-query";
import { superAdminService } from "@/features/super-admin/services/super-admin.service";
import { FilterState } from "../components/layouts/StaffTableHeader"; // Adjust path as needed
import type { StaffMember } from "@/services/admin.service";

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

/**
 * Fetches staff schema dynamically by sampling one record.
 * Uses facility-specific search if facilityId provided, otherwise global getAllStaff.
 * Returns a Record of field names to { type, nullable } for dynamic form/table generation.
 */
const FALLBACK_SCHEMA: Record<string, { type: string; nullable: boolean }> = {
  full_name: { type: "string", nullable: false },
  gender: { type: "string", nullable: true },
  rank_cadre: { type: "string", nullable: true },
  grade_level: { type: "string", nullable: true },
  phone_number: { type: "string", nullable: true },
  email: { type: "string", nullable: true },
  date_first_appointment: { type: "string", nullable: true },
  date_of_birth: { type: "string", nullable: true },
  qualifications: { type: "object", nullable: true },
  is_active: { type: "boolean", nullable: true },
};

const EXCLUDED_SCHEMA_KEYS = ["staff_id", "facility_id"];

function buildSchemaFromStaff(
  staff: StaffMember[],
): Record<string, { type: string; nullable: boolean }> {
  if (!staff || staff.length === 0) return FALLBACK_SCHEMA;

  const sample = staff[0];
  const schema: Record<string, { type: string; nullable: boolean }> = {};

  Object.keys(sample).forEach((key) => {
    if (EXCLUDED_SCHEMA_KEYS.includes(key)) return;
    const value = sample[key as keyof StaffMember];
    schema[key] = {
      type: typeof value === "object" ? "object" : typeof value,
      nullable: value === null || value === undefined,
    };
  });

  return schema;
}

export const useSuperAdminStaffSchema = (facilityId?: string) => {
  return useQuery({
    queryKey: ["staff-schema", facilityId || "global"],
    queryFn: async () => {
      let staff: StaffMember[] = [];

      if (facilityId) {
        const res = await superAdminService.searchStaff({
          facility_id: facilityId,
          page: 1,
          limit: 1,
        });
        staff = res.staff || [];
      } else {
        const res = await superAdminService.getAllStaff({ page: 1, limit: 1 });
        staff = res.staff || [];
      }

      return buildSchemaFromStaff(staff);
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
