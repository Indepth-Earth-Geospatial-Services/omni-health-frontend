"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Save, AlertCircle } from "lucide-react";
import type { StaffMember } from "@/services/admin.service";

interface EditStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (staffData: Record<string, any>) => void;
  facilityId: string;
  staffData: StaffMember | null;
  isUpdating?: boolean;
}

interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "select" | "date" | "tel" | "number" | "textarea" | "email";
  placeholder?: string;
  required?: boolean;
  options?: string[];
  fullWidth?: boolean;
}

// All staff form fields — matches table columns exactly
const FORM_FIELDS: FieldConfig[] = [
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
    label: "Sex",
    type: "select",
    options: ["M", "F"],
  },
  {
    name: "rank_cadre",
    label: "Rank/Cadre",
    type: "text",
    placeholder: "Enter rank or cadre",
  },
  {
    name: "grade_level",
    label: "Grade Level (G/L)",
    type: "text",
    placeholder: "e.g. GL 08",
  },
  {
    name: "qualifications",
    label: "Qualifications",
    type: "text",
    placeholder: "e.g. BSc Nursing, RN (comma separated)",
    fullWidth: true,
  },
  {
    name: "qualification_date",
    label: "Qualification Date",
    type: "date",
  },
  {
    name: "date_first_appointment",
    label: "Date of First Appointment",
    type: "date",
  },
  {
    name: "confirmation_of_appointment",
    label: "Confirmation of Appointment",
    type: "date",
  },
  {
    name: "date_of_present_appointment",
    label: "Date of Present Appointment",
    type: "date",
  },
  {
    name: "date_of_birth",
    label: "Date of Birth",
    type: "date",
  },
  {
    name: "lga_of_origin",
    label: "LGA of Origin",
    type: "text",
    placeholder: "Enter LGA of origin",
  },
  {
    name: "years_in_present_station",
    label: "Years in Present Station",
    type: "number",
    placeholder: "e.g. 3",
  },
  {
    name: "phone_number",
    label: "Phone Number",
    type: "tel",
    placeholder: "Enter phone number",
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "Enter email address",
  },
  {
    name: "is_active",
    label: "Status",
    type: "select",
    options: ["Active", "Inactive"],
  },
  {
    name: "remark",
    label: "Remark",
    type: "textarea",
    placeholder: "Any additional remarks",
    fullWidth: true,
  },
];

const EditStaffModal = ({
  isOpen,
  onClose,
  onSubmit,
  staffData,
  isUpdating = false,
}: EditStaffModalProps) => {
  const getInitialFormData = (): Record<string, any> => {
    if (!staffData) return {};

    // Flatten qualifications object → comma-separated string for editing
    let qualificationsStr = "";
    if (staffData.qualifications && typeof staffData.qualifications === "object") {
      qualificationsStr = Object.keys(staffData.qualifications).join(", ");
    }

    return {
      full_name: staffData.full_name || "",
      gender: staffData.gender || "",
      rank_cadre: staffData.rank_cadre || "",
      grade_level: staffData.grade_level || "",
      qualifications: qualificationsStr,
      qualification_date: staffData.qualification_date || "",
      date_first_appointment: staffData.date_first_appointment || "",
      confirmation_of_appointment: staffData.confirmation_of_appointment || "",
      date_of_present_appointment: staffData.date_of_present_appointment || "",
      date_of_birth: staffData.date_of_birth || "",
      lga_of_origin: staffData.lga_of_origin || "",
      years_in_present_station:
        staffData.years_in_present_station !== undefined &&
        staffData.years_in_present_station !== null
          ? String(staffData.years_in_present_station)
          : "",
      phone_number: staffData.phone_number || "",
      email: staffData.email || "",
      is_active: staffData.is_active ? "Active" : "Inactive",
      remark: staffData.remark || "",
    };
  };

  const [formData, setFormData] = useState<Record<string, any>>(getInitialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    name: string,
  ) => {
    setFormData((prev) => ({ ...prev, [name]: e.target.value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (errors[name]) {
      setErrors((prev) => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const field = FORM_FIELDS.find((f) => f.name === name);
    if (field?.required && !formData[name]?.toString().trim()) {
      setErrors((prev) => ({ ...prev, [name]: `${field.label} is required` }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    FORM_FIELDS.forEach((field) => {
      if (field.required && !formData[field.name]?.toString().trim()) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Mark all required fields as touched
    const allTouched: Record<string, boolean> = {};
    FORM_FIELDS.forEach((f) => { allTouched[f.name] = true; });
    setTouched(allTouched);

    if (!validateForm()) return;

    const payload: Record<string, any> = {};

    if (formData.full_name?.trim())
      payload.full_name = formData.full_name.trim();
    if (formData.gender?.trim()) payload.gender = formData.gender.trim();
    if (formData.rank_cadre?.trim())
      payload.rank_cadre = formData.rank_cadre.trim();
    if (formData.grade_level?.trim())
      payload.grade_level = formData.grade_level.trim();
    if (formData.qualification_date)
      payload.qualification_date = formData.qualification_date;
    if (formData.date_first_appointment)
      payload.date_first_appointment = formData.date_first_appointment;
    if (formData.confirmation_of_appointment)
      payload.confirmation_of_appointment = formData.confirmation_of_appointment;
    if (formData.date_of_present_appointment)
      payload.date_of_present_appointment = formData.date_of_present_appointment;
    if (formData.date_of_birth) payload.date_of_birth = formData.date_of_birth;
    if (formData.lga_of_origin?.trim())
      payload.lga_of_origin = formData.lga_of_origin.trim();
    if (formData.years_in_present_station !== "") {
      const num = Number(formData.years_in_present_station);
      if (!isNaN(num)) payload.years_in_present_station = num;
    }
    if (formData.phone_number?.trim())
      payload.phone_number = formData.phone_number.trim();
    if (formData.email?.trim()) payload.email = formData.email.trim();
    if (formData.remark?.trim()) payload.remark = formData.remark.trim();

    // Boolean conversion
    if (formData.is_active) {
      payload.is_active = formData.is_active === "Active";
    }

    // Qualifications: comma-separated string → object
    if (formData.qualifications?.trim()) {
      const qualArr = formData.qualifications
        .split(",")
        .map((q: string) => q.trim())
        .filter(Boolean);
      const qualObj: Record<string, any> = {};
      qualArr.forEach((q: string) => { qualObj[q] = {}; });
      payload.qualifications = qualObj;
    }

    onSubmit(payload);
  };

  const handleClose = () => {
    if (!isUpdating) onClose();
  };

  const inputBase =
    "w-full rounded-lg border border-slate-200 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50";
  const inputError =
    "border-red-400 focus:ring-red-300";

  const renderField = (field: FieldConfig) => {
    const hasError = touched[field.name] && errors[field.name];

    if (field.type === "select") {
      return (
        <select
          value={formData[field.name] || ""}
          onChange={(e) => handleSelectChange(e, field.name)}
          onBlur={() => handleBlur(field.name)}
          disabled={isUpdating}
          className={`${inputBase} ${hasError ? inputError : ""}`}
        >
          <option value="">Select {field.label}</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === "textarea") {
      return (
        <textarea
          id={field.name}
          name={field.name}
          value={formData[field.name] || ""}
          onChange={handleInputChange}
          onBlur={() => handleBlur(field.name)}
          placeholder={field.placeholder}
          rows={3}
          disabled={isUpdating}
          className={`${inputBase} resize-none ${hasError ? inputError : ""}`}
        />
      );
    }

    return (
      <input
        type={field.type}
        id={field.name}
        name={field.name}
        value={formData[field.name] || ""}
        onChange={handleInputChange}
        onBlur={() => handleBlur(field.name)}
        placeholder={field.placeholder}
        disabled={isUpdating}
        min={field.type === "number" ? "0" : undefined}
        className={`${inputBase} ${hasError ? inputError : ""}`}
      />
    );
  };

  const renderFieldWithLabel = (field: FieldConfig) => {
    const hasError = touched[field.name] && errors[field.name];
    return (
      <div key={field.name}>
        <label
          htmlFor={field.name}
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          {field.label}
          {field.required && <span className="ml-1 text-red-500">*</span>}
        </label>
        {renderField(field)}
        {hasError && (
          <div className="mt-1 flex items-center gap-1">
            <AlertCircle size={13} className="text-red-500" />
            <span className="text-xs text-red-500">{errors[field.name]}</span>
          </div>
        )}
      </div>
    );
  };

  const fullWidthFields = FORM_FIELDS.filter((f) => f.fullWidth);
  const twoColFields = FORM_FIELDS.filter((f) => !f.fullWidth);

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
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="flex h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* ── Sticky Header ── */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Edit Staff Member
                </h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  Update details for{" "}
                  <span className="font-medium text-slate-700">
                    {staffData?.full_name || "staff member"}
                  </span>
                </p>
              </div>
              <button
                onClick={handleClose}
                disabled={isUpdating}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* ── Scrollable Form Body ── */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-1 flex-col overflow-hidden"
            >
              <div className="flex-1 space-y-4 overflow-y-auto p-6">
                {/* Full-width fields */}
                {fullWidthFields.map(renderFieldWithLabel)}

                {/* Two-column grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {twoColFields.map(renderFieldWithLabel)}
                </div>
              </div>

              {/* ── Sticky Footer ── */}
              <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 bg-white px-6 py-4">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isUpdating}
                  className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={15} />
                      Update Staff
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditStaffModal;
