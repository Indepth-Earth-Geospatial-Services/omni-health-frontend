"use client";

import React, { useState } from "react";
import { Building2, Check, Hospital, Loader2, Package, X } from "lucide-react";
import { Button } from "../ui/button";
import { MultiSelectDropdown } from "@/features/super-admin/components/ui/MultiSelectDropdown";
import { useMultiSelect } from "@/features/super-admin/hooks/use-multi-select";

type InventoryType = "equipment" | "infrastructure";

interface FacilityOption {
  facility_id: string;
  facility_name: string;
}

interface InventoryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: InventoryFormData) => void;
  isSubmitting?: boolean;
  type: InventoryType;
  // Optional facility selection for super-admin — lets the same item be added
  // to several facilities at once instead of one modal round-trip each.
  showFacilitySelector?: boolean;
  facilities?: FacilityOption[];
  isLoadingFacilities?: boolean;
}

export interface InventoryFormData {
  name: string;
  quantity: string;
  facilityIds?: string[];
}

const typeConfig = {
  equipment: {
    title: "New Equipment",
    description: "Provide details about the equipment",
    nameLabel: "Equipment Name",
    namePlaceholder: "Enter equipment name (e.g., Stethoscope)",
    quantityLabel: "Quantity",
    buttonText: "Add Equipment",
    loadingText: "Adding…",
    icon: Package,
  },
  infrastructure: {
    title: "New Infrastructure",
    description: "Provide details about the facility infrastructure",
    nameLabel: "Infrastructure Name",
    namePlaceholder: "Enter infrastructure name (e.g., Baby Cot)",
    quantityLabel: "Quantity/Capacity",
    buttonText: "Add Infrastructure",
    loadingText: "Adding…",
    icon: Hospital,
  },
};

const InventoryItemModal: React.FC<InventoryItemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  type,
  showFacilitySelector = false,
  facilities = [],
  isLoadingFacilities = false,
}) => {
  const [formData, setFormData] = useState({ name: "", quantity: "" });
  const [error, setError] = useState("");

  const facilitySelect = useMultiSelect({
    items: facilities,
    getItemId: (f) => f.facility_id,
    getItemLabel: (f) => f.facility_name,
  });

  const config = typeConfig[type];
  const Icon = config.icon;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setFormData({ name: "", quantity: "" });
    setError("");
    facilitySelect.deselectAll();
    onClose();
  };

  const handleSubmit = () => {
    if (isNaN(Number(formData.quantity)) || Number(formData.quantity) <= 0) {
      setError("Please enter a valid quantity");
      return;
    }

    if (showFacilitySelector && facilitySelect.selectedIds.length === 0) {
      setError("Please select at least one facility");
      return;
    }

    onSubmit?.({
      ...formData,
      facilityIds: showFacilitySelector
        ? facilitySelect.selectedIds
        : undefined,
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="fixed top-1/2 left-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl"
        style={{ maxHeight: "calc(100vh - 2rem)" }}
      >
        {/* Header */}
        <div className="from-primary to-primary/80 relative overflow-hidden bg-linear-to-r px-6 py-5">
          <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 -left-6 h-16 w-16 rounded-full bg-white/10" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <Icon size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  {config.title}
                </h2>
                <p className="mt-0.5 text-xs text-white/70">
                  {config.description}
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

        {/* Scrollable content */}
        <div
          className="overflow-y-auto px-6 py-5"
          style={{ maxHeight: "calc(100vh - 2rem - 140px)" }}
        >
          <div className="space-y-5">
            {/* Facility Selector (for super-admin) — pick one or many
                facilities to add this same item to in one go. */}
            {showFacilitySelector && (
              <MultiSelectDropdown
                items={facilities}
                selectedIds={facilitySelect.selectedIds}
                getItemId={(f) => f.facility_id}
                getItemLabel={(f) => f.facility_name}
                onToggle={facilitySelect.toggle}
                onSelectAll={() =>
                  facilitySelect.isAllSelected
                    ? facilitySelect.deselectAll()
                    : facilitySelect.selectAll()
                }
                isAllSelected={facilitySelect.isAllSelected}
                isPartiallySelected={facilitySelect.isPartiallySelected}
                label="Facilities"
                required
                disabled={isSubmitting}
                isLoading={isLoadingFacilities}
                loadingText="Loading facilities..."
                placeholder="Select one or more facilities"
                searchPlaceholder="Search facility..."
                emptyText="No facilities found"
                icon={<Building2 size={15} className="text-slate-400" />}
              />
            )}

            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                {config.nameLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={config.namePlaceholder}
                required
                disabled={isSubmitting}
                className="focus:border-primary focus:ring-primary/20 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 transition-colors hover:border-slate-400 focus:ring-2 focus:outline-none disabled:opacity-50"
              />
            </div>

            {/* Quantity Input */}
            <div>
              <label
                htmlFor="quantity"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                {config.quantityLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="Enter quantity"
                min="1"
                required
                disabled={isSubmitting}
                className={`w-full rounded-xl border ${
                  error ? "border-red-500" : "border-slate-300"
                } focus:border-primary focus:ring-primary/20 bg-white px-4 py-3 text-sm text-slate-700 transition-colors hover:border-slate-400 focus:ring-2 focus:outline-none disabled:opacity-50`}
              />
              {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting || (showFacilitySelector && isLoadingFacilities)
            }
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                {config.loadingText}
              </>
            ) : showFacilitySelector && facilitySelect.selectedCount > 1 ? (
              <>
                <Check size={15} />
                {config.buttonText} to {facilitySelect.selectedCount}{" "}
                facilities
              </>
            ) : (
              <>
                <Check size={15} />
                {config.buttonText}
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default InventoryItemModal;
