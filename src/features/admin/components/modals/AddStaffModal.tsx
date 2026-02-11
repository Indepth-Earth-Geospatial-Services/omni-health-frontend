"use client";

import React, { useCallback } from "react";
import { ArrowRight, X, Loader2, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useStaffSchema } from "@/features/admin/hooks/useAdminStaff";
import {
  useStaffForm,
  type FieldConfig,
} from "@/features/admin/hooks/use-staff-form";

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (staffData: Record<string, unknown>) => void;
  facilityId: string;
  isSubmitting?: boolean;
}

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

  const {
    formData,
    errors,
    touched,
    formFields,
    handleInputChange,
    handleBlur,
    handleSelectChange,
    handleSubmit,
    handleClose,
  } = useStaffForm({
    schema,
    isOpen,
    isSubmitting,
    onSubmit,
    onClose,
  });

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
              value={(formData[field.name] as string) || ""}
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
              value={(formData[field.name] as string) || ""}
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
              value={(formData[field.name] as string) || ""}
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
    [formData, touched, errors, isSubmitting, handleInputChange, handleBlur, handleSelectChange]
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
    [touched, errors, renderField]
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
