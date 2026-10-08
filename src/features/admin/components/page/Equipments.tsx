"use client";

import { useState } from "react";
import {
  Activity,
  Loader2,
  AlertCircle,
  Hospital,
  ClipboardX,
} from "lucide-react";
import InventoryItemModal from "../modals/InventoryItemModal";
import EditInventoryItemModal from "../modals/EditInventoryItemModal";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import { InventoryChecklist } from "../ui/InventoryChecklist";
import { useFacilityInventory } from "@/features/admin/hooks/useAdminStaff";
import {
  useEquipmentActions,
  toInventoryItems,
} from "@/features/admin/hooks/use-equipment-actions";
import { useInventoryCatalogue } from "@/features/super-admin/hooks/useInventoryCatalogue";

interface EquipmentsPageProps {
  facilityId: string;
}

export default function EquipmentsPage({ facilityId }: EquipmentsPageProps) {
  const [isEquipmentOpen, setIsEquipmentOpen] = useState(true);
  const [isFacilityOpen, setIsFacilityOpen] = useState(true);

  // Fetch inventory data
  const {
    data: inventoryData,
    isLoading,
    isError,
    error,
  } = useFacilityInventory(facilityId);

  // Display names; rows fall back to a formatted key until it loads.
  const { data: catalogue } = useInventoryCatalogue();

  // Equipment actions hook
  const actions = useEquipmentActions({ facilityId });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-sm text-slate-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Failed to load inventory
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {error?.message ||
                "An error occurred while fetching inventory data"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const equipmentItems = toInventoryItems(
    inventoryData?.inventory?.equipment,
    catalogue,
  );
  const infrastructureItems = toInventoryItems(
    inventoryData?.inventory?.infrastructure,
    catalogue,
  );

  // A facility the survey never reached returns two empty maps. That is "we
  // don't know", not "this facility has nothing", so it gets its own state.
  const isSurveyed =
    equipmentItems.length > 0 || infrastructureItems.length > 0;

  return (
    <>
      {/* Add Equipment Modal */}
      <InventoryItemModal
        isOpen={actions.isEquipmentModalOpen}
        onClose={() => actions.setIsEquipmentModalOpen(false)}
        onSubmit={(data) => actions.handleAdd("equipment", data)}
        isSubmitting={actions.isAddingEquipment}
        type="equipment"
        excludeKeys={equipmentItems.map((i) => i.name)}
      />

      {/* Add Infrastructure Modal */}
      <InventoryItemModal
        isOpen={actions.isInfrastructureModalOpen}
        onClose={() => actions.setIsInfrastructureModalOpen(false)}
        onSubmit={(data) => actions.handleAdd("infrastructure", data)}
        isSubmitting={actions.isAddingInfrastructure}
        type="infrastructure"
        excludeKeys={infrastructureItems.map((i) => i.name)}
      />

      {/* Edit Modal — one for both types */}
      <EditInventoryItemModal
        isOpen={actions.editType !== null}
        onClose={actions.closeEditModal}
        onSubmit={actions.handleUpdate}
        isSubmitting={actions.isUpdating}
        type={actions.editType ?? "equipment"}
        initialData={actions.selectedItem}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={actions.isDeleteModalOpen}
        onClose={actions.closeDeleteModal}
        onConfirm={actions.handleConfirmDelete}
        isDeleting={actions.isDeleting}
        itemName={actions.itemToDelete?.displayName || ""}
        itemType={actions.deleteType}
      />

      {/* Stacked rather than a 50/50 grid: equipment runs to ~78 items while
          infrastructure is at most 6, so side-by-side wasted half the row. */}
      <div className="flex w-full flex-col gap-6">
        {!isSurveyed && (
          <div className="flex items-start gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-4">
            <ClipboardX size={20} className="mt-0.5 shrink-0 text-slate-400" />
            <div>
              <p className="text-sm font-semibold text-slate-800">
                No inventory survey has been done for this facility
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Nothing has been recorded yet — this doesn&apos;t mean the
                facility has no equipment. Use the buttons below to record
                items as you count them.
              </p>
            </div>
          </div>
        )}

        {/* Medical Equipment */}
        <InventoryChecklist
          title="Medical Equipment"
          items={equipmentItems}
          isOpen={isEquipmentOpen}
          onToggle={() => setIsEquipmentOpen(!isEquipmentOpen)}
          onAdd={() => actions.setIsEquipmentModalOpen(true)}
          onEdit={(item) => actions.handleEdit("equipment", item)}
          onDelete={(item) => actions.handleDeleteClick(item, "equipment")}
          onSaveStockTake={(changes) =>
            actions.saveStockTake("equipment", changes)
          }
          isAdding={actions.isAddingEquipment}
          addButtonLabel="New Equipment"
          buttonClassName="shrink-0 text-sm sm:text-lg"
          icon={Activity}
          emptyMessage={
            isSurveyed
              ? "No equipment recorded. Add items from the catalogue."
              : "Not surveyed yet."
          }
        />

        {/* Facility Infrastructure */}
        <InventoryChecklist
          title="Facility Infrastructure"
          items={infrastructureItems}
          isOpen={isFacilityOpen}
          onToggle={() => setIsFacilityOpen(!isFacilityOpen)}
          onAdd={() => actions.setIsInfrastructureModalOpen(true)}
          onEdit={(item) => actions.handleEdit("infrastructure", item)}
          onDelete={(item) => actions.handleDeleteClick(item, "infrastructure")}
          onSaveStockTake={(changes) =>
            actions.saveStockTake("infrastructure", changes)
          }
          isAdding={actions.isAddingInfrastructure}
          addButtonLabel="New Infrastructure"
          buttonClassName="shrink-0 text-sm sm:text-lg"
          icon={Hospital}
          emptyMessage={
            isSurveyed
              ? "No infrastructure recorded. Add items from the catalogue."
              : "Not surveyed yet."
          }
        />
      </div>
    </>
  );
}
