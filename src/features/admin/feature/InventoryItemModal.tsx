"use client";

import React, { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";

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
  // Optional facility selection for super-admin
  showFacilitySelector?: boolean;
  facilities?: FacilityOption[];
  isLoadingFacilities?: boolean;
}

export interface InventoryFormData {
  name: string;
  quantity: string;
  facilityId?: string;
}

const typeConfig = {
  equipment: {
    title: "New Equipment",
    subtitle: "Equipment Details",
    description: "Provide details about the equipment",
    nameLabel: "Equipment Name",
    namePlaceholder: "Enter equipment name (e.g., Stethoscope)",
    quantityLabel: "Quantity",
    buttonText: "Add Equipment",
    loadingText: "Adding...",
  },
  infrastructure: {
    title: "New Infrastructure",
    subtitle: "Infrastructure Details",
    description: "Provide details about the facility infrastructure",
    nameLabel: "Infrastructure Name",
    namePlaceholder: "Enter infrastructure name (e.g., Baby Cot)",
    quantityLabel: "Quantity/Capacity",
    buttonText: "Add Infrastructure",
    loadingText: "Adding...",
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
  const [formData, setFormData] = useState<InventoryFormData>({
    name: "",
    quantity: "",
    facilityId: "",
  });

  const config = typeConfig[type];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isNaN(Number(formData.quantity)) || Number(formData.quantity) <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    if (showFacilitySelector && !formData.facilityId) {
      alert("Please select a facility");
      return;
    }

    onSubmit?.(formData);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ name: "", quantity: "", facilityId: "" });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative mx-4 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between rounded-t-2xl bg-white px-6 py-4">
          <div>
            <h1 className="mb-4 mt-2 text-3xl font-medium text-slate-900">
              {config.title}
            </h1>
            <div>
              <h2 className="text-xl font-medium text-slate-600">
                {config.subtitle}
              </h2>
              <p className="mt-1 text-sm text-slate-500">{config.description}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Facility Selector (for super-admin) */}
          {showFacilitySelector && (
            <div>
              <label
                htmlFor="facilityId"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Select Facility
              </label>
              {isLoadingFacilities ? (
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-gray-100 px-4 py-2.5">
                  <Loader2 size={16} className="animate-spin text-slate-400" />
                  <span className="text-sm text-slate-500">Loading facilities...</span>
                </div>
              ) : (
                <select
                  id="facilityId"
                  name="facilityId"
                  value={formData.facilityId}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-slate-200 bg-gray-100 px-4 py-2.5 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select a facility</option>
                  {facilities.map((facility) => (
                    <option key={facility.facility_id} value={facility.facility_id}>
                      {facility.facility_name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Name Input */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              {config.nameLabel}
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
              className="w-full rounded-lg border border-slate-200 bg-gray-100 px-4 py-2.5 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Quantity Input */}
          <div>
            <label
              htmlFor="quantity"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              {config.quantityLabel}
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
              className="w-full rounded-lg border border-slate-200 bg-gray-100 px-4 py-2.5 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="submit"
              variant="default"
              size="xl"
              disabled={isSubmitting || (showFacilitySelector && isLoadingFacilities)}
              className="text-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {config.loadingText}
                </>
              ) : (
                <>
                  {config.buttonText}
                  <ArrowRight size={18} />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryItemModal;
