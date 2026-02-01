import { useState } from "react";
import { toast } from "sonner";
import {
  useAddEquipment,
  useDeleteEquipment,
  useUpdateEquipment,
} from "@/features/admin/hooks/useAdminStaff";

export interface InventoryItem {
  name: string;
  displayName: string;
  quantity: string;
}

export function useEquipmentHandlers(facilityId: string) {
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [isEditEquipmentModalOpen, setIsEditEquipmentModalOpen] =
    useState(false);
  const [selectedEquipment, setSelectedEquipment] =
    useState<InventoryItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);

  // Mutations
  const addEquipmentMutation = useAddEquipment(facilityId);
  const deleteEquipmentMutation = useDeleteEquipment(facilityId);
  const updateEquipmentMutation = useUpdateEquipment(facilityId);

  // Handle adding new equipment
  const handleAddEquipment = async (data: {
    name: string;
    quantity: string;
  }) => {
    try {
      await addEquipmentMutation.mutateAsync({
        item_name: data.name,
        quantity: parseInt(data.quantity, 10),
      });

      toast.success(`${data.name} added successfully!`, {
        duration: 4000,
      });

      setTimeout(() => {
        setIsEquipmentModalOpen(false);
      }, 300);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to add equipment. Please try again.",
        { duration: 5000 },
      );
    }
  };

  // Handle edit equipment click
  const handleEditEquipment = (item: InventoryItem) => {
    setSelectedEquipment(item);
    setIsEditEquipmentModalOpen(true);
  };

  // Handle update equipment
  const handleUpdateEquipment = async (data: {
    name: string;
    quantity: string;
  }) => {
    try {
      await updateEquipmentMutation.mutateAsync({
        item_name: data.name,
        quantity: parseInt(data.quantity, 10),
      });

      toast.success(`${data.name} updated successfully!`, {
        duration: 4000,
      });

      setTimeout(() => {
        setIsEditEquipmentModalOpen(false);
        setSelectedEquipment(null);
      }, 300);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update equipment. Please try again.",
        { duration: 5000 },
      );
    }
  };

  // Handle delete click
  const handleDeleteClick = (item: InventoryItem) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteEquipmentMutation.mutateAsync(itemToDelete.name);

      toast.success(`${itemToDelete.displayName} deleted successfully!`, {
        duration: 4000,
      });

      setTimeout(() => {
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
      }, 300);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete equipment. Please try again.",
        { duration: 5000 },
      );
    }
  };

  // Close modals
  const closeEquipmentModal = () => setIsEquipmentModalOpen(false);
  const closeEditModal = () => {
    setIsEditEquipmentModalOpen(false);
    setSelectedEquipment(null);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  return {
    // Modal states
    isEquipmentModalOpen,
    setIsEquipmentModalOpen,
    isEditEquipmentModalOpen,
    isDeleteModalOpen,
    selectedEquipment,
    itemToDelete,

    // Handlers
    handleAddEquipment,
    handleEditEquipment,
    handleUpdateEquipment,
    handleDeleteClick,
    handleConfirmDelete,

    // Close functions
    closeEquipmentModal,
    closeEditModal,
    closeDeleteModal,

    // Loading states
    isAdding: addEquipmentMutation.isPending,
    isUpdating: updateEquipmentMutation.isPending,
    isDeleting: deleteEquipmentMutation.isPending,
  };
}
