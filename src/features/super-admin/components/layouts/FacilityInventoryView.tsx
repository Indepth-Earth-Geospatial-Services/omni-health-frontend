"use client";

import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  Building2,
  ClipboardX,
  Hospital,
  Loader2,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/features/admin/components/ui/button";
import InventoryItemModal from "@/features/admin/components/modals/InventoryItemModal";
import EditInventoryItemModal from "@/features/admin/components/modals/EditInventoryItemModal";
import DeleteConfirmationModal from "@/features/admin/components/modals/DeleteConfirmationModal";
import { useFacilityInventory } from "@/features/admin/hooks/useAdminStaff";
import {
  toInventoryItems,
  useEquipmentActions,
  type InventoryItem,
} from "@/features/admin/hooks/use-equipment-actions";
import type { InventoryType } from "@/services/admin.service";
import { useFacilityOptions, type FacilityOption } from "../../hooks/useFacilityOptions";
import { useInventoryCatalogue } from "../../hooks/useInventoryCatalogue";
import { SearchableSelect } from "../ui/SearchableSelect";
import { FacilityConditionBars } from "../charts/FacilityConditionBars";

type TypeFilter = "all" | InventoryType;

type Row = InventoryItem & { type: InventoryType };

const TYPE_FILTERS: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "equipment", label: "Equipment" },
  { value: "infrastructure", label: "Infrastructure" },
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

/**
 * One facility's inventory for the super admin: pick a facility, see its
 * counts as a chart and a table, and add, edit or remove items — the same
 * writes a facility admin makes, with the facility chosen here instead of
 * fixed by the login.
 */
export default function FacilityInventoryView() {
  const [facilityId, setFacilityId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [search, setSearch] = useState("");

  const { data: facilities = [], isLoading: isLoadingFacilities } =
    useFacilityOptions();
  const { data: catalogue } = useInventoryCatalogue();
  const {
    data: inventoryData,
    isLoading,
    isError,
    error,
  } = useFacilityInventory(facilityId ?? "");

  const actions = useEquipmentActions({ facilityId: facilityId ?? "" });

  const facility = facilities.find((f) => f.facility_id === facilityId);

  const allRows: Row[] = useMemo(
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

  const tableRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return typedRows
      .filter(
        (r) =>
          !q ||
          r.displayName.toLowerCase().includes(q) ||
          r.name.includes(q),
      )
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [typedRows, search]);

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

  const isSurveyed = allRows.length > 0;

  const recordedKeys = (type: InventoryType) =>
    allRows.filter((r) => r.type === type).map((r) => r.name);

  return (
    <div className="flex flex-col gap-4">
      {/* Modals — the facility admin's own, pointed at the chosen facility. */}
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
            ? `${actions.itemToDelete.displayName}${facility ? ` — ${facility.facility_name}` : ""}`
            : ""
        }
        itemType={actions.deleteType}
      />

      {/* Toolbar — every control in one row above the views. */}
      <div className="flex flex-wrap items-center gap-3">
        <SearchableSelect<FacilityOption>
          items={facilities}
          value={facilityId}
          onChange={setFacilityId}
          getItemId={(f) => f.facility_id}
          getItemLabel={(f) => f.facility_name}
          placeholder="Choose a facility"
          searchPlaceholder="Search 342 facilities…"
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
          {TYPE_FILTERS.map((t) => (
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

        <div className="flex gap-2 sm:ml-auto">
          <Button
            size="sm"
            variant="outline"
            disabled={!facilityId}
            onClick={() => actions.setIsEquipmentModalOpen(true)}
            className="gap-1.5"
          >
            <Plus size={14} />
            Equipment
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={!facilityId}
            onClick={() => actions.setIsInfrastructureModalOpen(true)}
            className="gap-1.5"
          >
            <Plus size={14} />
            Infrastructure
          </Button>
        </div>
      </div>

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
            Failed to load this facility&apos;s inventory
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
              has nothing. Use the buttons above to record items.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Summary */}
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

          {/* Chart */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <h3 className="text-base font-semibold text-slate-800">
              Condition by item
            </h3>
            <p className="mt-0.5 mb-4 text-xs text-slate-500">
              {facility?.facility_name} · sorted by total held
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

          {/* Table — also the chart's accessible table view. */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5">
              <h3 className="text-base font-semibold text-slate-800">
                Items{" "}
                <span className="text-sm font-normal text-slate-400">
                  {tableRows.length}
                </span>
              </h3>
              <div className="relative w-full sm:w-64">
                <Search
                  size={14}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search items…"
                  className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-slate-200 py-1.5 pr-3 pl-8 text-sm focus:ring-2 focus:outline-none"
                />
              </div>
            </div>

            <div className="max-h-[32rem] overflow-auto">
              <table className="w-full min-w-[52rem] text-sm">
                <thead className="sticky top-0 bg-slate-50 text-left text-xs font-medium text-slate-500">
                  <tr>
                    <th className="px-4 py-2.5 sm:px-5">Item</th>
                    <th className="px-4 py-2.5">Item ID</th>
                    <th className="px-4 py-2.5">Facility</th>
                    <th className="px-4 py-2.5 text-right">Total</th>
                    <th className="px-4 py-2.5 text-right">Functional</th>
                    <th className="px-4 py-2.5 text-right">Non-functional</th>
                    <th className="px-4 py-2.5 text-right sm:px-5">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tableRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-10 text-center text-sm text-slate-400"
                      >
                        Nothing matches &ldquo;{search}&rdquo;
                      </td>
                    </tr>
                  ) : (
                    tableRows.map((r) => {
                      const TypeIcon = r.type === "equipment" ? Package : Hospital;
                      return (
                        <tr key={`${r.type}:${r.name}`} className="group hover:bg-slate-50">
                          <td className="max-w-[18rem] px-4 py-2.5 sm:px-5">
                            <div className="flex items-center gap-2">
                              <TypeIcon
                                size={14}
                                className="shrink-0 text-slate-400"
                                aria-label={r.type}
                              />
                              <span
                                className="truncate text-slate-800"
                                title={r.displayName}
                              >
                                {r.displayName}
                              </span>
                            </div>
                          </td>
                          <td className="max-w-[14rem] px-4 py-2.5">
                            <code
                              className="block truncate text-xs text-slate-500"
                              title={r.name}
                            >
                              {r.name}
                            </code>
                          </td>
                          <td className="max-w-[12rem] px-4 py-2.5">
                            <span
                              className="block truncate text-slate-600"
                              title={facility?.facility_name}
                            >
                              {facility?.facility_name}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-right font-semibold text-slate-800 tabular-nums">
                            {r.total}
                          </td>
                          <td className="px-4 py-2.5 text-right text-slate-700 tabular-nums">
                            {r.functional}
                          </td>
                          <td className="px-4 py-2.5 text-right text-slate-700 tabular-nums">
                            {r.notFunctional}
                          </td>
                          <td className="px-4 py-2.5 sm:px-5">
                            <div className="flex justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                              <button
                                type="button"
                                onClick={() => actions.handleEdit(r.type, r)}
                                aria-label={`Edit ${r.displayName}`}
                                className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                type="button"
                                onClick={() => actions.handleDeleteClick(r, r.type)}
                                aria-label={`Delete ${r.displayName}`}
                                className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
