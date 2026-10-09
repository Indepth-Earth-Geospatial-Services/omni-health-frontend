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
import {
  useInventorySummary,
  useLgaInventorySummary,
} from "../../hooks/useInventoryCatalogue";
import { useLgaList } from "../../hooks/useLgas";
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

  // With the LGA's real id (GET /admin/lgas), its totals come from one
  // /summary?lga_id= request. Without it — the endpoint is not deployed
  // everywhere yet — they are added up facility by facility instead.
  const { data: lgaList } = useLgaList();
  const lgaEntry = lgaName
    ? lgaList?.find((l) => l.lga_name === lgaName)
    : undefined;
  const {
    data: lgaSummary,
    isLoading: isLoadingLgaSummary,
    isError: lgaSummaryFailed,
  } = useLgaInventorySummary(lgaEntry?.lga_id ?? null);
  const hasLgaSummary = !!lgaEntry && !lgaSummaryFailed;

  const lgaStats = useMemo(() => {
    if (hasLgaSummary) {
      const items = lgaSummary ?? [];
      const functional = items.reduce((s, i) => s + i.total_functional, 0);
      return {
        isLoading: isLoadingLgaSummary,
        isUpdating: false,
        progress: null as string | null,
        surveyed: Math.max(0, ...items.map((i) => i.facilities_listing_item)),
        total: lgaEntry?.facility_count ?? lga.total,
        equipmentTypesHeld: items.filter(
          (i) => i.type === "equipment" && i.facilities_with_item > 0,
        ).length,
        units: items.reduce((s, i) => s + i.total_quantity, 0),
        functional,
        notFunctional: items.reduce((s, i) => s + i.total_not_functional, 0),
      };
    }
    return {
      isLoading: lga.isLoadingFacilities || (lga.total > 0 && lga.loaded === 0),
      isUpdating: !lga.isComplete,
      progress: lga.isComplete
        ? null
        : lga.isLoadingFacilities
          ? "loading facilities…"
          : `loading ${lga.loaded} of ${lga.total} facilities…`,
      surveyed: lga.surveyed,
      total: lga.total,
      equipmentTypesHeld: lga.equipmentTypesHeld,
      units: lga.units,
      functional: lga.functional,
      notFunctional: lga.notFunctional,
    };
  }, [hasLgaSummary, lgaSummary, isLoadingLgaSummary, lgaEntry, lga]);
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
      {!facilityId && lgaName && lgaStats.progress && (
        <span aria-live="polite">
          {" · "}
          {lgaStats.progress}
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
    // One summary request, or totals growing facility by facility (dimmed
    // until all have landed) — see lgaStats.
    const state = {
      isLoading: lgaStats.isLoading,
      isUpdating: lgaStats.isUpdating,
    };
    return (
      <div>
        {scopeLine}
        <div className={ROW}>
          <KPIStatsCards
            title="Facilities surveyed"
            value={lgaStats.surveyed}
            subtitle={`of ${lgaStats.total} facilities in ${lgaName}`}
            icon={<ClipboardCheck size={24} />}
            {...state}
          />
          <KPIStatsCards
            title="Equipment types held"
            value={lgaStats.equipmentTypesHeld}
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
            value={lgaStats.units.toLocaleString()}
            subtitle={`across ${lgaStats.surveyed} surveyed facilities`}
            icon={<Boxes size={24} />}
            {...state}
          />
          <KPIStatsCards
            title="Functional units"
            value={pct(
              lgaStats.functional,
              lgaStats.functional + lgaStats.notFunctional,
            )}
            subtitle={`${lgaStats.notFunctional.toLocaleString()} non-functional`}
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
