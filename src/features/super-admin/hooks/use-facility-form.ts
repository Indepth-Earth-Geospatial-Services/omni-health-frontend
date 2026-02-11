"use client";

import { useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export interface FacilityFormData {
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

export interface FacilityData {
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
}

const INITIAL_FORM_DATA: FacilityFormData = {
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
};

interface UseFacilityFormOptions {
  facility?: FacilityData;
  isOpen: boolean;
  onClose: () => void;
}

export function useFacilityForm({
  facility,
  isOpen,
  onClose,
}: UseFacilityFormOptions) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<FacilityFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form if editing
  useEffect(() => {
    if (facility && isOpen) {
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

  const handleClose = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    onClose();
  }, [onClose]);

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
          headers: { "Content-Type": "application/json" },
        }
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
        `/api/v1/admin/facility/profile/${facility?.facility_id}`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
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

  const handleInputChange = useCallback(
    (field: keyof FacilityFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const validateForm = useCallback(() => {
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
  }, [formData]);

  const handleSubmit = useCallback(() => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (facility) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  }, [validateForm, facility, formData, createMutation, updateMutation]);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isEditing = !!facility;

  return {
    formData,
    errors,
    isSubmitting,
    isEditing,
    handleInputChange,
    handleSubmit,
    handleClose,
  };
}
