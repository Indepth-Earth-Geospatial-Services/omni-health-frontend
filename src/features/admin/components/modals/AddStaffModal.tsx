"use client";

import React, { useCallback, useState } from "react";
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
import Tabs from "@/features/super-admin/components/ui/Tabs";
import BulkImportStaffPanel from "@/components/shared/modals/BulkImportStaffPanel";

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

  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");

  const handleModalClose = useCallback(() => {
    setActiveTab("single");
    handleClose();
  }, [handleClose]);

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
    <div className="font-geist fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleModalClose} />

      {/* Modal — fixed height with flex column so header/footer stay sticky */}
      <div className="relative flex h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* ── Sticky Header ── */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">New Staff</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Fill in the staff member&apos;s details below
            </p>
          </div>
          <button
            onClick={handleModalClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="shrink-0 px-6 pt-4">
          <Tabs
            tabs={[
              { label: "Single Add", value: "single" },
              { label: "Bulk Import", value: "bulk" },
            ]}
            activeTab={activeTab}
            onTabChange={(value) => setActiveTab(value as "single" | "bulk")}
            className="py-0"
          />
        </div>

        {/* ── Scrollable Body ── */}
        {activeTab === "bulk" ? (
          <div className="flex-1 overflow-y-auto p-6">
            <BulkImportStaffPanel
              facilityId={facilityId}
              onSuccess={handleModalClose}
            />
          </div>
        ) : isLoadingSchema ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="text-primary h-8 w-8 animate-spin" />
              <p className="text-sm text-slate-500">Loading form fields...</p>
            </div>
          </div>
        ) : isSchemaError ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-center">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <p className="text-sm font-medium text-slate-800">
                Failed to load form
              </p>
              <p className="text-xs text-slate-500">Please try again later</p>
              <Button variant="outline" size="sm" onClick={handleModalClose}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            {/* Full-width fields */}
            {formFields
              .filter((field) => field.fullWidth)
              .map((field) => renderFieldWithError(field))}

            {/* Two-column grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {formFields
                .filter((field) => !field.fullWidth)
                .map((field) => renderFieldWithError(field))}
            </div>
          </div>
        )}

        {/* ── Sticky Footer ── */}
        {activeTab === "single" && !isLoadingSchema && !isSchemaError && (
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 bg-white px-6 py-4">
            <button
              type="button"
              onClick={handleModalClose}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="gap-2 bg-primary text-white hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit
                  <ArrowRight size={16} />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddStaffModal;
