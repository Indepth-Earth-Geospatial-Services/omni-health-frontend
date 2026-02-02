import { useState } from "react";
import { toast } from "sonner";
import {
  useAddInfrastructure,
  useDeleteInfrastructure,
  useUpdateInfrastructure,
} from "@/features/admin/hooks/useAdminStaff";

export interface InventoryItem {
  name: string;
  displayName: string;
  quantity: string;
}

export function useInfrastructureHandlers(facilityId: string) {
  const [isInfrastructureModalOpen, setIsInfrastructureModalOpen] =
    useState(false);
  const [isEditInfrastructureModalOpen, setIsEditInfrastructureModalOpen] =
    useState(false);
  const [selectedInfrastructure, setSelectedInfrastructure] =
    useState<InventoryItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);

  // Mutations
  const addInfrastructureMutation = useAddInfrastructure(facilityId);
  const deleteInfrastructureMutation = useDeleteInfrastructure(facilityId);
  const updateInfrastructureMutation = useUpdateInfrastructure(facilityId);

  // Handle adding new infrastructure
  const handleAddInfrastructure = async (data: {
    name: string;
    quantity: string;
  }) => {
    try {
      await addInfrastructureMutation.mutateAsync({
        item_name: data.name,
        quantity: parseInt(data.quantity, 10),
      });

      toast.success(`${data.name} added successfully!`, {
        duration: 4000,
      });

      setTimeout(() => {
        setIsInfrastructureModalOpen(false);
      }, 300);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to add infrastructure. Please try again.",
        { duration: 5000 },
      );
    }
  };

  // Handle edit infrastructure click
  const handleEditInfrastructure = (item: InventoryItem) => {
    setSelectedInfrastructure(item);
    setIsEditInfrastructureModalOpen(true);
  };

  // Handle update infrastructure
  const handleUpdateInfrastructure = async (data: {
    name: string;
    quantity: string;
  }) => {
    try {
      await updateInfrastructureMutation.mutateAsync({
        item_name: data.name,
        quantity: parseInt(data.quantity, 10),
      });

      toast.success(`${data.name} updated successfully!`, {
        duration: 4000,
      });

      setTimeout(() => {
        setIsEditInfrastructureModalOpen(false);
        setSelectedInfrastructure(null);
      }, 300);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update infrastructure. Please try again.",
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
      await deleteInfrastructureMutation.mutateAsync(itemToDelete.name);

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
          "Failed to delete infrastructure. Please try again.",
        { duration: 5000 },
      );
    }
  };

  // Close modals
  const closeInfrastructureModal = () => setIsInfrastructureModalOpen(false);
  const closeEditModal = () => {
    setIsEditInfrastructureModalOpen(false);
    setSelectedInfrastructure(null);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  return {
    // Modal states
    isInfrastructureModalOpen,
    setIsInfrastructureModalOpen,
    isEditInfrastructureModalOpen,
    isDeleteModalOpen,
    selectedInfrastructure,
    itemToDelete,

    // Handlers
    handleAddInfrastructure,
    handleEditInfrastructure,
    handleUpdateInfrastructure,
    handleDeleteClick,
    handleConfirmDelete,

    // Close functions
    closeInfrastructureModal,
    closeEditModal,
    closeDeleteModal,

    // Loading states
    isAdding: addInfrastructureMutation.isPending,
    isUpdating: updateInfrastructureMutation.isPending,
    isDeleting: deleteInfrastructureMutation.isPending,
  };
}
