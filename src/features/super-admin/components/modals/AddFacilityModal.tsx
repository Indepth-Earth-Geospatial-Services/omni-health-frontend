"use client";

import { Building2, Check, Loader2, X } from "lucide-react";
import { Button } from "@/features/admin/components/ui/button";
import {
  useFacilityForm,
  type FacilityData,
} from "@/features/super-admin/hooks/use-facility-form";
import {
  BasicDetailsSection,
  LocationDetailsSection,
  ServicesSection,
  WorkingHoursSection,
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
    handleWorkingHoursChange,
    handleSubmit,
    handleClose,
  } = useFacilityForm({ facility, isOpen, onClose });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal — fixed height, scrollable body */}
      <div className="relative mx-4 flex h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="from-primary to-primary/80 relative shrink-0 overflow-hidden bg-linear-to-r px-6 py-5">
          <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 -left-6 h-16 w-16 rounded-full bg-white/10" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <Building2 size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  {isEditing ? "Edit Facility" : "Add New Facility"}
                </h2>
                <p className="mt-0.5 text-xs text-white/70">
                  {isEditing
                    ? "Update this facility's details"
                    : "Register a new healthcare facility"}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white disabled:opacity-50"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-8 p-6">
            <BasicDetailsSection
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
            />

            <div className="border-t border-slate-100" />

            <LocationDetailsSection
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
            />

            <div className="border-t border-slate-100" />

            <ServicesSection
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
            />

            <div className="border-t border-slate-100" />

            <WorkingHoursSection
              formData={formData}
              onWorkingHoursChange={handleWorkingHoursChange}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <Check size={15} />
                {isEditing ? "Save Changes" : "Submit"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
