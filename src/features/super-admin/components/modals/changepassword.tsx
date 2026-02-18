"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  X,
  ChevronDown,
  ArrowRight,
  User,
  Phone,
  Mail,
  Building2,
  Check,
  Loader2,
  Award,
  Calendar,
  Briefcase,
  Hash,
  ToggleLeft,
} from "lucide-react";
import { Button } from "@/features/admin/components/ui/button";
import { apiClient } from "@/lib/client";
import { cn } from "@/lib/utils";
import { superAdminService } from "@/features/super-admin/services/super-admin.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateStaffRequest } from "@/features/super-admin/services/super-admin.service";
import { toast } from "sonner";
import { useSuperAdminStaffSchema } from "@/features/super-admin/hooks/seStaffQuery";
import type { LucideIcon } from "lucide-react";

interface Facility {
  facility_id: string;
  facility_name: string;
}

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FieldConfig {
  label: string;
  type: "text" | "tel" | "date" | "select";
  required?: boolean;
  fullWidth?: boolean;
  icon?: LucideIcon;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

// Map of known field configurations — only fields present in schema will be rendered
const FIELD_CONFIG_MAP: Record<string, FieldConfig> = {
  old_password: {
    label: "Full Name",
    type: "text",
    required: true,
    fullWidth: true,
    icon: User,
    placeholder: "Enter full name",
  },
  new_password: {
    label: "Email Address",
    type: "text",
    required: false,
    fullWidth: true,
    icon: Mail,
    placeholder: "Enter email (optional)",
  },
};

// Fields that should always appear even if not in schema
const ALWAYS_SHOW_FIELDS = ["full_name"];

const AddStaffModal: React.FC<AddStaffModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(false);
  const [isFacilityDropdownOpen, setIsFacilityDropdownOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFacilityId, setSelectedFacilityId] = useState("");

  const facilityDropdownRef = useRef<HTMLDivElement>(null);
  const selectDropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Fetch schema dynamically based on selected facility
  const { data: schema, isLoading: schemaLoading } = useSuperAdminStaffSchema(
    selectedFacilityId || undefined,
  );

  // Determine which fields to render based on schema
  const fieldsToRender = useMemo(() => {
    const schemaKeys = schema ? Object.keys(schema) : [];
    const fieldKeys = schema
      ? schemaKeys.filter(
          (key) => FIELD_CONFIG_MAP[key] || ALWAYS_SHOW_FIELDS.includes(key),
        )
      : Object.keys(FIELD_CONFIG_MAP);

    // Ensure always-show fields are present
    ALWAYS_SHOW_FIELDS.forEach((key) => {
      if (!fieldKeys.includes(key)) fieldKeys.unshift(key);
    });

    return fieldKeys;
  }, [schema]);

  // Initialize form data when fields change
  useEffect(() => {
    setFormData((prev) => {
      const next: Record<string, string> = {};
      fieldsToRender.forEach((key) => {
        next[key] = prev[key] || "";
      });
      return next;
    });
  }, [fieldsToRender]);

  // Create staff mutation
  const createStaffMutation = useMutation({
    mutationFn: async (data: {
      facilityId: string;
      staffData: CreateStaffRequest;
    }) => {
      return await superAdminService.createStaff(
        data.facilityId,
        data.staffData,
      );
    },
    onSuccess: (data) => {
      toast.success("Staff member added successfully!", {
        description: `${data.full_name} has been added to the facility.`,
      });
      queryClient.invalidateQueries({ queryKey: ["all-staff"] });
      onSuccess?.();
      handleClose();
    },
    onError: (error: unknown) => {
      console.error("Failed to add staff:", error);
      const err = error as {
        response?: {
          data?: {
            message?: string;
            detail?: Array<{ loc: string[]; msg: string }>;
          };
        };
      };
      toast.error("Failed to add staff member", {
        description:
          err.response?.data?.message || "Please check the form and try again.",
      });
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          const newErrors: Record<string, string> = {};
          err.response.data.detail.forEach((detail) => {
            const field = detail.loc[detail.loc.length - 1];
            newErrors[field] = detail.msg;
          });
          setErrors(newErrors);
        }
      }
    },
  });

  // Fetch facilities when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchFacilities();
    }
  }, [isOpen]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        facilityDropdownRef.current &&
        !facilityDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFacilityDropdownOpen(false);
      }
      if (openDropdown) {
        const ref = selectDropdownRefs.current[openDropdown];
        if (ref && !ref.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      }
    }

    if (isFacilityDropdownOpen || openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFacilityDropdownOpen, openDropdown]);

  const fetchFacilities = async () => {
    setLoadingFacilities(true);
    try {
      const response = await apiClient.get("/facilities", {
        params: { limit: 100 },
      });
      setFacilities(response.data.facilities || response.data || []);
    } catch (error) {
      console.error("Failed to fetch facilities:", error);
      setFacilities([]);
    } finally {
      setLoadingFacilities(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (fieldKey: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldKey]: value }));
    setOpenDropdown(null);
    if (errors[fieldKey]) {
      setErrors((prev) => ({ ...prev, [fieldKey]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name?.trim()) {
      newErrors.full_name = "Full name is required";
    }
    if (!selectedFacilityId) {
      newErrors.facility_id = "Facility is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Build staff data dynamically from form
    const staffData: CreateStaffRequest = {
      full_name: formData.full_name,
    };

    fieldsToRender.forEach((key) => {
      if (key === "full_name") return; // already added
      const value = formData[key]?.trim();
      if (!value) return;

      if (key === "qualifications") {
        // Convert comma-separated string to { "MBBS": {}, "BSc": {} } format
        const quals: Record<string, Record<string, never>> = {};
        value.split(",").forEach((q) => {
          const trimmed = q.trim();
          if (trimmed) quals[trimmed] = {};
        });
        if (Object.keys(quals).length > 0) {
          staffData.qualifications = quals;
        }
      } else if (key === "is_active") {
        staffData.is_active = value === "true";
      } else {
        (staffData as unknown as Record<string, unknown>)[key] = value;
      }
    });

    createStaffMutation.mutate({
      facilityId: selectedFacilityId,
      staffData,
    });
  };

  const handleClose = () => {
    setFormData({});
    setSelectedFacilityId("");
    setErrors({});
    setIsFacilityDropdownOpen(false);
    setOpenDropdown(null);
    onClose();
  };

  if (!isOpen) return null;

  const selectedFacility = facilities.find(
    (f) => f.facility_id === selectedFacilityId,
  );

  const renderField = (fieldKey: string) => {
    const config = FIELD_CONFIG_MAP[fieldKey];
    if (!config) {
      // Unknown field from schema — render as a generic text input
      return (
        <div key={fieldKey}>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            {fieldKey
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase())}
          </label>
          <input
            type="text"
            name={fieldKey}
            value={formData[fieldKey] || ""}
            onChange={handleInputChange}
            placeholder={`Enter ${fieldKey.replace(/_/g, " ")}`}
            className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:ring-2 focus:outline-none"
          />
        </div>
      );
    }

    const Icon = config.icon;
    const isRequired = config.required;
    const isFullWidth = config.fullWidth;

    // Select fields
    if (config.type === "select" && config.options) {
      const selectedOption = config.options.find(
        (o) => o.value === formData[fieldKey],
      );

      return (
        <div
          key={fieldKey}
          className={isFullWidth ? "col-span-2" : ""}
          ref={(el) => {
            selectDropdownRefs.current[fieldKey] = el;
          }}
        >
          <label className="mb-2 block text-sm font-medium text-slate-700">
            {config.label}
            {isRequired && <span className="text-red-500"> *</span>}
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setOpenDropdown(openDropdown === fieldKey ? null : fieldKey)
              }
              className={cn(
                "focus:border-primary focus:ring-primary/20 flex w-full items-center justify-between rounded-lg border bg-white px-4 py-3 text-sm text-slate-600 transition-colors hover:border-slate-400 focus:ring-2 focus:outline-none",
                errors[fieldKey] ? "border-red-500" : "border-slate-300",
              )}
            >
              <span
                className={selectedOption ? "text-slate-800" : "text-slate-400"}
              >
                {selectedOption?.label ||
                  `Select ${config.label.toLowerCase()}`}
              </span>
              <ChevronDown
                size={16}
                className={cn(
                  "text-slate-400 transition-transform",
                  openDropdown === fieldKey && "rotate-180",
                )}
              />
            </button>

            {openDropdown === fieldKey && (
              <div className="absolute top-full z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
                {config.options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelectChange(fieldKey, option.value)}
                    className={cn(
                      "flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-slate-50",
                      formData[fieldKey] === option.value &&
                        "bg-primary/5 text-primary font-medium",
                    )}
                  >
                    <span>{option.label}</span>
                    {formData[fieldKey] === option.value && <Check size={16} />}
                  </button>
                ))}
              </div>
            )}
          </div>
          {errors[fieldKey] && (
            <p className="mt-1 text-xs text-red-500">{errors[fieldKey]}</p>
          )}
        </div>
      );
    }

    // Text, tel, date fields
    return (
      <div key={fieldKey} className={isFullWidth ? "col-span-2" : ""}>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {config.label}
          {isRequired && <span className="text-red-500"> *</span>}
        </label>
        <div className="relative">
          {Icon && (
            <Icon
              size={18}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
            />
          )}
          <input
            type={config.type}
            name={fieldKey}
            value={formData[fieldKey] || ""}
            onChange={handleInputChange}
            placeholder={config.placeholder}
            className={cn(
              "focus:border-primary focus:ring-primary/20 w-full rounded-lg border bg-white py-3 text-sm text-slate-600 transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:ring-2 focus:outline-none",
              Icon ? "pr-4 pl-10" : "px-4",
              errors[fieldKey] ? "border-red-500" : "border-slate-300",
            )}
          />
        </div>
        {errors[fieldKey] && (
          <p className="mt-1 text-xs text-red-500">{errors[fieldKey]}</p>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800">
            Add New Staff
          </h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Facility Selector — always shown first */}
            <div className="col-span-2" ref={facilityDropdownRef}>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Facility <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setIsFacilityDropdownOpen(!isFacilityDropdownOpen)
                  }
                  disabled={loadingFacilities}
                  className={cn(
                    "focus:border-primary focus:ring-primary/20 flex w-full items-center justify-between rounded-lg border bg-white px-4 py-3 text-sm text-slate-600 transition-colors hover:border-slate-400 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                    errors.facility_id ? "border-red-500" : "border-slate-300",
                  )}
                >
                  <span className="flex items-center gap-2">
                    {loadingFacilities ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Loading facilities...
                      </>
                    ) : selectedFacility ? (
                      <>
                        <Building2 size={16} className="text-primary" />
                        <span className="text-slate-800">
                          {selectedFacility.facility_name}
                        </span>
                      </>
                    ) : (
                      <span className="text-slate-400">Select a facility</span>
                    )}
                  </span>
                  <ChevronDown
                    size={16}
                    className={cn(
                      "text-slate-400 transition-transform",
                      isFacilityDropdownOpen && "rotate-180",
                    )}
                  />
                </button>

                {isFacilityDropdownOpen && !loadingFacilities && (
                  <div className="absolute top-full z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
                    {facilities.length === 0 ? (
                      <div className="px-4 py-3 text-center text-sm text-slate-500">
                        No facilities available
                      </div>
                    ) : (
                      facilities.map((facility) => (
                        <button
                          key={facility.facility_id}
                          type="button"
                          onClick={() => {
                            setSelectedFacilityId(facility.facility_id);
                            setIsFacilityDropdownOpen(false);
                            if (errors.facility_id) {
                              setErrors((prev) => ({
                                ...prev,
                                facility_id: "",
                              }));
                            }
                          }}
                          className={cn(
                            "flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-slate-50",
                            selectedFacilityId === facility.facility_id &&
                              "bg-primary/5 text-primary font-medium",
                          )}
                        >
                          <Building2
                            size={16}
                            className="shrink-0 text-slate-400"
                          />
                          {facility.facility_name}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              {errors.facility_id && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.facility_id}
                </p>
              )}
            </div>

            {/* Schema loading indicator */}
            {schemaLoading && selectedFacilityId && (
              <div className="col-span-2 flex items-center justify-center gap-2 py-4 text-sm text-slate-500">
                <Loader2 size={16} className="animate-spin" />
                Loading form fields...
              </div>
            )}

            {/* Dynamic fields from schema */}
            {fieldsToRender.map((fieldKey) => renderField(fieldKey))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-200 p-6">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={createStaffMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createStaffMutation.isPending}
            className="flex items-center gap-2"
          >
            {createStaffMutation.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Adding...
              </>
            ) : (
              <>
                Add Staff
                <ArrowRight size={16} />
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default AddStaffModal;
