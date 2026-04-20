"use client";

import { useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/client";
import { RIVERS_STATE_LGAS } from "@/features/super-admin/constants/lga";

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
        // LGA dropdown stores numeric IDs — look up the ID from the stored name
        lga:
          RIVERS_STATE_LGAS.find(
            (l) => l.label === (facility.facility_lga || facility.lga || ""),
          )?.value || "",
        street_address: facility.address || facility.street_address || "",
        latitude: facility.lat?.toString() || "",
        longitude: facility.lon?.toString() || "",
      });
    }
  }, [facility, isOpen]);

  const handleClose = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    onClose();
  }, [onClose]);

  // Create facility mutation
  // POST /api/v1/facilities/ — FacilityCreate schema (confirmed from backend docs)
  // Required: facility_name, lga_id (int), lat, lon
  // Optional: facility_category, hfr_id, town, address, contact_info, working_hours
  const createMutation = useMutation({
    mutationFn: async (data: FacilityFormData) => {
      const response = await apiClient.post("/facilities/", {
        facility_name: data.facility_name,
        facility_category: data.facility_type || null,
        lga_id: parseInt(data.lga, 10),
        address: data.street_address || null,
        contact_info: {
          phone: data.contact_number,
          email: data.contact_email,
        },
        lat: parseFloat(data.latitude),
        lon: parseFloat(data.longitude),
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Facility added successfully!");
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
      handleClose();
    },
    onError: (error: unknown) => {
      const detail = (error as any)?.response?.data?.detail;
      toast.error(
        typeof detail === "string" ? detail : "Failed to add facility",
      );
    },
  });

  // Update facility mutation
  // PATCH /api/v1/admin/facility/profile/{facility_id}
  const updateMutation = useMutation({
    mutationFn: async (data: FacilityFormData) => {
      const lgaId = data.lga ? parseInt(data.lga, 10) : undefined;
      const response = await apiClient.patch(
        `/admin/facility/profile/${facility?.facility_id}`,
        {
          facility_name: data.facility_name,
          facility_category: data.facility_type,
          ...(lgaId ? { lga_id: lgaId } : {}),
          address: data.street_address,
          contact_info: {
            phone: data.contact_number,
            email: data.contact_email,
          },
          lat: parseFloat(data.latitude),
          lon: parseFloat(data.longitude),
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
      const detail = (error as any)?.response?.data?.detail;
      toast.error(
        typeof detail === "string" ? detail : "Failed to update facility",
      );
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
    [errors],
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
