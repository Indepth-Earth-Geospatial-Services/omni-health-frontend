import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { superAdminService } from "../services/super-admin.service";
import { adminService } from "@/services/admin.service";
import { inventoryCatalogueKeys } from "./useInventoryCatalogue";
import { refreshInventoryQueries } from "@/features/admin/hooks/useAdminStaff";

export type InventoryItemType = "equipment" | "infrastructure";

/** Just enough to list a facility and act on it — name for display, id to
 *  delete by. Per-facility counts live on the facility inventory endpoint;
 *  the facility list no longer carries them. */
export interface FacilitySummary {
  facility_id: string;
  facility_name: string;
}

export const inventoryFacilitiesKeys = {
  all: inventoryCatalogueKeys.facilitiesByItem,
  /** Every page/limit for one item — the prefix invalidated after a delete. */
  forItem: (itemName: string) =>
    [...inventoryFacilitiesKeys.all, itemName] as const,
  item: (
    itemName: string,
    type: InventoryItemType,
    page: number,
    limit: number,
  ) =>
    [...inventoryFacilitiesKeys.forItem(itemName), type, page, limit] as const,
};

/**
 * Facilities holding a given equipment/infrastructure item, paginated.
 *
 * The only backend filter for this is GET /facilities?inventory_item=..., which
 * returns the full facility record per row — every other facility's inventory
 * map, services, specialists, image URLs, working hours. `select` discards all
 * of that immediately, down to just the id and name the row renders, instead
 * of carrying the same "20 fields, ~2KB each" weight documented in
 * useFacilityOptions.
 *
 * Called eagerly (not gated behind expanding the row) so the facility count
 * shows immediately next to each item. That's more requests up front, so this
 * leans on React Query rather than plain state: a long `staleTime` means
 * revisiting the page — or re-expanding an item — within the window reads
 * from cache instead of refetching, and a failed page surfaces
 * `isError`/`refetch` instead of silently showing an empty list.
 */
export function useFacilitiesByInventory(
  itemName: string | null,
  type: InventoryItemType,
  page: number,
  limit = 10,
) {
  return useQuery({
    queryKey: inventoryFacilitiesKeys.item(itemName ?? "", type, page, limit),
    queryFn: () =>
      superAdminService.getFacilitiesByInventory({
        inventory_item: itemName as string,
        page,
        limit,
      }),
    select: (data) => ({
      pagination: data.pagination,
      facilities: data.facilities.map((f): FacilitySummary => ({
        facility_id: f.facility_id,
        facility_name: f.facility_name,
      })),
    }),
    enabled: !!itemName,
    placeholderData: keepPreviousData,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
}

export interface BatchResult {
  total: number;
  succeeded: number;
  failed: number;
}

/**
 * There's no bulk endpoint on either side — add and delete are both scoped to
 * one facility per call, because an item is a physical thing that exists per
 * facility, not a global catalog entry. This runs the same per-facility call
 * across a list of facilities and reports how many actually made it, instead
 * of failing the whole batch (and losing the successful ones) the moment one
 * facility errors.
 */
async function runBatch(
  facilityIds: string[],
  run: (facilityId: string) => Promise<unknown>,
): Promise<BatchResult> {
  const results = await Promise.allSettled(facilityIds.map(run));
  const failed = results.filter((r) => r.status === "rejected").length;
  return {
    total: facilityIds.length,
    succeeded: facilityIds.length - failed,
    failed,
  };
}

/**
 * Removes one equipment/infrastructure item from one or more facilities.
 * Reuses the same admin endpoints as the single-facility admin inventory page
 * (`adminService.deleteEquipment` / `deleteInfrastructure`) — the facility
 * just varies per call here instead of being fixed for the whole hook, since
 * this drill-down spans every facility rather than one. A single-row delete
 * is just a batch of one, so there's only ever one code path to keep correct.
 */
export function useDeleteInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      facilityIds,
      itemName,
      type,
    }: {
      facilityIds: string[];
      itemName: string;
      type: InventoryItemType;
    }) =>
      runBatch(facilityIds, (facilityId) =>
        type === "equipment"
          ? adminService.deleteEquipment({ facilityId, itemName })
          : adminService.deleteInfrastructure({ facilityId, itemName }),
      ),
    // Every facility the batch touched, the totals and the per-item lists.
    onSuccess: () => refreshInventoryQueries(queryClient),
  });
}

/**
 * Adds one equipment/infrastructure item to one or more facilities at once —
 * the write side of the same "no bulk endpoint" constraint as the delete
 * hook above, so it shares the same per-facility fan-out and result shape.
 */
export function useBatchAddInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      facilityIds,
      itemName,
      functional,
      notFunctional,
      type,
    }: {
      facilityIds: string[];
      itemName: string;
      functional: number;
      notFunctional: number;
      type: InventoryItemType;
    }) => {
      const data = {
        item_name: itemName,
        functional,
        not_functional: notFunctional,
      };
      return runBatch(facilityIds, (facilityId) =>
        type === "equipment"
          ? adminService.addEquipment({ facilityId, data })
          : adminService.addInfrastructure({ facilityId, data }),
      );
    },
    // As above, plus the catalogue: a typed name may be new to it, and the
    // batch result does not carry each response's item_created flag.
    onSuccess: () =>
      refreshInventoryQueries(queryClient, { catalogueChanged: true }),
  });
}
