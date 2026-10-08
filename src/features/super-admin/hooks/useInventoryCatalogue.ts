import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  superAdminService,
  type InventorySummaryItem,
} from "../services/super-admin.service";
import type { InventoryType } from "@/services/admin.service";

export interface CatalogueItem {
  item_name: string;
  name: string;
  type: InventoryType;
}

export interface InventoryCatalogue {
  items: CatalogueItem[];
  byKey: Map<string, CatalogueItem>;
  /** False when names were derived from keys because /summary was refused. */
  hasDisplayNames: boolean;
}

export const inventoryCatalogueKeys = {
  summary: ["inventory-summary"] as const,
  catalogue: ["inventory-catalogue"] as const,
};

/** "adult_weighing_scale" -> "Adult Weighing Scale". Fallback only. */
export function formatItemKey(key: string) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

/** Display name for a key, falling back to the formatted key while loading. */
export function itemDisplayName(
  catalogue: InventoryCatalogue | undefined,
  key: string,
) {
  return catalogue?.byKey.get(key)?.name ?? formatItemKey(key);
}

const fetchSummary = () => superAdminService.getAllInventorySummary();

/**
 * Every catalogue item with its totals across all facilities. Changes when any
 * facility's counts change, so writes invalidate it.
 */
export function useInventorySummary() {
  return useQuery<InventorySummaryItem[]>({
    queryKey: inventoryCatalogueKeys.summary,
    queryFn: fetchSummary,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

/**
 * The fixed 84-item catalogue with display names — the only valid item_names
 * for the write endpoints. Names come from /summary (sharing its cache with
 * useInventorySummary). If that is refused, e.g. for a role the backend has
 * not opened it to, this falls back to the keys from /unique with names
 * derived from the key, so pickers keep working.
 */
export function useInventoryCatalogue() {
  const queryClient = useQueryClient();

  return useQuery<InventoryCatalogue>({
    queryKey: inventoryCatalogueKeys.catalogue,
    queryFn: async () => {
      let items: CatalogueItem[];
      let hasDisplayNames = true;

      try {
        const summary = await queryClient.ensureQueryData({
          queryKey: inventoryCatalogueKeys.summary,
          queryFn: fetchSummary,
        });
        items = summary.map(({ item_name, name, type }) => ({
          item_name,
          name,
          type,
        }));
      } catch {
        const unique = await superAdminService.getUniqueInventory();
        hasDisplayNames = false;
        items = [
          ...unique.equipment.map((key) => ({
            item_name: key,
            name: formatItemKey(key),
            type: "equipment" as const,
          })),
          ...unique.infrastructure.map((key) => ({
            item_name: key,
            name: formatItemKey(key),
            type: "infrastructure" as const,
          })),
        ];
      }

      items.sort((a, b) => a.name.localeCompare(b.name));
      return {
        items,
        byKey: new Map(items.map((item) => [item.item_name, item])),
        hasDisplayNames,
      };
    },
    // The catalogue is fixed server-side; there is no reason to refetch it
    // within a session.
    staleTime: Infinity,
    gcTime: 60 * 60 * 1000,
    retry: 1,
  });
}
