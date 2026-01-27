"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Save } from "lucide-react";
import { useStaffSchema } from "@/hooks/use-admin-staff";
import type { StaffMember } from "@/services/admin.service";

interface EditStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (staffData: Record<string, any>) => void;
  facilityId: string;
  staffData: StaffMember | null;
  isUpdating?: boolean;
}

// Field metadata for form generation
interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "select" | "date" | "tel" | "number" | "textarea" | "email";
  placeholder?: string;
  required?: boolean;
  options?: string[];
  fullWidth?: boolean;
}

const EditStaffModal = ({
  isOpen,
  onClose,
  onSubmit,
  facilityId,
  staffData,
  isUpdating = false,
}: EditStaffModalProps) => {
  const { data: schema, isLoading: isLoadingSchema } =
    useStaffSchema(facilityId);

  // Define form fields configuration
  const formFields: FieldConfig[] = [
    {
      name: "full_name",
      label: "Full Name",
      type: "text",
      placeholder: "Enter full name",
      required: true,
      fullWidth: true,
    },
    {
      name: "gender",
      label: "Gender",
      type: "select",
      options: ["M", "F"],
      required: false,
    },
    {
      name: "rank_cadre",
      label: "Rank/Cadre",
      type: "text",
      placeholder: "Enter rank",
      required: false,
    },
    {
      name: "grade_level",
      label: "Grade Level",
      type: "text",
      placeholder: "Enter grade level",
      required: false,
    },
    {
      name: "qualifications",
      label: "Qualifications",
      type: "text",
      placeholder: "e.g., BSc Nursing, MSc Public Health (comma separated)",
      required: false,
      fullWidth: true,
    },
    {
      name: "phone_number",
      label: "Phone Number",
      type: "tel",
      placeholder: "Enter phone number",
      required: false,
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "Enter email",
      required: false,
    },
    {
      name: "date_first_appointment",
      label: "Date of First Appointment",
      type: "date",
      required: false,
    },
    {
      name: "date_of_birth",
      label: "Date of Birth",
      type: "date",
      required: false,
    },
    {
      name: "is_active",
      label: "Status",
      type: "select",
      options: ["Active", "Inactive"],
      required: false,
    },
  ];

  // Filter fields based on schema if available
  const availableFields = schema
    ? formFields.filter((field) => {
        if (field.name === "full_name" || field.name === "is_active")
          return true;
        return schema.hasOwnProperty(field.name);
      })
    : formFields;

  // Initialize form data from staffData prop - no useEffect needed!
  const getInitialFormData = () => {
    if (!staffData) return {};

    const data: Record<string, any> = {
      full_name: staffData.full_name || "",
      gender: staffData.gender || "",
      rank_cadre: staffData.rank_cadre || "",
      grade_level: staffData.grade_level || "",
      phone_number: staffData.phone_number || "",
      email: staffData.email || "",
      date_first_appointment: staffData.date_first_appointment || "",
      date_of_birth: staffData.date_of_birth || "",
      is_active: staffData.is_active ? "Active" : "Inactive",
    };

    // Handle qualifications - convert object to comma-separated string
    if (
      staffData.qualifications &&
      typeof staffData.qualifications === "object"
    ) {
      const qualArray = Object.keys(staffData.qualifications);
      data.qualifications = qualArray.join(", ");
    } else {
      data.qualifications = "";
    }

    return data;
  };

  const [formData, setFormData] =
    useState<Record<string, any>>(getInitialFormData);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Build the update payload according to schema
    const updatePayload: Record<string, any> = {};

    // Only include fields that have values
    if (formData.full_name?.trim()) {
      updatePayload.full_name = formData.full_name.trim();
    }

    if (formData.gender?.trim()) {
      updatePayload.gender = formData.gender.trim();
    }

    if (formData.rank_cadre?.trim()) {
      updatePayload.rank_cadre = formData.rank_cadre.trim();
    }

    if (formData.grade_level?.trim()) {
      updatePayload.grade_level = formData.grade_level.trim();
    }

    if (formData.phone_number?.trim()) {
      updatePayload.phone_number = formData.phone_number.trim();
    }

    if (formData.email?.trim()) {
      updatePayload.email = formData.email.trim();
    }

    if (formData.date_first_appointment) {
      updatePayload.date_first_appointment = formData.date_first_appointment;
    }

    if (formData.date_of_birth) {
      updatePayload.date_of_birth = formData.date_of_birth;
    }

    // Handle is_active (convert string to boolean)
    if (formData.is_active) {
      updatePayload.is_active = formData.is_active === "Active";
    }

    // Handle qualifications (convert comma-separated string to object)
    if (
      formData.qualifications &&
      typeof formData.qualifications === "string"
    ) {
      const qualString = formData.qualifications.trim();
      if (qualString) {
        const qualArray = qualString
          .split(",")
          .map((q) => q.trim())
          .filter(Boolean);
        const qualObj: Record<string, any> = {};
        qualArray.forEach((qual) => {
          qualObj[qual] = {};
        });
        updatePayload.qualifications = qualObj;
      }
    }

    console.log("Update Payload:", updatePayload); // Debug log

    onSubmit(updatePayload);
  };

  const handleClose = () => {
    if (!isUpdating) {
      onClose();
    }
  };

  const renderField = (field: FieldConfig) => {
    switch (field.type) {
      case "select":
        return (
          <select
            value={formData[field.name] || ""}
            onChange={(e) => handleSelectChange(field.name, e.target.value)}
            className="focus:ring-primary w-full rounded-lg border border-slate-200 bg-gray-100 px-4 py-2.5 text-sm transition-all focus:border-transparent focus:ring-2 focus:outline-none"
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "textarea":
        return (
          <textarea
            id={field.name}
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleInputChange}
            placeholder={field.placeholder}
            rows={3}
            className="focus:ring-primary w-full resize-none rounded-lg border border-slate-200 bg-gray-100 px-4 py-2.5 text-sm transition-all focus:border-transparent focus:ring-2 focus:outline-none"
          />
        );

      default:
        return (
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleInputChange}
            placeholder={field.placeholder}
            required={field.required}
            min={field.type === "number" ? "0" : undefined}
            className="focus:ring-primary w-full rounded-lg border border-slate-200 bg-gray-100 px-4 py-2.5 text-sm transition-all focus:border-transparent focus:ring-2 focus:outline-none"
          />
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Edit Staff Member
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Update information for{" "}
                  {staffData?.full_name || "staff member"}
                </p>
              </div>
              <button
                onClick={handleClose}
                disabled={isUpdating}
                className="rounded-lg p-2 transition-colors hover:bg-slate-100 disabled:opacity-50"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>

            {/* Form Content */}
            <div className="max-h-[calc(90vh-180px)] overflow-y-auto p-6">
              {isLoadingSchema ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="text-primary h-8 w-8 animate-spin" />
                    <p className="text-sm text-slate-500">Loading form...</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Full width fields */}
                  {availableFields
                    .filter((field) => field.fullWidth)
                    .map((field) => (
                      <div key={field.name}>
                        <label
                          htmlFor={field.name}
                          className="mb-2 block text-sm font-medium text-slate-700"
                        >
                          {field.label}
                          {field.required && (
                            <span className="ml-1 text-red-500">*</span>
                          )}
                        </label>
                        {renderField(field)}
                      </div>
                    ))}

                  {/* Two column layout for non-full-width fields */}
                  <div className="grid grid-cols-2 gap-4">
                    {availableFields
                      .filter((field) => !field.fullWidth)
                      .map((field) => (
                        <div key={field.name}>
                          <label
                            htmlFor={field.name}
                            className="mb-2 block text-sm font-medium text-slate-700"
                          >
                            {field.label}
                            {field.required && (
                              <span className="ml-1 text-red-500">*</span>
                            )}
                          </label>
                          {renderField(field)}
                        </div>
                      ))}
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Update Staff
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditStaffModal;
