"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";

interface EditEquipmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (equipmentData: EquipmentFormData) => void;
    isSubmitting?: boolean;
    initialData: { name: string; displayName: string; quantity: string } | null;
}

interface EquipmentFormData {
    name: string;
    quantity: string;
}

const EditEquipmentModal: React.FC<EditEquipmentModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting = false,
    initialData,
}) => {
    const [formData, setFormData] = useState<EquipmentFormData>({
        name: "",
        quantity: "",
    });

    // Sync form data when initialData changes
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                quantity: initialData.quantity,
            });
        }
    }, [initialData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate quantity is a number
        if (isNaN(Number(formData.quantity)) || Number(formData.quantity) < 0) {
            alert("Please enter a valid quantity");
            return;
        }

        onSubmit?.(formData);
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <div>
                        <h1 className="text-3xl text-slate-900 mb-4 mt-2 font-medium">
                            Edit Equipment
                        </h1>
                        <div>
                            <h2 className="text-xl font-medium text-slate-600">
                                {initialData?.displayName}
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Update equipment quantity
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Equipment Name (Read-only) */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-slate-700 mb-2"
                        >
                            Equipment Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={initialData?.displayName || ""}
                            disabled
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-gray-50 text-slate-500 cursor-not-allowed"
                        />
                    </div>

                    {/* Quantity */}
                    <div>
                        <label
                            htmlFor="quantity"
                            className="block text-sm font-medium text-slate-700 mb-2"
                        >
                            Quantity
                        </label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            placeholder="Enter quantity"
                            min="0"
                            required
                            disabled={isSubmitting}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            size="xl"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="text-lg"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="default"
                            size="xl"
                            disabled={isSubmitting}
                            className="text-lg"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    Update Equipment
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEquipmentModal;
