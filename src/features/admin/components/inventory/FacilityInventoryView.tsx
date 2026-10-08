"use client";

import React, { useMemo, useState } from "react";
import { AlertCircle, Building2, ClipboardX, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/features/admin/components/ui/button";
import InventoryItemModal from "@/features/admin/components/modals/InventoryItemModal";
import EditInventoryItemModal from "@/features/admin/components/modals/EditInventoryItemModal";
import DeleteConfirmationModal from "@/features/admin/components/modals/DeleteConfirmationModal";
import { useFacilityInventory } from "@/features/admin/hooks/useAdminStaff";
import {
  toInventoryItems,
  useEquipmentActions,
} from "@/features/admin/hooks/use-equipment-actions";
import type { InventoryType } from "@/services/admin.service";
import Tabs from "@/features/super-admin/components/ui/Tabs";
import { SearchableSelect } from "@/features/super-admin/components/ui/SearchableSelect";
import {
  useFacilityOptions,
  type FacilityOption,
} from "@/features/super-admin/hooks/useFacilityOptions";
import { useInventoryCatalogue } from "@/features/super-admin/hooks/useInventoryCatalogue";
import { FacilityConditionBars } from "./FacilityConditionBars";
import {
  InventoryTable,
  type InventoryRow,
  type StockTakeChange,
} from "./InventoryTable";

type TypeFilter = "all" | InventoryType;

const TYPE_SWITCH: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "equipment", label: "Equipment" },
  { value: "infrastructure", label: "Infrastructure" },
];

const TYPE_TABS = [
  { label: "Equipment", value: "equipment" },
  { label: "Infrastructure", value: "infrastructure" },
];

function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

interface FacilityInventoryViewProps {
  /**
   * The facility to show. Set for a facility admin, whose facility is fixed
   * by their login: the view opens on Equipment / Infrastructure tabs.
   * Omitted for a super admin: the view leads with a facility picker.
   */
  facilityId?: string;
}

/**
 * One facility's inventory: summary tiles, functional vs non-functional per
 * item as a chart, and the same rows as a table with edit, delete and stock
 * take. Shared by the facility admin's inventory page and the super admin's
 * By Facility tab, so the two can't drift apart.
 */
export default function FacilityInventoryView({
  facilityId: fixedFacilityId,
}: FacilityInventoryViewProps) {
  const isFacilityAdmin = !!fixedFacilityId;

  const [pickedFacilityId, setPickedFacilityId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>(
    isFacilityAdmin ? "equipment" : "all",
  );

  const facilityId = fixedFacilityId ?? pickedFacilityId;

  // The picker's list; not needed when the facility is fixed.
  const { data: facilities = [], isLoading: isLoadingFacilities } =
    useFacilityOptions(!isFacilityAdmin);
  const { data: catalogue } = useInventoryCatalogue();
  const {
    data: inventoryData,
    isLoading,
    isError,
    error,
  } = useFacilityInventory(facilityId ?? "");

  const actions = useEquipmentActions({ facilityId: facilityId ?? "" });

  const facilityName = isFacilityAdmin
    ? undefined
    : facilities.find((f) => f.facility_id === facilityId)?.facility_name;

  const allRows: InventoryRow[] = useMemo(
    () => [
      ...toInventoryItems(inventoryData?.inventory?.equipment, catalogue).map(
        (item) => ({ ...item, type: "equipment" as const }),
      ),
      ...toInventoryItems(
        inventoryData?.inventory?.infrastructure,
        catalogue,
      ).map((item) => ({ ...item, type: "infrastructure" as const })),
    ],
    [inventoryData, catalogue],
  );

  const typedRows = useMemo(
    () =>
      typeFilter === "all"
        ? allRows
        : allRows.filter((r) => r.type === typeFilter),
    [allRows, typeFilter],
  );

  const stats = useMemo(() => {
    const units = typedRows.reduce((s, r) => s + r.total, 0);
    const functional = typedRows.reduce((s, r) => s + r.functional, 0);
    const notFunctional = typedRows.reduce((s, r) => s + r.notFunctional, 0);
    const counted = functional + notFunctional;
    return {
      items: typedRows.filter((r) => r.total > 0).length,
      units,
      notFunctional,
      functionalShare:
        counted > 0 ? `${Math.round((functional / counted) * 100)}%` : "—",
    };
  }, [typedRows]);

  // A facility the survey never reached returns two empty maps — "we don't
  // know", not "this facility has nothing".
  const isSurveyed = allRows.length > 0;

  const recordedKeys = (type: InventoryType) =>
    allRows.filter((r) => r.type === type).map((r) => r.name);

  // The actions hook saves one type at a time; the "All" view can mix both.
  const handleSaveStockTake = async (changes: StockTakeChange[]) => {
    for (const type of ["equipment", "infrastructure"] as const) {
      const group = changes.filter((c) => c.item.type === type);
      if (group.length > 0) await actions.saveStockTake(type, group);
    }
  };

  const addButtons = (
    <div className="flex gap-2 sm:ml-auto">
      {(isFacilityAdmin
        ? [typeFilter as InventoryType]
        : (["equipment", "infrastructure"] as const)
      ).map((type) => (
        <Button
          key={type}
          size="sm"
          variant={isFacilityAdmin ? "default" : "outline"}
          disabled={!facilityId}
          onClick={() =>
            type === "equipment"
              ? actions.setIsEquipmentModalOpen(true)
              : actions.setIsInfrastructureModalOpen(true)
          }
          className="gap-1.5"
        >
          <Plus size={14} />
          {isFacilityAdmin ? "New " : ""}
          {type === "equipment" ? "Equipment" : "Infrastructure"}
        </Button>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <InventoryItemModal
        isOpen={actions.isEquipmentModalOpen}
        onClose={() => actions.setIsEquipmentModalOpen(false)}
        onSubmit={(data) => actions.handleAdd("equipment", data)}
        isSubmitting={actions.isAddingEquipment}
        type="equipment"
        excludeKeys={recordedKeys("equipment")}
      />
      <InventoryItemModal
        isOpen={actions.isInfrastructureModalOpen}
        onClose={() => actions.setIsInfrastructureModalOpen(false)}
        onSubmit={(data) => actions.handleAdd("infrastructure", data)}
        isSubmitting={actions.isAddingInfrastructure}
        type="infrastructure"
        excludeKeys={recordedKeys("infrastructure")}
      />
      <EditInventoryItemModal
        isOpen={actions.editType !== null}
        onClose={actions.closeEditModal}
        onSubmit={actions.handleUpdate}
        isSubmitting={actions.isUpdating}
        type={actions.editType ?? "equipment"}
        initialData={actions.selectedItem}
      />
      <DeleteConfirmationModal
        isOpen={actions.isDeleteModalOpen}
        onClose={actions.closeDeleteModal}
        onConfirm={actions.handleConfirmDelete}
        isDeleting={actions.isDeleting}
        itemName={
          actions.itemToDelete
            ? `${actions.itemToDelete.displayName}${facilityName ? ` — ${facilityName}` : ""}`
            : ""
        }
        itemType={actions.deleteType}
      />

      {/* Toolbar — every control in one row above the views. */}
      {isFacilityAdmin ? (
        <div className="flex flex-wrap items-center gap-3">
          <Tabs
            tabs={TYPE_TABS}
            activeTab={typeFilter}
            onTabChange={(value) => setTypeFilter(value as InventoryType)}
            size="lg"
          />
          {addButtons}
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <SearchableSelect<FacilityOption>
            items={facilities}
            value={pickedFacilityId}
            onChange={setPickedFacilityId}
            getItemId={(f) => f.facility_id}
            getItemLabel={(f) => f.facility_name}
            placeholder="Choose a facility"
            searchPlaceholder="Search facilities…"
            emptyText="No facilities found"
            isLoading={isLoadingFacilities}
            loadingText="Loading facilities…"
            icon={<Building2 size={15} className="text-primary" />}
            size="sm"
            className="w-full sm:w-80"
          />

          <div
            role="radiogroup"
            aria-label="Item type"
            className="flex rounded-lg bg-[#F6F8FA] p-1"
          >
            {TYPE_SWITCH.map((t) => (
              <button
                key={t.value}
                type="button"
                role="radio"
                aria-checked={typeFilter === t.value}
                onClick={() => setTypeFilter(t.value)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  typeFilter === t.value
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-[#868C98] hover:text-slate-700",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {addButtons}
        </div>
      )}

      {!facilityId ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 px-6 py-16 text-center">
          <Building2 size={28} className="text-slate-300" />
          <p className="text-sm font-medium text-slate-700">
            Choose a facility to see its inventory
          </p>
          <p className="max-w-md text-xs text-slate-500">
            Only 28 facilities have been surveyed so far — in Abua-Odual,
            Akuku-Toru, Degema, Ikwerre, Emohua and Etche.
          </p>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center gap-3 py-16 text-sm text-slate-600">
          <Loader2 className="text-primary h-6 w-6 animate-spin" />
          Loading inventory…
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <p className="text-sm font-medium text-slate-800">
            Failed to load inventory
          </p>
          <p className="text-xs text-slate-500">{error?.message}</p>
        </div>
      ) : !isSurveyed ? (
        <div className="flex items-start gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-4">
          <ClipboardX size={20} className="mt-0.5 shrink-0 text-slate-400" />
          <div>
            <p className="text-sm font-semibold text-slate-800">
              No inventory survey has been done for this facility
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Nothing has been recorded — this doesn&apos;t mean the facility
              has nothing. Use the button above to record items as you count
              them.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile
              label="Items held"
              value={stats.items}
              hint={`of ${typedRows.length} recorded`}
            />
            <StatTile label="Total units" value={stats.units} />
            <StatTile
              label="Functional"
              value={stats.functionalShare}
              hint="of units with a recorded condition"
            />
            <StatTile label="Non-functional units" value={stats.notFunctional} />
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <h3 className="text-base font-semibold text-slate-800">
              Condition by item
            </h3>
            <p className="mt-0.5 mb-4 text-xs text-slate-500">
              {facilityName ? `${facilityName} · ` : ""}sorted by total held
            </p>
            <FacilityConditionBars
              key={`${facilityId}-${typeFilter}`}
              data={typedRows.map((r) => ({
                key: `${r.type}:${r.name}`,
                name: r.displayName,
                functional: r.functional,
                notFunctional: r.notFunctional,
                total: r.total,
              }))}
            />
          </section>

          {/* Keyed so a tab or facility change also leaves stock-take mode. */}
          <InventoryTable
            key={`${facilityId}-${typeFilter}`}
            rows={typedRows}
            facilityName={facilityName}
            onEdit={(row) => actions.handleEdit(row.type, row)}
            onDelete={(row) => actions.handleDeleteClick(row, row.type)}
            onSaveStockTake={handleSaveStockTake}
          />
        </>
      )}
    </div>
  );
}
