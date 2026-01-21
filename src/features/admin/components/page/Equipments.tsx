"use client";

import { useState } from "react";
import {
    ChevronUp,
    ChevronDown,
    Plus,
    Activity,
    HeartCrack,
    Hospital,
    AlertCircle,
    Trash2,
    Edit,
    Building2,
} from "lucide-react";
// import Loader from "@/components/shared/Loader";
import { Button } from "../ui/button";
import EquipmentModal from "../feature/EquipmentModal";
import InfrastructureModal from "../feature/InfrastructureModal";
import EditEquipmentModal from "../feature/EditEquipmentModal";
import EditInfrastructureModal from "../feature/EditInfrastructureModal";
import DeleteConfirmationModal from "../feature/DeleteConfirmationModal";
import { useFacilityInventory } from "@/hooks/useAdminStaff";
import { useEquipmentHandlers } from "../util/useEquipmentHandlers";
import { useInfrastructureHandlers } from "../util/useInfrastructureHandlers";

interface EquipmentsPageProps {
    facilityId: string;
}

export default function EquipmentsPage({ facilityId }: EquipmentsPageProps) {
    const [isEquipmentOpen, setIsEquipmentOpen] = useState(true);
    const [isFacilityOpen, setIsFacilityOpen] = useState(true);

    // Check if facility ID is available
    const hasFacilityId = Boolean(facilityId && facilityId.trim() !== "");

    // Fetch inventory data (only if facilityId exists)
    const {
        data: inventoryData,
        isLoading,
        isError,
        error,
    } = useFacilityInventory(facilityId);

    // Equipment handlers
    const equipment = useEquipmentHandlers(facilityId);

    // Infrastructure handlers
    const infrastructure = useInfrastructureHandlers(facilityId);

    // No facility ID state - show this first before any other states
    if (!hasFacilityId) {
        return (
            <div className="w-full h-96 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-center max-w-md px-4">
                    <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center">
                        <Building2 className="h-10 w-10 text-amber-500" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-slate-900">No Facility Assigned</h3>
                        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                            Your account is not currently associated with any facility.
                            Please contact your administrator to get assigned to a facility
                            before you can manage equipment and infrastructure.
                        </p>
                    </div>
                    <div className="mt-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-xs text-amber-700">
                            Facility assignment is required to view and manage inventory items.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="w-full h-64 flex items-center justify-center">
                {/* <Loader size="lg" text="Loading inventory..." variant="default" /> */}
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="w-full h-64 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-center">
                    <AlertCircle className="h-12 w-12 text-red-500" />
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Failed to load inventory</h3>
                        <p className="text-sm text-slate-600 mt-1">
                            {error?.message || "An error occurred while fetching inventory data"}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Convert inventory object to array for rendering
    const equipmentItems = Object.entries(inventoryData?.inventory?.equipment || {}).map(
        ([name, quantity]) => ({
            name: name,
            displayName: name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
            quantity: quantity.toString(),
        })
    );

    const infrastructureItems = Object.entries(inventoryData?.inventory?.infrastructure || {}).map(
        ([name, quantity]) => ({
            name: name,
            displayName: name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
            quantity: quantity.toString(),
        })
    );

    return (
        <>
            {/* Add Equipment Modal */}
            <EquipmentModal
                isOpen={equipment.isEquipmentModalOpen}
                onClose={equipment.closeEquipmentModal}
                onSubmit={equipment.handleAddEquipment}
                isSubmitting={equipment.isAdding}
            />

            {/* Add Infrastructure Modal */}
            <InfrastructureModal
                isOpen={infrastructure.isInfrastructureModalOpen}
                onClose={infrastructure.closeInfrastructureModal}
                onSubmit={infrastructure.handleAddInfrastructure}
                isSubmitting={infrastructure.isAdding}
            />

            {/* Edit Equipment Modal */}
            <EditEquipmentModal
                isOpen={equipment.isEditEquipmentModalOpen}
                onClose={equipment.closeEditModal}
                onSubmit={equipment.handleUpdateEquipment}
                isSubmitting={equipment.isUpdating}
                initialData={equipment.selectedEquipment}
            />

            {/* Edit Infrastructure Modal */}
            <EditInfrastructureModal
                isOpen={infrastructure.isEditInfrastructureModalOpen}
                onClose={infrastructure.closeEditModal}
                onSubmit={infrastructure.handleUpdateInfrastructure}
                isSubmitting={infrastructure.isUpdating}
                initialData={infrastructure.selectedInfrastructure}
            />

            {/* Delete Equipment Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={equipment.isDeleteModalOpen}
                onClose={equipment.closeDeleteModal}
                onConfirm={equipment.handleConfirmDelete}
                isDeleting={equipment.isDeleting}
                itemName={equipment.itemToDelete?.displayName || ""}
                itemType="equipment"
            />

            {/* Delete Infrastructure Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={infrastructure.isDeleteModalOpen}
                onClose={infrastructure.closeDeleteModal}
                onConfirm={infrastructure.handleConfirmDelete}
                isDeleting={infrastructure.isDeleting}
                itemName={infrastructure.itemToDelete?.displayName || ""}
                itemType="infrastructure"
            />

            <div className="w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    {/* Medical Equipment */}
                    <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden h-fit">
                        {/* Header */}
                        <div className="w-full px-4 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <Activity size={20} className="text-slate-600" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-2xl font-medium text-slate-700">Medical Equipment</h3>
                                    <p className="text-sm text-slate-500 mt-0.5">
                                        {equipmentItems.length} items
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center flex-row gap-4">
                                <Button
                                    onClick={() => equipment.setIsEquipmentModalOpen(true)}
                                    className="h-10 px-4 text-sm lg:h-14 lg:px-8 lg:text-lg"
                                    disabled={equipment.isAdding}
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
                            <div className="px-4 pb-4 pt-2 space-y-4">
                                {equipmentItems.length === 0 ? (
                                    <div className="text-center py-8 text-slate-500">
                                        <p>No equipment found. Add your first equipment item.</p>
                                    </div>
                                ) : (
                                    equipmentItems.map((item) => (
                                        <div
                                            key={item.name}
                                            className="group relative flex items-center justify-between py-4 px-4 bg-white rounded-2xl border-2 border-slate-200 hover:border-primary hover:shadow-md transition-all duration-200"
                                        >
                                            <div className="flex items-center flex-1">
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                                    <HeartCrack size={18} className="text-slate-600" />
                                                </div>
                                                <div className="px-4 flex-1">
                                                    <p className="text-sm font-medium text-slate-900">{item.displayName}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <p className="text-lg font-medium text-slate-600">{item.quantity}</p>

                                                {/* Action Buttons - Show on hover */}
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <button
                                                        onClick={() => equipment.handleEditEquipment(item)}
                                                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                                                        title="Edit equipment"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => equipment.handleDeleteClick(item)}
                                                        className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
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
                    <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden h-fit">
                        {/* Header */}
                        <div className="w-full px-4 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <Activity size={20} className="text-slate-600" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-2xl font-medium text-slate-700">Facility Infrastructure</h3>
                                    <p className="text-sm text-slate-500 mt-0.5">
                                        {infrastructureItems.length} items
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center flex-row gap-4">
                                <Button
                                    onClick={() => infrastructure.setIsInfrastructureModalOpen(true)}
                                    className="h-10 px-4 text-sm lg:h-14 lg:px-8 lg:text-lg"
                                    disabled={infrastructure.isAdding}
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
                            <div className="px-4 pb-4 pt-2 space-y-4">
                                {infrastructureItems.length === 0 ? (
                                    <div className="text-center py-8 text-slate-500">
                                        <p>No infrastructure found. Add your first infrastructure item.</p>
                                    </div>
                                ) : (
                                    infrastructureItems.map((item) => (
                                        <div
                                            key={item.name}
                                            className="group relative flex items-center justify-between py-4 px-4 bg-white rounded-2xl border-2 border-slate-200 hover:border-primary hover:shadow-md transition-all duration-200"
                                        >
                                            <div className="flex items-center flex-1">
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                                    <Hospital size={18} className="text-slate-600" />
                                                </div>
                                                <div className="px-4 flex-1">
                                                    <p className="text-sm font-medium text-slate-900">{item.displayName}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <p className="text-lg font-medium text-slate-600">{item.quantity}</p>

                                                {/* Action Buttons - Show on hover */}
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <button
                                                        onClick={() => infrastructure.handleEditInfrastructure(item)}
                                                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                                                        title="Edit infrastructure"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => infrastructure.handleDeleteClick(item)}
                                                        className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
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
