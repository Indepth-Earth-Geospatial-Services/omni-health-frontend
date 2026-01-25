"use client";

import { useState, useEffect } from "react";
import { X, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface AddFacilityModalProps {
    isOpen: boolean;
    onClose: () => void;
    facility?: any; // For edit mode
}

interface FacilityFormData {
    hfr_id: string;
    facility_name: string;
    facility_category: string;
    lga_id: number;
    town: string;
    contact_info: {
        phone?: string;
        email?: string;
        website?: string;
    };
    lat: number;
    lon: number;
}

export default function AddFacilityModal({ isOpen, onClose, facility }: AddFacilityModalProps) {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<FacilityFormData>({
        hfr_id: "",
        facility_name: "",
        facility_category: "",
        lga_id: 0,
        town: "",
        contact_info: {
            phone: "",
            email: "",
            website: "",
        },
        lat: 0,
        lon: 0,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Populate form if editing
    useEffect(() => {
        if (facility) {
            setFormData({
                hfr_id: facility.hfr_id || "",
                facility_name: facility.facility_name || "",
                facility_category: facility.facility_category || "",
                lga_id: facility.lga_id || 0,
                town: facility.town || "",
                contact_info: facility.contact_info || {},
                lat: facility.lat || 0,
                lon: facility.lon || 0,
            });
        }
    }, [facility]);

    // Create facility mutation
    const createMutation = useMutation({
        mutationFn: async (data: FacilityFormData) => {
            const response = await axios.post(
                "/api/v1/admin/facility/profile",
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        },
        onSuccess: () => {
            toast.success("Facility created successfully!");
            queryClient.invalidateQueries({ queryKey: ["facilities"] });
            handleClose();
        },
        onError: (error: any) => {
            toast.error(
                error.response?.data?.detail || "Failed to create facility"
            );
        },
    });

    // Update facility mutation
    const updateMutation = useMutation({
        mutationFn: async (data: FacilityFormData) => {
            const response = await axios.patch(
                `/api/v1/admin/facility/profile/${facility.facility_id}`,
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        },
        onSuccess: () => {
            toast.success("Facility updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["facilities"] });
            handleClose();
        },
        onError: (error: any) => {
            toast.error(
                error.response?.data?.detail || "Failed to update facility"
            );
        },
    });

    const handleClose = () => {
        setFormData({
            hfr_id: "",
            facility_name: "",
            facility_category: "",
            lga_id: 0,
            town: "",
            contact_info: {},
            lat: 0,
            lon: 0,
        });
        setErrors({});
        onClose();
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        // Clear error when user types
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleContactInfoChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            contact_info: {
                ...prev.contact_info,
                [field]: value,
            },
        }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.facility_name) {
            newErrors.facility_name = "Facility name is required";
        }
        if (!formData.facility_category) {
            newErrors.facility_category = "Facility category is required";
        }
        if (!formData.lga_id || formData.lga_id === 0) {
            newErrors.lga_id = "LGA is required";
        }
        if (!formData.town) {
            newErrors.town = "Town is required";
        }
        if (!formData.lat || formData.lat === 0) {
            newErrors.lat = "Latitude is required";
        }
        if (!formData.lon || formData.lon === 0) {
            newErrors.lon = "Longitude is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (facility) {
            updateMutation.mutate(formData);
        } else {
            createMutation.mutate(formData);
        }
    };

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center font-geist">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-white px-6 py-4 flex items-center justify-between rounded-t-2xl sticky top-0 z-10 border-b">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            {facility ? "Edit Facility" : "Add New Facility"}
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            {facility ? "Update facility details" : "Provide details about the facility"}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <X size={20} className="text-slate-600" />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-5">
                    {/* Full Width Fields */}
                    <div className="space-y-4">
                        {/* Facility Name */}
                        <div>
                            <Label htmlFor="facility_name" className="text-sm font-medium text-slate-700">
                                Facility Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="facility_name"
                                value={formData.facility_name}
                                onChange={(e) => handleInputChange("facility_name", e.target.value)}
                                placeholder="e.g., General Hospital Port Harcourt"
                                className={`mt-1 ${errors.facility_name ? "border-red-500" : ""}`}
                            />
                            {errors.facility_name && (
                                <p className="text-xs text-red-500 mt-1">{errors.facility_name}</p>
                            )}
                        </div>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* HFR ID */}
                        <div>
                            <Label htmlFor="hfr_id" className="text-sm font-medium text-slate-700">
                                HFR ID
                            </Label>
                            <Input
                                id="hfr_id"
                                value={formData.hfr_id}
                                onChange={(e) => handleInputChange("hfr_id", e.target.value)}
                                placeholder="e.g., HFR-12345"
                                className="mt-1"
                            />
                        </div>

                        {/* Facility Category */}
                        <div>
                            <Label htmlFor="facility_category" className="text-sm font-medium text-slate-700">
                                Facility Category <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="facility_category"
                                value={formData.facility_category}
                                onChange={(e) => handleInputChange("facility_category", e.target.value)}
                                placeholder="e.g., Primary Health Centre"
                                className={`mt-1 ${errors.facility_category ? "border-red-500" : ""}`}
                            />
                            {errors.facility_category && (
                                <p className="text-xs text-red-500 mt-1">{errors.facility_category}</p>
                            )}
                        </div>

                        {/* LGA ID */}
                        <div>
                            <Label htmlFor="lga_id" className="text-sm font-medium text-slate-700">
                                LGA ID <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="lga_id"
                                type="number"
                                value={formData.lga_id}
                                onChange={(e) => handleInputChange("lga_id", parseInt(e.target.value) || 0)}
                                placeholder="e.g., 1"
                                className={`mt-1 ${errors.lga_id ? "border-red-500" : ""}`}
                            />
                            {errors.lga_id && (
                                <p className="text-xs text-red-500 mt-1">{errors.lga_id}</p>
                            )}
                        </div>

                        {/* Town */}
                        <div>
                            <Label htmlFor="town" className="text-sm font-medium text-slate-700">
                                Town <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="town"
                                value={formData.town}
                                onChange={(e) => handleInputChange("town", e.target.value)}
                                placeholder="e.g., Port Harcourt"
                                className={`mt-1 ${errors.town ? "border-red-500" : ""}`}
                            />
                            {errors.town && (
                                <p className="text-xs text-red-500 mt-1">{errors.town}</p>
                            )}
                        </div>

                        {/* Latitude */}
                        <div>
                            <Label htmlFor="lat" className="text-sm font-medium text-slate-700">
                                Latitude <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="lat"
                                type="number"
                                step="0.000001"
                                value={formData.lat}
                                onChange={(e) => handleInputChange("lat", parseFloat(e.target.value) || 0)}
                                placeholder="e.g., 4.8156"
                                className={`mt-1 ${errors.lat ? "border-red-500" : ""}`}
                            />
                            {errors.lat && (
                                <p className="text-xs text-red-500 mt-1">{errors.lat}</p>
                            )}
                        </div>

                        {/* Longitude */}
                        <div>
                            <Label htmlFor="lon" className="text-sm font-medium text-slate-700">
                                Longitude <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="lon"
                                type="number"
                                step="0.000001"
                                value={formData.lon}
                                onChange={(e) => handleInputChange("lon", parseFloat(e.target.value) || 0)}
                                placeholder="e.g., 7.0498"
                                className={`mt-1 ${errors.lon ? "border-red-500" : ""}`}
                            />
                            {errors.lon && (
                                <p className="text-xs text-red-500 mt-1">{errors.lon}</p>
                            )}
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-sm font-semibold text-slate-700">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Phone */}
                            <div>
                                <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                                    Phone Number
                                </Label>
                                <Input
                                    id="phone"
                                    value={formData.contact_info?.phone || ""}
                                    onChange={(e) => handleContactInfoChange("phone", e.target.value)}
                                    placeholder="e.g., +234 123 456 7890"
                                    className="mt-1"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.contact_info?.email || ""}
                                    onChange={(e) => handleContactInfoChange("email", e.target.value)}
                                    placeholder="e.g., info@hospital.com"
                                    className="mt-1"
                                />
                            </div>

                            {/* Website */}
                            <div className="md:col-span-2">
                                <Label htmlFor="website" className="text-sm font-medium text-slate-700">
                                    Website
                                </Label>
                                <Input
                                    id="website"
                                    value={formData.contact_info?.website || ""}
                                    onChange={(e) => handleContactInfoChange("website", e.target.value)}
                                    placeholder="e.g., https://hospital.com"
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="pt-4 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="default"
                            size="lg"
                            disabled={isSubmitting}
                            onClick={handleSubmit}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    {facility ? "Updating..." : "Creating..."}
                                </>
                            ) : (
                                <>
                                    {facility ? "Update Facility" : "Create Facility"}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}