"use client";

import { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  Plus,
  Activity,
  HeartCrack,
  Hospital,
  Loader2,
  AlertCircle,
  Trash2,
  Edit,
} from "lucide-react";
import { Button } from "../components/ui/button";
import EquipmentModal from "./EquipmentModal";
import InfrastructureModal from "./InfrastructureModal";
import EditEquipmentModal from "./EditEquipmentModal";
import EditInfrastructureModal from "./EditInfrastructureModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import {
  useFacilityInventory,
  useAddEquipment,
  useAddInfrastructure,
  useDeleteEquipment,
  useDeleteInfrastructure,
  useUpdateEquipment,
  useUpdateInfrastructure,
} from "@/hooks/use-admin-staff";
import toast from "react-hot-toast";

interface EquipmentsPageProps {
  facilityId: string;
}

interface InventoryItem {
  name: string;
  displayName: string;
  quantity: string;
}

export default function EquipmentsPage({ facilityId }: EquipmentsPageProps) {
  const [isEquipmentOpen, setIsEquipmentOpen] = useState(true);
  const [isFacilityOpen, setIsFacilityOpen] = useState(true);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [isInfrastructureModalOpen, setIsInfrastructureModalOpen] =
    useState(false);

  // Edit modals state
  const [isEditEquipmentModalOpen, setIsEditEquipmentModalOpen] =
    useState(false);
  const [isEditInfrastructureModalOpen, setIsEditInfrastructureModalOpen] =
    useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<"equipment" | "infrastructure">(
    "equipment",
  );
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);

  // Fetch inventory data
  const {
    data: inventoryData,
    isLoading,
    isError,
    error,
  } = useFacilityInventory(facilityId);

  // Mutations for adding equipment and infrastructure
  const addEquipmentMutation = useAddEquipment(facilityId);
  const addInfrastructureMutation = useAddInfrastructure(facilityId);

  // Mutations for deleting
  const deleteEquipmentMutation = useDeleteEquipment(facilityId);
  const deleteInfrastructureMutation = useDeleteInfrastructure(facilityId);

  // Mutations for updating (will be implemented when endpoint is ready)
  const updateEquipmentMutation = useUpdateEquipment(facilityId);
  const updateInfrastructureMutation = useUpdateInfrastructure(facilityId);

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

  // Handle edit equipment
  const handleEditEquipment = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsEditEquipmentModalOpen(true);
  };

  // Handle edit infrastructure
  const handleEditInfrastructure = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsEditInfrastructureModalOpen(true);
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
        setSelectedItem(null);
      }, 300);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update equipment. Please try again.",
        { duration: 5000 },
      );
    }
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
        setSelectedItem(null);
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
  const handleDeleteClick = (
    item: InventoryItem,
    type: "equipment" | "infrastructure",
  ) => {
    setItemToDelete(item);
    setDeleteType(type);
    setIsDeleteModalOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (deleteType === "equipment") {
        await deleteEquipmentMutation.mutateAsync(itemToDelete.name);
      } else {
        await deleteInfrastructureMutation.mutateAsync(itemToDelete.name);
      }

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
          `Failed to delete ${deleteType}. Please try again.`,
        { duration: 5000 },
      );
    }
  };

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

  // Convert inventory object to array for rendering
  const equipmentItems = Object.entries(
    inventoryData?.inventory?.equipment || {},
  ).map(([name, quantity]) => ({
    name: name, // raw name for API calls
    displayName: name
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()),
    quantity: quantity.toString(),
  }));

  const infrastructureItems = Object.entries(
    inventoryData?.inventory?.infrastructure || {},
  ).map(([name, quantity]) => ({
    name: name, // raw name for API calls
    displayName: name
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()),
    quantity: quantity.toString(),
  }));

  return (
    <>
      {/* Add Equipment Modal */}
      <EquipmentModal
        isOpen={isEquipmentModalOpen}
        onClose={() => setIsEquipmentModalOpen(false)}
        onSubmit={handleAddEquipment}
        isSubmitting={addEquipmentMutation.isPending}
      />

      {/* Add Infrastructure Modal */}
      <InfrastructureModal
        isOpen={isInfrastructureModalOpen}
        onClose={() => setIsInfrastructureModalOpen(false)}
        onSubmit={handleAddInfrastructure}
        isSubmitting={addInfrastructureMutation.isPending}
      />

      {/* Edit Equipment Modal */}
      <EditEquipmentModal
        isOpen={isEditEquipmentModalOpen}
        onClose={() => {
          setIsEditEquipmentModalOpen(false);
          setSelectedItem(null);
        }}
        onSubmit={handleUpdateEquipment}
        isSubmitting={updateEquipmentMutation.isPending}
        initialData={selectedItem}
      />

      {/* Edit Infrastructure Modal */}
      <EditInfrastructureModal
        isOpen={isEditInfrastructureModalOpen}
        onClose={() => {
          setIsEditInfrastructureModalOpen(false);
          setSelectedItem(null);
        }}
        onSubmit={handleUpdateInfrastructure}
        isSubmitting={updateInfrastructureMutation.isPending}
        initialData={selectedItem}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        isDeleting={
          deleteEquipmentMutation.isPending ||
          deleteInfrastructureMutation.isPending
        }
        itemName={itemToDelete?.displayName || ""}
        itemType={deleteType}
      />

      <div className="w-full">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          {/* Medical Equipment */}
          <div className="h-fit overflow-hidden rounded-2xl border-2 border-slate-200 bg-white">
            {/* Header */}
            <div className="flex w-full items-center justify-between px-4 py-4 transition-colors hover:bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100">
                  <Activity size={20} className="text-slate-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-medium text-slate-700">
                    Medical Equipment
                  </h3>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {equipmentItems.length} items
                  </p>
                </div>
              </div>

              <div className="flex flex-row items-center gap-4">
                <Button
                  size="xl"
                  onClick={() => setIsEquipmentModalOpen(true)}
                  className="text-lg"
                  disabled={addEquipmentMutation.isPending}
                >
                  <Plus size={18} className="text-white" />
                  New Equipment
                </Button>
                <button onClick={() => setIsEquipmentOpen(!isEquipmentOpen)}>
                  {isEquipmentOpen ? (
                    <ChevronUp size={20} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={20} className="text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Equipment Content */}
            {isEquipmentOpen && (
              <div className="space-y-4 px-4 pt-2 pb-4">
                {equipmentItems.length === 0 ? (
                  <div className="py-8 text-center text-slate-500">
                    <p>No equipment found. Add your first equipment item.</p>
                  </div>
                ) : (
                  equipmentItems.map((item) => (
                    <div
                      key={item.name}
                      className="group hover:border-primary relative flex items-center justify-between rounded-2xl border-2 border-slate-200 bg-white px-4 py-4 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex flex-1 items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                          <HeartCrack size={18} className="text-slate-600" />
                        </div>
                        <div className="flex-1 px-4">
                          <p className="text-sm font-medium text-slate-900">
                            {item.displayName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <p className="text-lg font-medium text-slate-600">
                          {item.quantity}
                        </p>

                        {/* Action Buttons - Show on hover */}
                        <div className="flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          <button
                            onClick={() => handleEditEquipment(item)}
                            className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                            title="Edit equipment"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item, "equipment")}
                            className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                            title="Delete equipment"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Facility Infrastructure */}
          <div className="h-fit overflow-hidden rounded-2xl border-2 border-slate-200 bg-white">
            {/* Header */}
            <div className="flex w-full items-center justify-between px-4 py-4 transition-colors hover:bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100">
                  <Activity size={20} className="text-slate-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-medium text-slate-700">
                    Facility Infrastructure
                  </h3>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {infrastructureItems.length} items
                  </p>
                </div>
              </div>
              <div className="flex flex-row items-center gap-4">
                <Button
                  size="xl"
                  onClick={() => setIsInfrastructureModalOpen(true)}
                  className="text-lg"
                  disabled={addInfrastructureMutation.isPending}
                >
                  <Plus size={18} className="text-white" />
                  New Infrastructure
                </Button>

                <button onClick={() => setIsFacilityOpen(!isFacilityOpen)}>
                  {isFacilityOpen ? (
                    <ChevronUp size={20} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={20} className="text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Infrastructure Content */}
            {isFacilityOpen && (
              <div className="space-y-4 px-4 pt-2 pb-4">
                {infrastructureItems.length === 0 ? (
                  <div className="py-8 text-center text-slate-500">
                    <p>
                      No infrastructure found. Add your first infrastructure
                      item.
                    </p>
                  </div>
                ) : (
                  infrastructureItems.map((item) => (
                    <div
                      key={item.name}
                      className="group hover:border-primary relative flex items-center justify-between rounded-2xl border-2 border-slate-200 bg-white px-4 py-4 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex flex-1 items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                          <Hospital size={18} className="text-slate-600" />
                        </div>
                        <div className="flex-1 px-4">
                          <p className="text-sm font-medium text-slate-900">
                            {item.displayName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <p className="text-lg font-medium text-slate-600">
                          {item.quantity}
                        </p>

                        {/* Action Buttons - Show on hover */}
                        <div className="flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          <button
                            onClick={() => handleEditInfrastructure(item)}
                            className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                            title="Edit infrastructure"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteClick(item, "infrastructure")
                            }
                            className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                            title="Delete infrastructure"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
