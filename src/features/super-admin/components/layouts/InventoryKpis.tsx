"use client";

import { useMemo } from "react";
import {
  Activity,
  Boxes,
  Building2,
  ClipboardCheck,
  Package,
} from "lucide-react";
import KPIStatsCards from "@/features/admin/components/layout/KPICards";
import { useFacilityInventory } from "@/features/admin/hooks/useAdminStaff";
import type { InventoryCounts } from "@/services/admin.service";
import { useInventorySummary } from "../../hooks/useInventoryCatalogue";
import { useFacilityOptions } from "../../hooks/useFacilityOptions";
import { useUniqueInventory } from "../../hooks/useSuperAdminUsers";

interface InventoryKpisProps {
  /** Set when one facility is in view (By Facility tab); otherwise the row
   *  describes every facility. */
  facilityId: string | null;
}

const pct = (part: number, whole: number) =>
  whole > 0 ? `${Math.round((part / whole) * 100)}%` : "—";

/** Types with a count above zero, and the units and conditions across them. */
function tally(counts: InventoryCounts | undefined) {
  const values = Object.values(counts ?? {});
  return {
    inStock: values.filter((c) => c.total > 0).length,
    recorded: values.length,
    units: values.reduce((s, c) => s + c.total, 0),
    functional: values.reduce((s, c) => s + c.functional, 0),
    notFunctional: values.reduce((s, c) => s + c.not_functional, 0),
  };
}

/**
 * The inventory page's single KPI row. Two vocabularies are kept apart on
 * purpose: a *type* is a catalogue item (78 equipment, 6 infrastructure); a
 * *unit* is a physical thing counted at a facility. Every denominator is
 * named, so "78" never means two different things on one screen.
 */
export default function InventoryKpis({ facilityId }: InventoryKpisProps) {
  const { data: catalogueKeys, isLoading: isLoadingCatalogue } =
    useUniqueInventory();
  const { data: summary, isLoading: isLoadingSummary } = useInventorySummary();
  const { data: facilities } = useFacilityOptions();
  const { data: facilityInventory, isLoading: isLoadingFacility } =
    useFacilityInventory(facilityId ?? "");

  const equipmentTypes = catalogueKeys?.equipment.length ?? 0;
  const infrastructureTypes = catalogueKeys?.infrastructure.length ?? 0;

  const overall = useMemo(() => {
    const items = summary ?? [];
    const functional = items.reduce((s, i) => s + i.total_functional, 0);
    const notFunctional = items.reduce((s, i) => s + i.total_not_functional, 0);
    return {
      // An item a facility's survey recorded counts it as surveyed; the item
      // most often recorded gives the number of surveyed facilities.
      surveyed: Math.max(0, ...items.map((i) => i.facilities_listing_item)),
      functional,
      counted: functional + notFunctional,
    };
  }, [summary]);

  const facility = useMemo(
    () => ({
      equipment: tally(facilityInventory?.inventory?.equipment),
      infrastructure: tally(facilityInventory?.inventory?.infrastructure),
    }),
    [facilityInventory],
  );

  const dash = (loading: boolean, value: string | number) =>
    loading ? "—" : value;

  if (facilityId) {
    const units = facility.equipment.units + facility.infrastructure.units;
    const functional =
      facility.equipment.functional + facility.infrastructure.functional;
    const notFunctional =
      facility.equipment.notFunctional + facility.infrastructure.notFunctional;
    const isSurveyed =
      facility.equipment.recorded + facility.infrastructure.recorded > 0;

    return (
      <div className="mb-4 grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <KPIStatsCards
          title="Equipment in stock"
          value={dash(isLoadingFacility, facility.equipment.inStock)}
          subtitle={`of ${equipmentTypes} equipment types`}
          icon={<Package size={24} />}
        />
        <KPIStatsCards
          title="Infrastructure in stock"
          value={dash(isLoadingFacility, facility.infrastructure.inStock)}
          subtitle={`of ${infrastructureTypes} infrastructure types`}
          icon={<Building2 size={24} />}
        />
        <KPIStatsCards
          title="Total units"
          value={dash(isLoadingFacility, units)}
          subtitle={isSurveyed ? "at this facility" : "Not surveyed yet"}
          icon={<Boxes size={24} />}
        />
        <KPIStatsCards
          title="Functional units"
          value={dash(
            isLoadingFacility,
            pct(functional, functional + notFunctional),
          )}
          subtitle={
            isSurveyed ? `${notFunctional} non-functional` : "Not surveyed yet"
          }
          icon={<Activity size={24} />}
        />
      </div>
    );
  }

  return (
    <div className="mb-4 grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      <KPIStatsCards
        title="Equipment types"
        value={dash(isLoadingCatalogue, equipmentTypes)}
        subtitle="in the catalogue"
        icon={<Package size={24} />}
      />
      <KPIStatsCards
        title="Infrastructure types"
        value={dash(isLoadingCatalogue, infrastructureTypes)}
        subtitle="in the catalogue"
        icon={<Building2 size={24} />}
      />
      <KPIStatsCards
        title="Facilities surveyed"
        value={dash(isLoadingSummary, overall.surveyed)}
        subtitle={
          facilities ? `of ${facilities.length} facilities` : "for inventory"
        }
        icon={<ClipboardCheck size={24} />}
      />
      <KPIStatsCards
        title="Functional units"
        value={dash(isLoadingSummary, pct(overall.functional, overall.counted))}
        subtitle={
          isLoadingSummary
            ? undefined
            : `${overall.functional.toLocaleString()} of ${overall.counted.toLocaleString()} units, all facilities`
        }
        icon={<Activity size={24} />}
      />
    </div>
  );
}
