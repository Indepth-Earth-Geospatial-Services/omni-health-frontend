"use client";

import { useState } from "react";
import { Activity, Loader2, AlertCircle, Hospital } from "lucide-react";
import InventoryItemModal from "../../feature/InventoryItemModal";
import EditEquipmentModal from "../../feature/EditEquipmentModal";
import EditInfrastructureModal from "../../feature/EditInfrastructureModal";
import DeleteConfirmationModal from "../../feature/DeleteConfirmationModal";
import { InventoryChecklist } from "../ui/InventoryChecklist";
import { useFacilityInventory } from "@/features/admin/hooks/useAdminStaff";
import {
  useEquipmentActions,
  convertInventoryToArray,
} from "@/features/admin/hooks/use-equipment-actions";

interface EquipmentsPageProps {
  facilityId: string;
}

export default function EquipmentsPage({ facilityId }: EquipmentsPageProps) {
  const [isEquipmentOpen, setIsEquipmentOpen] = useState(true);
  const [isFacilityOpen, setIsFacilityOpen] = useState(true);

  // Fetch inventory data
  const { data: inventoryData, isLoading, isError, error } = useFacilityInventory(facilityId);

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
              {error?.message || "An error occurred while fetching inventory data"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Convert inventory objects to arrays
  const equipmentItems = convertInventoryToArray(inventoryData?.inventory?.equipment);
  const infrastructureItems = convertInventoryToArray(inventoryData?.inventory?.infrastructure);

  return (
    <>
      {/* Add Equipment Modal */}
      <InventoryItemModal
        isOpen={actions.isEquipmentModalOpen}
        onClose={() => actions.setIsEquipmentModalOpen(false)}
        onSubmit={actions.handleAddEquipment}
        isSubmitting={actions.isAddingEquipment}
        type="equipment"
      />

      {/* Add Infrastructure Modal */}
      <InventoryItemModal
        isOpen={actions.isInfrastructureModalOpen}
        onClose={() => actions.setIsInfrastructureModalOpen(false)}
        onSubmit={actions.handleAddInfrastructure}
        isSubmitting={actions.isAddingInfrastructure}
        type="infrastructure"
      />

      {/* Edit Equipment Modal */}
      <EditEquipmentModal
        isOpen={actions.isEditEquipmentModalOpen}
        onClose={actions.closeEditEquipmentModal}
        onSubmit={actions.handleUpdateEquipment}
        isSubmitting={actions.isUpdatingEquipment}
        initialData={actions.selectedItem}
      />

      {/* Edit Infrastructure Modal */}
      <EditInfrastructureModal
        isOpen={actions.isEditInfrastructureModalOpen}
        onClose={actions.closeEditInfrastructureModal}
        onSubmit={actions.handleUpdateInfrastructure}
        isSubmitting={actions.isUpdatingInfrastructure}
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

      {/* Stacked rather than a 50/50 grid: equipment runs to ~84 items while
          infrastructure is usually empty, so side-by-side wasted half the row. */}
      <div className="flex w-full flex-col gap-6">
        {/* Medical Equipment */}
        <InventoryChecklist
          title="Medical Equipment"
          items={equipmentItems}
          isOpen={isEquipmentOpen}
          onToggle={() => setIsEquipmentOpen(!isEquipmentOpen)}
          onAdd={() => actions.setIsEquipmentModalOpen(true)}
          onEdit={actions.handleEditEquipment}
          onDelete={(item) => actions.handleDeleteClick(item, "equipment")}
          onSetQuantity={(name, qty) =>
            actions.setItemQuantity("equipment", name, qty)
          }
          onSaveStockTake={(changes) =>
            actions.saveStockTake("equipment", changes)
          }
          isAdding={actions.isAddingEquipment}
          addButtonLabel="New Equipment"
          icon={Activity}
          emptyMessage="No equipment tracked yet. Add your first equipment item."
        />

        {/* Facility Infrastructure */}
        <InventoryChecklist
          title="Facility Infrastructure"
          items={infrastructureItems}
          isOpen={isFacilityOpen}
          onToggle={() => setIsFacilityOpen(!isFacilityOpen)}
          onAdd={() => actions.setIsInfrastructureModalOpen(true)}
          onEdit={actions.handleEditInfrastructure}
          onDelete={(item) => actions.handleDeleteClick(item, "infrastructure")}
          onSetQuantity={(name, qty) =>
            actions.setItemQuantity("infrastructure", name, qty)
          }
          onSaveStockTake={(changes) =>
            actions.saveStockTake("infrastructure", changes)
          }
          isAdding={actions.isAddingInfrastructure}
          addButtonLabel="New Infrastructure"
          icon={Hospital}
          emptyMessage="No infrastructure tracked yet. Add your first item."
        />
      </div>
    </>
  );
}
