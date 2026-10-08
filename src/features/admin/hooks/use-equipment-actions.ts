"use client";

import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  useAddEquipment,
  useAddInfrastructure,
  useDeleteEquipment,
  useDeleteInfrastructure,
  useUpdateEquipment,
  useUpdateInfrastructure,
} from "@/features/admin/hooks/useAdminStaff";
import type {
  InventoryCounts,
  InventoryType,
  InventoryWriteRequest,
} from "@/services/admin.service";
import {
  itemDisplayName,
  type InventoryCatalogue,
} from "@/features/super-admin/hooks/useInventoryCatalogue";

export interface InventoryItem {
  /** Catalogue key — what the API reads and writes. */
  name: string;
  displayName: string;
  total: number;
  functional: number;
  notFunctional: number;
}

/** The two conditions a person actually counts. */
export interface ConditionCounts {
  functional: number;
  notFunctional: number;
}

interface UseEquipmentActionsOptions {
  facilityId: string;
}

/**
 * Write body for one item. `total` is left to default to the sum, except when
 * the existing record holds more than its two conditions account for — that
 * surplus is what the survey recorded, so it is carried over rather than
 * silently dropped by an edit.
 */
export function toWriteRequest(
  itemName: string,
  next: ConditionCounts,
  previous?: InventoryItem | null,
): InventoryWriteRequest {
  const surplus = previous
    ? Math.max(0, previous.total - previous.functional - previous.notFunctional)
    : 0;
  return {
    item_name: itemName,
    functional: next.functional,
    not_functional: next.notFunctional,
    ...(surplus > 0 && {
      total: next.functional + next.notFunctional + surplus,
    }),
  };
}

/** The API client rejects with an ApiError whose message is the backend's
 *  `detail` — for a 409 that names the endpoint listing valid items. */
const errorMessage = (error: unknown, fallback: string) =>
  (error instanceof Error && error.message) || fallback;

export function useEquipmentActions({ facilityId }: UseEquipmentActionsOptions) {
  // Modal states
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [isInfrastructureModalOpen, setIsInfrastructureModalOpen] = useState(false);
  const [editType, setEditType] = useState<InventoryType | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Selected item states
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [deleteType, setDeleteType] = useState<InventoryType>("equipment");
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);

  // Mutations
  const addEquipmentMutation = useAddEquipment(facilityId);
  const addInfrastructureMutation = useAddInfrastructure(facilityId);
  const deleteEquipmentMutation = useDeleteEquipment(facilityId);
  const deleteInfrastructureMutation = useDeleteInfrastructure(facilityId);
  const updateEquipmentMutation = useUpdateEquipment(facilityId);
  const updateInfrastructureMutation = useUpdateInfrastructure(facilityId);

  // Add handlers — `name` is a catalogue key picked from the list, never free
  // text, so the 409 path is only reachable through a stale catalogue.
  const handleAdd = useCallback(
    async (
      type: InventoryType,
      data: { name: string; displayName: string } & ConditionCounts,
    ) => {
      const mutation =
        type === "equipment" ? addEquipmentMutation : addInfrastructureMutation;
      try {
        await mutation.mutateAsync(toWriteRequest(data.name, data));
        toast.success(`${data.displayName} recorded.`, { duration: 4000 });
        setTimeout(
          () =>
            type === "equipment"
              ? setIsEquipmentModalOpen(false)
              : setIsInfrastructureModalOpen(false),
          300,
        );
      } catch (error: unknown) {
        toast.error(errorMessage(error, `Failed to add ${type}. Please try again.`), {
          duration: 6000,
        });
      }
    },
    [addEquipmentMutation, addInfrastructureMutation],
  );

  // Edit handlers
  const handleEdit = useCallback((type: InventoryType, item: InventoryItem) => {
    setSelectedItem(item);
    setEditType(type);
  }, []);

  const handleUpdate = useCallback(
    async (counts: ConditionCounts) => {
      if (!selectedItem || !editType) return;
      try {
        await (editType === "equipment"
          ? updateEquipmentMutation
          : updateInfrastructureMutation).mutateAsync(
          toWriteRequest(selectedItem.name, counts, selectedItem),
        );
        toast.success(`${selectedItem.displayName} updated.`, { duration: 4000 });
        setTimeout(() => {
          setEditType(null);
          setSelectedItem(null);
        }, 300);
      } catch (error: unknown) {
        toast.error(
          errorMessage(error, `Failed to update ${editType}. Please try again.`),
          { duration: 6000 },
        );
      }
    },
    [selectedItem, editType, updateEquipmentMutation, updateInfrastructureMutation],
  );

  // Delete handlers
  const handleDeleteClick = useCallback((item: InventoryItem, type: InventoryType) => {
    setItemToDelete(item);
    setDeleteType(type);
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete) return;

    try {
      if (deleteType === "equipment") {
        await deleteEquipmentMutation.mutateAsync(itemToDelete.name);
      } else {
        await deleteInfrastructureMutation.mutateAsync(itemToDelete.name);
      }
      toast.success(`${itemToDelete.displayName} deleted successfully!`, { duration: 4000 });
      setTimeout(() => {
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
      }, 300);
    } catch (error: unknown) {
      toast.error(
        errorMessage(error, `Failed to delete ${deleteType}. Please try again.`),
        { duration: 5000 },
      );
    }
  }, [itemToDelete, deleteType, deleteEquipmentMutation, deleteInfrastructureMutation]);

  /**
   * Save a stock take. Only changed rows are sent, so a typical audit is a
   * handful of requests rather than one per tracked item. Sequential on
   * purpose — these are writes, and ordering keeps the failure case legible.
   */
  const saveStockTake = useCallback(
    async (
      type: InventoryType,
      changes: ({ item: InventoryItem } & ConditionCounts)[],
    ) => {
      if (changes.length === 0) return;
      const mutation = (type === "equipment"
          ? updateEquipmentMutation
          : updateInfrastructureMutation);

      let saved = 0;
      try {
        for (const { item, ...counts } of changes) {
          await mutation.mutateAsync(toWriteRequest(item.name, counts, item));
          saved++;
        }
        toast.success(
          `Stock take saved — ${saved} item${saved === 1 ? "" : "s"} updated.`,
          { duration: 4000 },
        );
      } catch (error: unknown) {
        toast.error(
          saved > 0
            ? `Saved ${saved} of ${changes.length} before failing: ${errorMessage(error, "please retry the rest.")}`
            : errorMessage(error, "Could not save the stock take. Please try again."),
          { duration: 6000 },
        );
        throw new Error("stock-take-failed");
      }
    },
    [updateEquipmentMutation, updateInfrastructureMutation],
  );

  // Close handlers
  const closeEditModal = useCallback(() => {
    setEditType(null);
    setSelectedItem(null);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  }, []);

  return {
    // Modal states
    isEquipmentModalOpen,
    isInfrastructureModalOpen,
    editType,
    isDeleteModalOpen,
    setIsEquipmentModalOpen,
    setIsInfrastructureModalOpen,

    // Selected items
    selectedItem,
    itemToDelete,
    deleteType,

    // Loading states
    isAddingEquipment: addEquipmentMutation.isPending,
    isAddingInfrastructure: addInfrastructureMutation.isPending,
    isUpdating:
      updateEquipmentMutation.isPending || updateInfrastructureMutation.isPending,
    isDeleting: deleteEquipmentMutation.isPending || deleteInfrastructureMutation.isPending,

    // Handlers
    handleAdd,
    handleEdit,
    handleUpdate,
    handleDeleteClick,
    handleConfirmDelete,
    saveStockTake,
    closeEditModal,
    closeDeleteModal,
  };
}

/**
 * Inventory map → rows. Only keys present in the response become rows: an
 * absent key means the survey recorded nothing for that item, which is not
 * the same as recording none, so it is not rendered as a zero.
 */
export function toInventoryItems(
  counts: InventoryCounts | undefined,
  catalogue?: InventoryCatalogue,
): InventoryItem[] {
  return Object.entries(counts ?? {}).map(([name, count]) => ({
    name,
    displayName: itemDisplayName(catalogue, name),
    total: count.total,
    functional: count.functional,
    notFunctional: count.not_functional,
  }));
}
