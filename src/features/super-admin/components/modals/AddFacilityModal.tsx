"use client";

import { X, ArrowRight } from "lucide-react";
import { Button } from "@/features/admin/components/ui/button";
import {
  useFacilityForm,
  type FacilityData,
} from "@/features/super-admin/hooks/use-facility-form";
import {
  BasicDetailsSection,
  LocationDetailsSection,
  CapacityResourcesSection,
} from "@/features/super-admin/components/forms/FacilityFormSections";

interface AddFacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  facility?: FacilityData;
}

export default function AddFacilityModal({
  isOpen,
  onClose,
  facility,
}: AddFacilityModalProps) {
  const {
    formData,
    errors,
    isSubmitting,
    isEditing,
    handleInputChange,
    handleSubmit,
    handleClose,
  } = useFacilityForm({ facility, isOpen, onClose });

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
            {isEditing ? "Edit Facility" : "Add New Facility"}
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
            <BasicDetailsSection
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
            />

            <LocationDetailsSection
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
            />

            <CapacityResourcesSection
              formData={formData}
              onInputChange={handleInputChange}
            />
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
