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

export interface InventoryItem {
  name: string;
  displayName: string;
  quantity: string;
}

type InventoryType = "equipment" | "infrastructure";

interface UseEquipmentActionsOptions {
  facilityId: string;
}

export function useEquipmentActions({ facilityId }: UseEquipmentActionsOptions) {
  // Modal states
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [isInfrastructureModalOpen, setIsInfrastructureModalOpen] = useState(false);
  const [isEditEquipmentModalOpen, setIsEditEquipmentModalOpen] = useState(false);
  const [isEditInfrastructureModalOpen, setIsEditInfrastructureModalOpen] = useState(false);
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

  // Add handlers
  const handleAddEquipment = useCallback(
    async (data: { name: string; quantity: string }) => {
      try {
        await addEquipmentMutation.mutateAsync({
          item_name: data.name,
          quantity: parseInt(data.quantity, 10),
        });
        toast.success(`${data.name} added successfully!`, { duration: 4000 });
        setTimeout(() => setIsEquipmentModalOpen(false), 300);
      } catch (error: unknown) {
        const errorMessage =
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to add equipment. Please try again.";
        toast.error(errorMessage, { duration: 5000 });
      }
    },
    [addEquipmentMutation]
  );

  const handleAddInfrastructure = useCallback(
    async (data: { name: string; quantity: string }) => {
      try {
        await addInfrastructureMutation.mutateAsync({
          item_name: data.name,
          quantity: parseInt(data.quantity, 10),
        });
        toast.success(`${data.name} added successfully!`, { duration: 4000 });
        setTimeout(() => setIsInfrastructureModalOpen(false), 300);
      } catch (error: unknown) {
        const errorMessage =
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to add infrastructure. Please try again.";
        toast.error(errorMessage, { duration: 5000 });
      }
    },
    [addInfrastructureMutation]
  );

  // Edit handlers
  const handleEditEquipment = useCallback((item: InventoryItem) => {
    setSelectedItem(item);
    setIsEditEquipmentModalOpen(true);
  }, []);

  const handleEditInfrastructure = useCallback((item: InventoryItem) => {
    setSelectedItem(item);
    setIsEditInfrastructureModalOpen(true);
  }, []);

  const handleUpdateEquipment = useCallback(
    async (data: { name: string; quantity: string }) => {
      try {
        await updateEquipmentMutation.mutateAsync({
          item_name: data.name,
          quantity: parseInt(data.quantity, 10),
        });
        toast.success(`${data.name} updated successfully!`, { duration: 4000 });
        setTimeout(() => {
          setIsEditEquipmentModalOpen(false);
          setSelectedItem(null);
        }, 300);
      } catch (error: unknown) {
        const errorMessage =
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to update equipment. Please try again.";
        toast.error(errorMessage, { duration: 5000 });
      }
    },
    [updateEquipmentMutation]
  );

  const handleUpdateInfrastructure = useCallback(
    async (data: { name: string; quantity: string }) => {
      try {
        await updateInfrastructureMutation.mutateAsync({
          item_name: data.name,
          quantity: parseInt(data.quantity, 10),
        });
        toast.success(`${data.name} updated successfully!`, { duration: 4000 });
        setTimeout(() => {
          setIsEditInfrastructureModalOpen(false);
          setSelectedItem(null);
        }, 300);
      } catch (error: unknown) {
        const errorMessage =
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to update infrastructure. Please try again.";
        toast.error(errorMessage, { duration: 5000 });
      }
    },
    [updateInfrastructureMutation]
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
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        `Failed to delete ${deleteType}. Please try again.`;
      toast.error(errorMessage, { duration: 5000 });
    }
  }, [itemToDelete, deleteType, deleteEquipmentMutation, deleteInfrastructureMutation]);

  // Close handlers
  const closeEditEquipmentModal = useCallback(() => {
    setIsEditEquipmentModalOpen(false);
    setSelectedItem(null);
  }, []);

  const closeEditInfrastructureModal = useCallback(() => {
    setIsEditInfrastructureModalOpen(false);
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
    isEditEquipmentModalOpen,
    isEditInfrastructureModalOpen,
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
    isUpdatingEquipment: updateEquipmentMutation.isPending,
    isUpdatingInfrastructure: updateInfrastructureMutation.isPending,
    isDeleting: deleteEquipmentMutation.isPending || deleteInfrastructureMutation.isPending,

    // Handlers
    handleAddEquipment,
    handleAddInfrastructure,
    handleEditEquipment,
    handleEditInfrastructure,
    handleUpdateEquipment,
    handleUpdateInfrastructure,
    handleDeleteClick,
    handleConfirmDelete,
    closeEditEquipmentModal,
    closeEditInfrastructureModal,
    closeDeleteModal,
  };
}

// Helper to convert inventory object to array
export function convertInventoryToArray(
  inventory: Record<string, number> | undefined
): InventoryItem[] {
  return Object.entries(inventory || {}).map(([name, quantity]) => ({
    name,
    displayName: name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    quantity: quantity.toString(),
  }));
}
