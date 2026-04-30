"use client";

import { useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/client";
import { RIVERS_STATE_LGAS } from "@/features/super-admin/constants/lga";

export type DaySchedule = { open: string; close: string; closed: boolean };
export type WorkingHoursData = Record<string, DaySchedule>;

export interface FacilityFormData {
  facility_name: string;
  facility_type: string;
  hfr_id: string;
  town: string;
  contact_number: string;
  contact_email: string;
  state: string;
  lga: string;
  street_address: string;
  latitude: string;
  longitude: string;
  services_list: string; // newline-separated
  specialists: string;   // newline-separated
  working_hours: WorkingHoursData;
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
  town?: string;
  services_list?: string[];
  specialists?: string[];
  working_hours?: Record<string, unknown>;
  contact_info?: {
    phone?: string;
    email?: string;
  };
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const INITIAL_WORKING_HOURS: WorkingHoursData = Object.fromEntries(
  DAYS.map((day) => [
    day,
    {
      open: day === "Sunday" ? "" : "08:00",
      close: day === "Sunday" ? "" : "17:00",
      closed: day === "Sunday",
    },
  ]),
);

const INITIAL_FORM_DATA: FacilityFormData = {
  facility_name: "",
  facility_type: "",
  hfr_id: "",
  town: "",
  contact_number: "",
  contact_email: "",
  state: "Rivers",
  lga: "",
  street_address: "",
  latitude: "",
  longitude: "",
  services_list: "",
  specialists: "",
  working_hours: INITIAL_WORKING_HOURS,
};

function parseWorkingHours(wh: Record<string, unknown>): WorkingHoursData {
  const result = { ...INITIAL_WORKING_HOURS };
  Object.entries(wh).forEach(([day, value]) => {
    const key = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
    if (typeof value === "object" && value !== null) {
      const v = value as Record<string, unknown>;
      const closed = Boolean(v.is_closed ?? v.closed ?? false);
      const open = String(v.open ?? v.opening_time ?? v.start ?? "");
      const close = String(v.close ?? v.closing_time ?? v.end ?? "");
      result[key] = { open, close, closed };
    } else if (typeof value === "string") {
      const parts = value.split(/\s*[-–]\s*/);
      result[key] = {
        open: parts[0]?.trim() ?? "",
        close: parts[1]?.trim() ?? "",
        closed: !value.trim(),
      };
    }
  });
  return result;
}

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

  useEffect(() => {
    if (isOpen) {
      if (facility) {
        setFormData({
          facility_name: facility.facility_name ?? "",
          facility_type: facility.facility_type ?? facility.facility_category ?? "",
          hfr_id: facility.hfr_id ?? "",
          town: facility.town ?? "",
          contact_number: facility.contact_info?.phone ?? "",
          contact_email: facility.contact_info?.email ?? "",
          state: facility.state ?? "Rivers",
          lga:
            RIVERS_STATE_LGAS.find(
              (l) => l.label === (facility.facility_lga ?? facility.lga ?? ""),
            )?.value ?? "",
          street_address: facility.address ?? facility.street_address ?? "",
          latitude: facility.lat?.toString() ?? "",
          longitude: facility.lon?.toString() ?? "",
          services_list: (facility.services_list ?? []).join("\n"),
          specialists: (facility.specialists ?? []).join("\n"),
          working_hours:
            facility.working_hours && Object.keys(facility.working_hours).length > 0
              ? parseWorkingHours(facility.working_hours)
              : INITIAL_WORKING_HOURS,
        });
      } else {
        setFormData(INITIAL_FORM_DATA);
      }
    }
  }, [facility, isOpen]);

  const handleClose = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    onClose();
  }, [onClose]);

  const createMutation = useMutation({
    mutationFn: async (data: FacilityFormData) => {
      const response = await apiClient.post("/facilities/", {
        facility_name: data.facility_name,
        facility_category: data.facility_type || null,
        hfr_id: data.hfr_id || null,
        town: data.town || null,
        lga_id: parseInt(data.lga, 10),
        address: data.street_address || null,
        services_list: data.services_list
          ? data.services_list.split("\n").map((s) => s.trim()).filter(Boolean)
          : [],
        specialists: data.specialists
          ? data.specialists.split("\n").map((s) => s.trim()).filter(Boolean)
          : [],
        contact_info: {
          phone: data.contact_number,
          email: data.contact_email,
        },
        working_hours: serializeWorkingHours(data.working_hours),
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
      toast.error(typeof detail === "string" ? detail : "Failed to add facility");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: FacilityFormData) => {
      const lgaId = data.lga ? parseInt(data.lga, 10) : undefined;
      const response = await apiClient.patch(
        `/admin/facility/profile/${facility?.facility_id}`,
        {
          facility_name: data.facility_name,
          facility_category: data.facility_type,
          hfr_id: data.hfr_id || undefined,
          town: data.town || undefined,
          ...(lgaId ? { lga_id: lgaId } : {}),
          address: data.street_address,
          services_list: data.services_list
            ? data.services_list.split("\n").map((s) => s.trim()).filter(Boolean)
            : [],
          specialists: data.specialists
            ? data.specialists.split("\n").map((s) => s.trim()).filter(Boolean)
            : [],
          contact_info: {
            phone: data.contact_number,
            email: data.contact_email,
          },
          working_hours: serializeWorkingHours(data.working_hours),
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
      toast.error(typeof detail === "string" ? detail : "Failed to update facility");
    },
  });

  const handleInputChange = useCallback(
    (field: keyof FacilityFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field as string]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field as string];
          return next;
        });
      }
    },
    [errors],
  );

  const handleWorkingHoursChange = useCallback(
    (day: string, field: "open" | "close" | "closed", value: string | boolean) => {
      setFormData((prev) => ({
        ...prev,
        working_hours: {
          ...prev.working_hours,
          [day]: {
            ...prev.working_hours[day],
            [field]: value,
          },
        },
      }));
    },
    [],
  );

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.facility_name.trim()) {
      newErrors.facility_name = "Facility name is required";
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
    handleWorkingHoursChange,
    handleSubmit,
    handleClose,
  };
}

function serializeWorkingHours(wh: WorkingHoursData): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(wh).map(([day, schedule]) => [
      day,
      schedule.closed
        ? { is_closed: true }
        : { open: schedule.open, close: schedule.close },
    ]),
  );
}
