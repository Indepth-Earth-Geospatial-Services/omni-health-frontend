"use client";

import React, { useState, useMemo, useCallback } from "react";
import { ArrowRight, X, Loader2, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useStaffSchema } from "@/hooks/use-admin-staff";

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (staffData: any) => void;
  facilityId: string;
  isSubmitting?: boolean;
}

interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "select" | "date" | "tel" | "number" | "textarea" | "email";
  placeholder?: string;
  required?: boolean;
  options?: string[];
  fullWidth?: boolean;
  validation?: {
    pattern?: RegExp;
    message?: string;
    minLength?: number;
    maxLength?: number;
  };
}

interface FieldError {
  [key: string]: string;
}

/**
 * Maps schema field names to user-friendly labels
 */
const fieldLabelMap: Record<string, string> = {
  full_name: "Full Name",
  gender: "Gender",
  rank_cadre: "Rank/Cadre",
  grade_level: "Grade Level",
  phone_number: "Phone Number",
  email: "Email Address",
  date_first_appointment: "Date of First Appointment",
  date_of_birth: "Date of Birth",
  qualifications: "Qualifications",
  is_active: "Status",
  remark: "Remark",
  presentAppt: "Date of Present Appointment",
  stateOrigin: "State/LGA of Origin",
  yearsInStation: "Years in Present Station",
};

/**
 * Maps schema field names to input types
 */
const fieldTypeMap: Record<string, FieldConfig["type"]> = {
  full_name: "text",
  gender: "select",
  rank_cadre: "text",
  grade_level: "text",
  phone_number: "tel",
  email: "email",
  date_first_appointment: "date",
  date_of_birth: "date",
  qualifications: "text",
  is_active: "select",
  remark: "textarea",
  presentAppt: "date",
  stateOrigin: "text",
  yearsInStation: "number",
};

/**
 * Field options for select fields
 */
const fieldOptionsMap: Record<string, string[]> = {
  gender: ["M", "F"],
  is_active: ["Active", "Inactive"],
};

/**
 * Validation rules for fields
 */
const fieldValidationMap: Record<string, FieldConfig["validation"]> = {
  full_name: {
    minLength: 2,
    message: "Full name must be at least 2 characters",
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
  },
  phone_number: {
    pattern: /^[\d\s+()-]{7,20}$/,
    message: "Please enter a valid phone number",
  },
};

/**
 * Fields that should be full width
 */
const fullWidthFields = ["full_name", "remark", "qualifications"];

/**
 * Fields that are required
 */
const requiredFields = ["full_name"];

/**
 * Field display order
 */
const fieldOrder = [
  "full_name",
  "gender",
  "rank_cadre",
  "grade_level",
  "phone_number",
  "email",
  "date_first_appointment",
  "presentAppt",
  "date_of_birth",
  "stateOrigin",
  "yearsInStation",
  "qualifications",
  "is_active",
  "remark",
];

const AddStaffModal: React.FC<AddStaffModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  facilityId,
  isSubmitting = false,
}) => {
  const {
    data: schema,
    isLoading: isLoadingSchema,
    isError: isSchemaError,
  } = useStaffSchema(facilityId);

  // Initialize form data based on schema - computed value, not state effect
  const initialFormData = useMemo(() => {
    if (!schema) return {};
    const initialData: Record<string, any> = {};
    Object.keys(schema).forEach((key) => {
      initialData[key] = "";
    });
    return initialData;
  }, [schema]);

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<FieldError>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Generate form fields dynamically from schema
  const formFields: FieldConfig[] = useMemo(() => {
    if (!schema) return [];

    const schemaKeys = Object.keys(schema);

    // Sort fields based on predefined order
    const sortedKeys = [...schemaKeys].sort((a, b) => {
      const indexA = fieldOrder.indexOf(a);
      const indexB = fieldOrder.indexOf(b);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    return sortedKeys.map((key) => ({
      name: key,
      label:
        fieldLabelMap[key] ||
        key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      type: fieldTypeMap[key] || "text",
      placeholder: `Enter ${fieldLabelMap[key]?.toLowerCase() || key.replace(/_/g, " ")}`,
      required: requiredFields.includes(key),
      options: fieldOptionsMap[key],
      fullWidth: fullWidthFields.includes(key),
      validation: fieldValidationMap[key],
    }));
  }, [schema]);

  // Initialize form when modal opens - using event handler instead of effect
  if (isOpen && !isInitialized && Object.keys(initialFormData).length > 0) {
    setFormData(initialFormData);
    setErrors({});
    setTouched({});
    setIsInitialized(true);
  }

  // Reset initialized flag when modal closes
  if (!isOpen && isInitialized) {
    setIsInitialized(false);
  }

  // Validate a single field
  const validateField = useCallback(
    (name: string, value: any): string => {
      const field = formFields.find((f) => f.name === name);
      if (!field) return "";

      // Required validation
      if (field.required && (!value || value.toString().trim() === "")) {
        return `${field.label} is required`;
      }

      // Skip other validations if field is empty and not required
      if (!value || value.toString().trim() === "") return "";

      // Pattern validation
      if (field.validation?.pattern && !field.validation.pattern.test(value)) {
        return (
          field.validation.message || `Invalid ${field.label.toLowerCase()}`
        );
      }

      // Min length validation
      if (
        field.validation?.minLength &&
        value.length < field.validation.minLength
      ) {
        return (
          field.validation.message ||
          `${field.label} must be at least ${field.validation.minLength} characters`
        );
      }

      // Max length validation
      if (
        field.validation?.maxLength &&
        value.length > field.validation.maxLength
      ) {
        return `${field.label} must be at most ${field.validation.maxLength} characters`;
      }

      return "";
    },
    [formFields],
  );

  // Validate all fields
  const validateForm = useCallback((): boolean => {
    const newErrors: FieldError = {};
    let isValid = true;

    formFields.forEach((field) => {
      const error = validateField(field.name, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formFields, formData, validateField]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear error when user starts typing
      setErrors((prev) => {
        if (prev[name]) {
          const { [name]: _, ...rest } = prev;
          return rest;
        }
        return prev;
      });
    },
    [],
  );

  const handleBlur = useCallback(
    (name: string) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      const error = validateField(name, formData[name]);
      if (error) {
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [formData, validateField],
  );

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Clear error when user selects
    setErrors((prev) => {
      if (prev[name]) {
        const { [name]: _, ...rest } = prev;
        return rest;
      }
      return prev;
    });
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      // Mark all fields as touched
      const allTouched: Record<string, boolean> = {};
      formFields.forEach((field) => {
        allTouched[field.name] = true;
      });
      setTouched(allTouched);

      // Validate form
      if (!validateForm()) return;

      // Remove empty fields and transform data
      const cleanedData = Object.entries(formData).reduce(
        (acc, [key, value]) => {
          if (value !== "" && value !== null && value !== undefined) {
            // Convert qualifications string to object format
            if (
              key === "qualifications" &&
              typeof value === "string" &&
              value.trim()
            ) {
              const qualArray = value
                .split(",")
                .map((q) => q.trim())
                .filter(Boolean);
              acc[key] = qualArray.reduce(
                (obj, qual) => {
                  obj[qual] = {};
                  return obj;
                },
                {} as Record<string, any>,
              );
            }
            // Convert gender display value to API format
            else if (key === "gender") {
              acc[key] =
                value === "Male" ? "M" : value === "Female" ? "F" : value;
            }
            // Convert is_active to boolean
            else if (key === "is_active") {
              acc[key] = value === "Active";
            } else {
              acc[key] = value;
            }
          }
          return acc;
        },
        {} as Record<string, any>,
      );

      onSubmit?.(cleanedData);
    },
    [formFields, formData, validateForm, onSubmit],
  );

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      setFormData({});
      setErrors({});
      setTouched({});
      setIsInitialized(false);
      onClose();
    }
  }, [isSubmitting, onClose]);

  const renderField = useCallback(
    (field: FieldConfig) => {
      const hasError = touched[field.name] && errors[field.name];
      const baseInputClass = `w-full px-4 py-2.5 border rounded-lg text-sm font-geist focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-gray-50 ${
        hasError
          ? "border-red-400 focus:ring-red-200"
          : "border-slate-200 focus:ring-blue-500"
      }`;

      switch (field.type) {
        case "select":
          return (
            <Select
              value={formData[field.name] || ""}
              onValueChange={(value) => handleSelectChange(field.name, value)}
              disabled={isSubmitting}
            >
              <SelectTrigger
                className={`font-geist bg-gray-50 ${hasError ? "border-red-400" : ""}`}
              >
                <SelectValue placeholder={`Select ${field.label}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );

        case "textarea":
          return (
            <textarea
              id={field.name}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleInputChange}
              onBlur={() => handleBlur(field.name)}
              placeholder={field.placeholder}
              rows={3}
              disabled={isSubmitting}
              className={`${baseInputClass} resize-none`}
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
              onBlur={() => handleBlur(field.name)}
              placeholder={field.placeholder}
              disabled={isSubmitting}
              min={field.type === "number" ? "0" : undefined}
              className={baseInputClass}
            />
          );
      }
    },
    [
      formData,
      touched,
      errors,
      isSubmitting,
      handleInputChange,
      handleBlur,
      handleSelectChange,
    ],
  );

  const renderFieldWithError = useCallback(
    (field: FieldConfig) => {
      const hasError = touched[field.name] && errors[field.name];

      return (
        <div key={field.name}>
          <label
            htmlFor={field.name}
            className="font-geist mb-2 block text-sm font-medium text-slate-700"
          >
            {field.label}
            {field.required && <span className="ml-1 text-red-500">*</span>}
          </label>
          {renderField(field)}
          {hasError && (
            <div className="mt-1.5 flex items-center gap-1">
              <AlertCircle size={14} className="text-red-500" />
              <span className="font-geist text-xs text-red-500">
                {errors[field.name]}
              </span>
            </div>
          )}
        </div>
      );
    },
    [touched, errors, renderField],
  );

  if (!isOpen) return null;

  return (
    <div className="font-geist fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative mx-4 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">New Staff</h2>
            <p className="mt-1 text-sm text-slate-500">
              Provide details about the staff
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 transition-colors hover:bg-slate-100 disabled:opacity-50"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        {/* Loading State */}
        {isLoadingSchema ? (
          <div className="flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm text-slate-500">Loading form fields...</p>
            </div>
          </div>
        ) : isSchemaError ? (
          <div className="flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-3 text-center">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <div>
                <p className="text-sm font-medium text-slate-800">
                  Failed to load form
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Please try again later
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClose}
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          /* Form */
          <div className="space-y-5 p-6">
            {/* Full width fields */}
            {formFields
              .filter((field) => field.fullWidth)
              .map((field) => renderFieldWithError(field))}

            {/* Two column layout for non-full-width fields */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {formFields
                .filter((field) => !field.fullWidth)
                .map((field) => renderFieldWithError(field))}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
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
                type="button"
                variant="default"
                size="xl"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="text-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
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
        )}
      </div>
    </div>
  );
};

export default AddStaffModal;
