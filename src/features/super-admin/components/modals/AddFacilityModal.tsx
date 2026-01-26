"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight } from "lucide-react";
import { Button } from "@/features/admin/components/ui/button";
import { Input } from "@/features/super-admin/components/ui/input";
import { Textarea } from "@/features/super-admin/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface AddFacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  facility?: {
    hfr_id?: string;
    facility_id?: string;
    facility_name?: string;
    facility_type?: string;
    facility_category?: string;
    facility_lga?: string;
    lga?: string;
    state?: string;
    address?: string;
    street_address?: string;
    lat?: number;
    lon?: number;
    total_beds?: number;
    staff_count?: number;
    operation?: string;
    description?: string;
    contact_info?: {
      phone?: string;
      email?: string;
    };
  };
}

interface FacilityFormData {
  facility_name: string;
  facility_type: string;
  contact_number: string;
  contact_email: string;
  state: string;
  lga: string;
  street_address: string;
  latitude: string;
  longitude: string;
  total_beds: string;
  staff_count: string;
  operation: string;
}

const LGA_OPTIONS = [
  "Abua/Odual",
  "Ahoada East",
  "Ahoada West",
  "Akuku-Toru",
  "Andoni",
  "Asari-Toru",
  "Bonny",
  "Degema",
  "Eleme",
  "Emohua",
  "Etche",
  "Gokana",
  "Ikwerre",
  "Khana",
  "Obio/Akpor",
  "Ogba/Egbema/Ndoni",
  "Ogu/Bolo",
  "Okrika",
  "Omuma",
  "Opobo/Nkoro",
  "Oyigbo",
  "Port Harcourt",
  "Tai",
];

const FACILITY_TYPES = [
  "General Hospital",
  "Primary Health Center",
  "Cottage Hospital",
  "Health Post",
  "Comprehensive Health Center",
  "Secondary Health Facility",
  "Tertiary Health Facility",
];

export default function AddFacilityModal({
  isOpen,
  onClose,
  facility,
}: AddFacilityModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<FacilityFormData>({
    facility_name: "",
    facility_type: "",
    contact_number: "",
    contact_email: "",
    state: "Rivers",
    lga: "",
    street_address: "",
    latitude: "",
    longitude: "",
    total_beds: "",
    staff_count: "",
    operation: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form if editing
  useEffect(() => {
    if (facility && isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        facility_name: facility.facility_name || "",
        facility_type:
          facility.facility_type || facility.facility_category || "",
        contact_number: facility.contact_info?.phone || "",
        contact_email: facility.contact_info?.email || "",
        state: facility.state || "Rivers",
        lga: facility.facility_lga || facility.lga || "",
        street_address: facility.address || facility.street_address || "",
        latitude: facility.lat?.toString() || "",
        longitude: facility.lon?.toString() || "",
        total_beds: facility.total_beds?.toString() || "",
        staff_count: facility.staff_count?.toString() || "",
        operation: facility.operation || facility.description || "",
      });
    }
  }, [facility, isOpen]);

  // Create facility mutation
  const createMutation = useMutation({
    mutationFn: async (data: FacilityFormData) => {
      const response = await axios.post(
        "/api/backend/facilities",
        {
          facility_name: data.facility_name,
          facility_category: data.facility_type,
          facility_lga: data.lga,
          state: data.state,
          address: data.street_address,
          contact_info: {
            phone: data.contact_number,
            email: data.contact_email,
          },
          lat: parseFloat(data.latitude),
          lon: parseFloat(data.longitude),
          total_beds: parseInt(data.total_beds) || 0,
          staff_count: parseInt(data.staff_count) || 0,
          description: data.operation,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Facility added successfully!");
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
      handleClose();
    },
    onError: (error: unknown) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.detail || "Failed to add facility"
        : "Failed to add facility";
      toast.error(message);
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
        },
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Facility updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
      handleClose();
    },
    onError: (error: unknown) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.detail || "Failed to update facility"
        : "Failed to update facility";
      toast.error(message);
    },
  });

  const handleClose = () => {
    setFormData({
      facility_name: "",
      facility_type: "",
      contact_number: "",
      contact_email: "",
      state: "Rivers",
      lga: "",
      street_address: "",
      latitude: "",
      longitude: "",
      total_beds: "",
      staff_count: "",
      operation: "",
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: keyof FacilityFormData, value: string) => {
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.facility_name.trim()) {
      newErrors.facility_name = "Facility name is required";
    }
    if (!formData.facility_type) {
      newErrors.facility_type = "Facility type is required";
    }
    if (!formData.lga) {
      newErrors.lga = "Local Government Area is required";
    }
    if (!formData.street_address.trim()) {
      newErrors.street_address = "Street address is required";
    }
    if (!formData.latitude.trim()) {
      newErrors.latitude = "Latitude is required";
    } else if (isNaN(parseFloat(formData.latitude))) {
      newErrors.latitude = "Latitude must be a valid number";
    }
    if (!formData.longitude.trim()) {
      newErrors.longitude = "Longitude is required";
    } else if (isNaN(parseFloat(formData.longitude))) {
      newErrors.longitude = "Longitude must be a valid number";
    }

    // Optional email validation
    if (
      formData.contact_email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)
    ) {
      newErrors.contact_email = "Invalid email format";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Add New Facility
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-lg p-1.5 transition-colors hover:bg-slate-100 disabled:opacity-50"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-6">
            {/* Basic Details Section */}
            <div>
              <h3 className="mb-1 text-sm font-semibold text-slate-900">
                Basic Details
              </h3>
              <p className="mb-4 text-xs text-slate-500">
                Provide a new healthcare facility to the platform
              </p>

              <div className="space-y-4">
                {/* Facility Name */}
                <div>
                  <Label
                    htmlFor="facility_name"
                    className="text-sm font-medium text-slate-700"
                  >
                    Facility Name
                  </Label>
                  <Input
                    id="facility_name"
                    value={formData.facility_name}
                    onChange={(e) =>
                      handleInputChange("facility_name", e.target.value)
                    }
                    placeholder="Obonoma Healthcare Centre"
                    className={`mt-1.5 ${errors.facility_name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                  />
                  {errors.facility_name && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.facility_name}
                    </p>
                  )}
                </div>

                {/* Two Column: Facility Type & Contact Number */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Facility Type */}
                  <div>
                    <Label
                      htmlFor="facility_type"
                      className="text-sm font-medium text-slate-700"
                    >
                      Facility Type
                    </Label>
                    <Select
                      value={formData.facility_type}
                      onValueChange={(value) =>
                        handleInputChange("facility_type", value)
                      }
                    >
                      <SelectTrigger
                        className={`mt-1.5 w-full ${errors.facility_type ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                      >
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {FACILITY_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.facility_type && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.facility_type}
                      </p>
                    )}
                  </div>

                  {/* Contact Number */}
                  <div>
                    <Label
                      htmlFor="contact_number"
                      className="text-sm font-medium text-slate-700"
                    >
                      Contact Number
                    </Label>
                    <Input
                      id="contact_number"
                      value={formData.contact_number}
                      onChange={(e) =>
                        handleInputChange("contact_number", e.target.value)
                      }
                      placeholder=""
                      className="mt-1.5"
                    />
                  </div>
                </div>

                {/* Contact Email */}
                <div>
                  <Label
                    htmlFor="contact_email"
                    className="text-sm font-medium text-slate-700"
                  >
                    Contact Email
                  </Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) =>
                      handleInputChange("contact_email", e.target.value)
                    }
                    placeholder=""
                    className={`mt-1.5 ${errors.contact_email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                  />
                  {errors.contact_email && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.contact_email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Location Details Section */}
            <div>
              <h3 className="mb-1 text-sm font-semibold text-slate-900">
                Location Details
              </h3>
              <p className="mb-4 text-xs text-slate-500">
                Indicate a new healthcare facility to the platform
              </p>

              <div className="space-y-4">
                {/* Two Column: State & LGA */}
                <div className="grid grid-cols-2 gap-4">
                  {/* State */}
                  <div>
                    <Label
                      htmlFor="state"
                      className="text-sm font-medium text-slate-700"
                    >
                      State
                    </Label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) =>
                        handleInputChange("state", value)
                      }
                    >
                      <SelectTrigger className="mt-1.5 w-full">
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Rivers">Rivers</SelectItem>
                        <SelectItem value="Lagos">Lagos</SelectItem>
                        <SelectItem value="Abuja">Abuja</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Local Government Area */}
                  <div>
                    <Label
                      htmlFor="lga"
                      className="text-sm font-medium text-slate-700"
                    >
                      Local Government Area
                    </Label>
                    <Select
                      value={formData.lga}
                      onValueChange={(value) => handleInputChange("lga", value)}
                    >
                      <SelectTrigger
                        className={`mt-1.5 w-full ${errors.lga ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                      >
                        <SelectValue placeholder="Select LGA" />
                      </SelectTrigger>
                      <SelectContent>
                        {LGA_OPTIONS.map((lga) => (
                          <SelectItem key={lga} value={lga}>
                            {lga}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.lga && (
                      <p className="mt-1 text-xs text-red-500">{errors.lga}</p>
                    )}
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <Label
                    htmlFor="street_address"
                    className="text-sm font-medium text-slate-700"
                  >
                    Street Address
                  </Label>
                  <Input
                    id="street_address"
                    value={formData.street_address}
                    onChange={(e) =>
                      handleInputChange("street_address", e.target.value)
                    }
                    placeholder="Street Address"
                    className={`mt-1.5 ${errors.street_address ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                  />
                  {errors.street_address && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.street_address}
                    </p>
                  )}
                </div>

                {/* Two Column: Latitude & Longitude */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Latitude */}
                  <div>
                    <Label
                      htmlFor="latitude"
                      className="text-sm font-medium text-slate-700"
                    >
                      Latitude
                    </Label>
                    <Input
                      id="latitude"
                      value={formData.latitude}
                      onChange={(e) =>
                        handleInputChange("latitude", e.target.value)
                      }
                      placeholder="e.g. 40.7128"
                      className={`mt-1.5 ${errors.latitude ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                    />
                    {errors.latitude && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.latitude}
                      </p>
                    )}
                  </div>

                  {/* Longitude */}
                  <div>
                    <Label
                      htmlFor="longitude"
                      className="text-sm font-medium text-slate-700"
                    >
                      Longitude
                    </Label>
                    <Input
                      id="longitude"
                      value={formData.longitude}
                      onChange={(e) =>
                        handleInputChange("longitude", e.target.value)
                      }
                      placeholder="e.g. -74.0060"
                      className={`mt-1.5 ${errors.longitude ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                    />
                    {errors.longitude && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.longitude}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Capacity & Resources Section */}
            <div>
              <h3 className="mb-1 text-sm font-semibold text-slate-900">
                Capacity & Resources
              </h3>
              <p className="mb-4 text-xs text-slate-500">
                Populate a new healthcare facility to the platform
              </p>

              <div className="space-y-4">
                {/* Two Column: Total Beds & Staff Count */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Total Beds */}
                  <div>
                    <Label
                      htmlFor="total_beds"
                      className="text-sm font-medium text-slate-700"
                    >
                      Total Beds
                    </Label>
                    <Input
                      id="total_beds"
                      type="number"
                      value={formData.total_beds}
                      onChange={(e) =>
                        handleInputChange("total_beds", e.target.value)
                      }
                      placeholder="Typical number of staff in facility"
                      className="mt-1.5"
                    />
                  </div>

                  {/* Staff Count */}
                  <div>
                    <Label
                      htmlFor="staff_count"
                      className="text-sm font-medium text-slate-700"
                    >
                      Staff Count
                    </Label>
                    <Input
                      id="staff_count"
                      type="number"
                      value={formData.staff_count}
                      onChange={(e) =>
                        handleInputChange("staff_count", e.target.value)
                      }
                      placeholder="Typical number of staff in facility"
                      className="mt-1.5"
                    />
                  </div>
                </div>

                {/* Operation */}
                <div>
                  <Label
                    htmlFor="operation"
                    className="text-sm font-medium text-slate-700"
                  >
                    Operation
                  </Label>
                  <Textarea
                    id="operation"
                    value={formData.operation}
                    onChange={(e) =>
                      handleInputChange("operation", e.target.value)
                    }
                    placeholder="Brief Description of services offered and specialties etc."
                    className="mt-1.5"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Submit Button */}
        <div className="flex justify-end border-t border-slate-200 px-6 py-4">
          <Button
            type="button"
            size="lg"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-primary flex items-center gap-2 px-2"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Submitting...
              </>
            ) : (
              <>
                Submit
                <ArrowRight size={18} />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
