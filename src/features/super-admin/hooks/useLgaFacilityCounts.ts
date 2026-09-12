import { useQuery } from "@tanstack/react-query";
import { superAdminService } from "../services/super-admin.service";

export const lgaFacilityCountsKey = ["lga-facility-counts"] as const;

/**
 * How many facilities each LGA actually has, keyed by LGA name.
 *
 * There's no lightweight per-LGA count endpoint — this pays the same "every
 * facility field, ~2KB each" cost documented in useFacilityOptions once, but
 * `select` immediately collapses the response to a single {lgaName: count}
 * map and discards the rest, and a long `staleTime` means it's paid once per
 * session rather than once per dropdown that needs it.
 *
 * Used to keep LGAs with zero facilities out of the Assign LGA and Invite
 * pickers: assigning one is rejected server-side (see assign-manager's 400
 * for an LGA with no facilities), and inviting an admin to one currently
 * succeeds silently into a coverage area with nothing in it — both are
 * dead ends the picker shouldn't offer in the first place.
 */
export function useLgaFacilityCounts() {
  return useQuery({
    queryKey: lgaFacilityCountsKey,
    queryFn: () => superAdminService.searchFacilities({ page: 1, limit: 1000 }),
    select: (data) => {
      const counts: Record<string, number> = {};
      for (const facility of data.facilities) {
        const lga = facility.facility_lga;
        if (!lga) continue;
        counts[lga] = (counts[lga] ?? 0) + 1;
      }
      return counts;
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}
