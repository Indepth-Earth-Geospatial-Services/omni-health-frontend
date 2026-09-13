// hooks/useStaffQuery.ts
import { useQuery } from "@tanstack/react-query";
import { superAdminService } from "@/features/super-admin/services/super-admin.service";
import { FilterState } from "../components/layouts/StaffTableHeader"; // Adjust path as needed
import type { StaffMember } from "@/services/admin.service";
import { useDebounce } from "@/hooks/use-debounce";

export const useStaffQuery = (
  page: number,
  limit: number,
  filters: FilterState,
) => {
  // The raw `filters.searchQuery` changes on every keystroke — putting it
  // straight into the query key would make each letter a brand-new query
  // (no cached data for it yet), so `isLoading` — not just `isFetching` —
  // would flip true and blank the whole table while typing. Debouncing here
  // means the key only changes once the user pauses, matching the pattern
  // FacilityRegistry uses for its own search.
  const debouncedSearch = useDebounce(filters.searchQuery, 500);
  const effectiveFilters = { ...filters, searchQuery: debouncedSearch };

  const hasActiveFilters =
    effectiveFilters.searchQuery !== "" ||
    effectiveFilters.selectedFacility !== "all" ||
    effectiveFilters.selectedGender !== "all" ||
    effectiveFilters.selectedStatus !== "all";

  return useQuery({
    queryKey: ["all-staff", page, limit, effectiveFilters],
    queryFn: async () => {
      // If facility is selected and we have filters, use search endpoint
      if (effectiveFilters.selectedFacility !== "all" && hasActiveFilters) {
        return await superAdminService.searchStaff({
          facility_id: effectiveFilters.selectedFacility,
          name: effectiveFilters.searchQuery || undefined,
          gender:
            effectiveFilters.selectedGender !== "all"
              ? effectiveFilters.selectedGender
              : undefined,
          is_active:
            effectiveFilters.selectedStatus !== "all"
              ? effectiveFilters.selectedStatus === "true"
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
    // Without this, changing `page` (or the debounced filters) points at a
    // query key with no cached data yet, so `isLoading` goes true and the
    // whole table blanks out until the new page arrives. Keeping the
    // previous page's data in place until the new page resolves is what
    // lets the table stay visible with just a small "fetching" spinner.
    placeholderData: (previousData) => previousData,
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
  qualifications: { type: "object", nullable: true },
  date_first_appointment: { type: "string", nullable: true },
  date_confirmation: { type: "string", nullable: true },
  date_present_appointment: { type: "string", nullable: true },
  date_of_birth: { type: "string", nullable: true },
  lga_origin: { type: "string", nullable: true },
  years_in_present_station: { type: "string", nullable: true },
  phone_number: { type: "string", nullable: true },
  email: { type: "string", nullable: true },
  is_active: { type: "boolean", nullable: true },
  remark: { type: "string", nullable: true },
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
