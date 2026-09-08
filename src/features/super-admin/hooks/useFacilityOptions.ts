import { useQuery } from "@tanstack/react-query";
import { superAdminService } from "../services/super-admin.service";

/** The id/label pair a facility dropdown needs, plus the staff count that
 *  comes free with the analytics endpoint. */
export interface FacilityOption {
  facility_id: string;
  facility_name: string;
  staff_count: number;
}

export const facilityOptionKeys = {
  all: ["facility-options"] as const,
};

/**
 * The facility list used to populate filter dropdowns.
 *
 * Sourced from GET /admin/analytics/facilities rather than GET /facilities.
 * The latter returns 20 fields per facility — `inventory` alone is ~2 KB each —
 * so populating a list of names cost 284 KB and ~24 s, of which 96.7% was
 * discarded. It also hardcoded `limit: 100` against 271 facilities, silently
 * leaving 171 unselectable. The analytics endpoint returns 5 fields for every
 * facility with no pagination, so this is both smaller and complete.
 *
 * Shared through React Query so the list is fetched once per session instead of
 * once per component mount. Pass `enabled: false` where no dropdown renders.
 */
export function useFacilityOptions(enabled = true) {
  return useQuery({
    queryKey: facilityOptionKeys.all,
    queryFn: async (): Promise<FacilityOption[]> => {
      const rows = await superAdminService.getFacilitiesAnalytics();
      return rows
        .map((row) => ({
          facility_id: row.facility_id,
          facility_name: row.facility_name,
          staff_count: row.staff_count,
        }))
        .sort((a, b) => a.facility_name.localeCompare(b.facility_name));
    },
    // Facility names change rarely; no need to refetch while navigating.
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled,
  });
}
