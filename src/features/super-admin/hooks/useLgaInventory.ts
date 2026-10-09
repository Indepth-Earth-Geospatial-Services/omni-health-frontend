import { useMemo } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  adminService,
  type FacilityInventory,
  type InventoryCounts,
} from "@/services/admin.service";
import { AdminInventoryKeys } from "@/features/admin/hooks/useAdminStaff";
import { superAdminService } from "../services/super-admin.service";
import { LGA_OPTIONS } from "../constants/lga";
import { useLgaList } from "./useLgas";

export const lgaFacilityKeys = {
  all: ["lga-facilities"] as const,
  lga: (lgaName: string) => [...lgaFacilityKeys.all, lgaName] as const,
};

/** One LGA's facilities — shared by the LGA view and the all-LGAs table. */
const fetchLgaFacilities = (lgaName: string) =>
  superAdminService.searchFacilities({
    lga_name: lgaName,
    page: 1,
    limit: 100,
  });

export interface FacilityListRow {
  facility_id: string;
  facility_name: string;
  facility_category: string;
  facility_lga: string;
}

/**
 * Every facility, gathered one LGA at a time: 23 small requests in parallel,
 * so rows appear LGA by LGA rather than after one large download. The same
 * cache entries as useLgaInventory's facility lists.
 */
export function useAllLgaFacilities(enabled = true) {
  const { data: lgaList } = useLgaList();
  const names = lgaList?.map((l) => l.lga_name) ?? LGA_OPTIONS;

  const queries = useQueries({
    queries: names.map((name) => ({
      queryKey: lgaFacilityKeys.lga(name),
      queryFn: () => fetchLgaFacilities(name),
      enabled,
      staleTime: 10 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    })),
  });

  const rows: FacilityListRow[] = queries.flatMap(
    (q) =>
      q.data?.facilities.map((f) => ({
        facility_id: f.facility_id,
        facility_name: f.facility_name,
        facility_category: f.facility_category,
        facility_lga: f.facility_lga,
      })) ?? [],
  );

  return {
    rows,
    lgasLoaded: queries.filter((q) => !q.isLoading).length,
    lgasTotal: names.length,
    isLoading: queries.length > 0 && queries.every((q) => q.isLoading),
  };
}

export interface LgaFacilityRow {
  facility_id: string;
  facility_name: string;
  facility_category: string;
  /** Still on its way. */
  isLoading: boolean;
  isError: boolean;
  /** The survey reached it — its inventory has at least one recorded item. */
  isSurveyed: boolean;
  typesInStock: number;
  units: number;
  functional: number;
  notFunctional: number;
}

function tally(counts: InventoryCounts | undefined) {
  const values = Object.values(counts ?? {});
  return {
    recorded: values.length,
    inStock: values.filter((c) => c.total > 0).length,
    units: values.reduce((s, c) => s + c.total, 0),
    functional: values.reduce((s, c) => s + c.functional, 0),
    notFunctional: values.reduce((s, c) => s + c.not_functional, 0),
  };
}

/**
 * One LGA's inventory, assembled from its facilities: one request for the
 * LGA's facility list, then each facility's inventory in parallel. Those are
 * the same cached queries the single-facility view uses, so opening a
 * facility from here is instant, and the totals fill in facility by facility
 * rather than appearing only when the slowest one lands.
 *
 * (/admin/inventory/summary?lga_id= could give the totals in one request,
 * but needs LGA ids the frontend can't reliably map yet.)
 */
export function useLgaInventory(lgaName: string | null) {
  const facilitiesQuery = useQuery({
    queryKey: lgaFacilityKeys.lga(lgaName ?? ""),
    queryFn: () => fetchLgaFacilities(lgaName ?? ""),
    enabled: !!lgaName,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const facilities = useMemo(
    () => facilitiesQuery.data?.facilities ?? [],
    [facilitiesQuery.data],
  );

  const inventoryQueries = useQueries({
    queries: facilities.map((f) => ({
      queryKey: AdminInventoryKeys.facility(f.facility_id),
      queryFn: () => adminService.getFacilityInventory(f.facility_id),
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 1,
    })),
  });

  return useMemo(() => {
    const rows: LgaFacilityRow[] = facilities.map((f, i) => {
      const q = inventoryQueries[i];
      const inventory: FacilityInventory | undefined = q?.data?.inventory;
      const eq = tally(inventory?.equipment);
      const inf = tally(inventory?.infrastructure);
      return {
        facility_id: f.facility_id,
        facility_name: f.facility_name,
        facility_category: f.facility_category,
        isLoading: !q || q.isLoading,
        isError: !!q?.isError,
        isSurveyed: eq.recorded + inf.recorded > 0,
        typesInStock: eq.inStock + inf.inStock,
        units: eq.units + inf.units,
        functional: eq.functional + inf.functional,
        notFunctional: eq.notFunctional + inf.notFunctional,
      };
    });

    // Distinct types held anywhere in the LGA, per kind — a type held at two
    // facilities still counts once against the catalogue.
    const heldTypes = {
      equipment: new Set<string>(),
      infrastructure: new Set<string>(),
    };
    inventoryQueries.forEach((q) => {
      const inv = q.data?.inventory;
      if (!inv) return;
      (["equipment", "infrastructure"] as const).forEach((type) =>
        Object.entries(inv[type] ?? {}).forEach(([key, c]) => {
          if (c.total > 0) heldTypes[type].add(key);
        }),
      );
    });

    const loaded = rows.filter((r) => !r.isLoading).length;
    return {
      isLoadingFacilities: facilitiesQuery.isLoading,
      isError: facilitiesQuery.isError,
      rows,
      loaded,
      total: rows.length,
      isComplete: !facilitiesQuery.isLoading && loaded === rows.length,
      surveyed: rows.filter((r) => r.isSurveyed).length,
      equipmentTypesHeld: heldTypes.equipment.size,
      infrastructureTypesHeld: heldTypes.infrastructure.size,
      units: rows.reduce((s, r) => s + r.units, 0),
      functional: rows.reduce((s, r) => s + r.functional, 0),
      notFunctional: rows.reduce((s, r) => s + r.notFunctional, 0),
    };
  }, [
    facilities,
    inventoryQueries,
    facilitiesQuery.isLoading,
    facilitiesQuery.isError,
  ]);
}
