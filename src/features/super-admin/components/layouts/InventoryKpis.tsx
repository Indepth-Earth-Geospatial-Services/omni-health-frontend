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
import { useLgaInventory } from "../../hooks/useLgaInventory";

interface InventoryKpisProps {
  /** Set when one facility is in view (By Facility tab); otherwise the row
   *  describes every facility. */
  facilityId: string | null;
  /** Clears the facility, returning the row to the LGA, or to all. */
  onClearFacility?: () => void;
  /** Set when an LGA is chosen; the scope sits between all and one facility. */
  lgaName?: string | null;
  /** Clears the LGA (and facility), returning the row to all facilities. */
  onClearLga?: () => void;
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

const ROW = "mb-4 grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4";

/**
 * The inventory page's single KPI row. Two vocabularies are kept apart on
 * purpose: a *type* is a catalogue item (78 equipment, 6 infrastructure); a
 * *unit* is a physical thing counted at a facility. Every denominator is
 * named, so "78" never means two different things on one screen.
 *
 * Each card waits only on its own source, so the row fills in card by card
 * rather than all at once, and switching facility keeps the last figures
 * (dimmed) until the new ones arrive instead of blanking them.
 */
export default function InventoryKpis({
  facilityId,
  onClearFacility,
  lgaName = null,
  onClearLga,
}: InventoryKpisProps) {
  // Cached and shared with the LGA overview, so this costs nothing extra.
  const lga = useLgaInventory(lgaName);
  const { data: catalogueKeys, isLoading: isLoadingCatalogue } =
    useUniqueInventory();
  const { data: summary, isLoading: isLoadingSummary } = useInventorySummary();
  const { data: facilities } = useFacilityOptions();
  const {
    data: facilityInventory,
    isLoading: isLoadingFacility,
    isPlaceholderData: isSwitchingFacility,
  } = useFacilityInventory(facilityId ?? "", { keepPrevious: true });

  const equipmentTypes = catalogueKeys?.equipment.length;
  const infrastructureTypes = catalogueKeys?.infrastructure.length;
  const facilityName = facilities?.find(
    (f) => f.facility_id === facilityId,
  )?.facility_name;

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

  // Says what the numbers describe, so a facility change reads as a change of
  // scope rather than numbers jumping.
  const link = (label: string, onClick?: () => void) =>
    onClick && (
      <>
        {" · "}
        <button
          type="button"
          onClick={onClick}
          className="text-primary font-medium hover:underline"
        >
          {label}
        </button>
      </>
    );

  const scopeLine = (
    <p className="mb-3 text-sm text-slate-500">
      Showing:{" "}
      <span className="font-semibold text-slate-800">
        {facilityId
          ? (facilityName ?? "Selected facility")
          : lgaName
            ? `${lgaName} LGA`
            : "All facilities"}
      </span>
      {facilityId && lgaName && <> in {lgaName}</>}
      {!facilityId && lgaName && !lga.isComplete && (
        <span aria-live="polite">
          {" · "}
          {lga.isLoadingFacilities
            ? "loading facilities…"
            : `loading ${lga.loaded} of ${lga.total} facilities…`}
        </span>
      )}
      {facilityId
        ? lgaName
          ? link(`Back to ${lgaName}`, onClearFacility)
          : link("Back to all facilities", onClearFacility)
        : lgaName && link("Back to all facilities", onClearLga)}
    </p>
  );

  if (facilityId) {
    const units = facility.equipment.units + facility.infrastructure.units;
    const functional =
      facility.equipment.functional + facility.infrastructure.functional;
    const notFunctional =
      facility.equipment.notFunctional + facility.infrastructure.notFunctional;
    const isSurveyed =
      facility.equipment.recorded + facility.infrastructure.recorded > 0;

    // Shared by all four facility cards: they come from one request.
    const state = {
      isLoading: isLoadingFacility,
      isUpdating: isSwitchingFacility,
    };

    return (
      <div>
        {scopeLine}
        <div className={ROW}>
          <KPIStatsCards
            title="Equipment in stock"
            value={facility.equipment.inStock}
            // The denominator is the catalogue's, which is usually cached
            // already — it shows while the facility's counts are on the way.
            subtitle={
              equipmentTypes !== undefined
                ? `of ${equipmentTypes} equipment types`
                : undefined
            }
            icon={<Package size={24} />}
            {...state}
          />
          <KPIStatsCards
            title="Infrastructure in stock"
            value={facility.infrastructure.inStock}
            subtitle={
              infrastructureTypes !== undefined
                ? `of ${infrastructureTypes} infrastructure types`
                : undefined
            }
            icon={<Building2 size={24} />}
            {...state}
          />
          <KPIStatsCards
            title="Total units"
            value={units}
            subtitle={isSurveyed ? "at this facility" : "Not surveyed yet"}
            icon={<Boxes size={24} />}
            {...state}
          />
          <KPIStatsCards
            title="Functional units"
            value={pct(functional, functional + notFunctional)}
            subtitle={
              isSurveyed
                ? `${notFunctional} non-functional`
                : "Not surveyed yet"
            }
            icon={<Activity size={24} />}
            {...state}
          />
        </div>
      </div>
    );
  }

  if (lgaName) {
    // Totals grow as each facility's inventory lands; dimmed until all have.
    const state = {
      isLoading: lga.isLoadingFacilities || (lga.total > 0 && lga.loaded === 0),
      isUpdating: !lga.isComplete,
    };
    return (
      <div>
        {scopeLine}
        <div className={ROW}>
          <KPIStatsCards
            title="Facilities surveyed"
            value={lga.surveyed}
            subtitle={`of ${lga.total} facilities in ${lgaName}`}
            icon={<ClipboardCheck size={24} />}
            {...state}
          />
          <KPIStatsCards
            title="Equipment types held"
            value={lga.equipmentTypesHeld}
            subtitle={
              equipmentTypes !== undefined
                ? `of ${equipmentTypes} equipment types`
                : undefined
            }
            icon={<Package size={24} />}
            {...state}
          />
          <KPIStatsCards
            title="Total units"
            value={lga.units.toLocaleString()}
            subtitle={`across ${lga.surveyed} surveyed facilities`}
            icon={<Boxes size={24} />}
            {...state}
          />
          <KPIStatsCards
            title="Functional units"
            value={pct(lga.functional, lga.functional + lga.notFunctional)}
            subtitle={`${lga.notFunctional.toLocaleString()} non-functional`}
            icon={<Activity size={24} />}
            {...state}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      {scopeLine}
      <div className={ROW}>
        <KPIStatsCards
          title="Equipment types"
          value={equipmentTypes ?? 0}
          subtitle="in the catalogue"
          icon={<Package size={24} />}
          isLoading={isLoadingCatalogue}
        />
        <KPIStatsCards
          title="Infrastructure types"
          value={infrastructureTypes ?? 0}
          subtitle="in the catalogue"
          icon={<Building2 size={24} />}
          isLoading={isLoadingCatalogue}
        />
        <KPIStatsCards
          title="Facilities surveyed"
          value={overall.surveyed}
          subtitle={
            facilities ? `of ${facilities.length} facilities` : "for inventory"
          }
          icon={<ClipboardCheck size={24} />}
          isLoading={isLoadingSummary}
        />
        <KPIStatsCards
          title="Functional units"
          value={pct(overall.functional, overall.counted)}
          subtitle={`${overall.functional.toLocaleString()} of ${overall.counted.toLocaleString()} units, all facilities`}
          icon={<Activity size={24} />}
          isLoading={isLoadingSummary}
        />
      </div>
    </div>
  );
}
