"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "../ui/button";

interface EditEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (equipmentData: EquipmentFormData) => void;
  isSubmitting?: boolean;
  initialData: { name: string; displayName: string; quantity: string } | null;
}

interface EquipmentFormData {
  name: string;
  quantity: string;
}

const EditEquipmentModal: React.FC<EditEquipmentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  initialData,
}) => {
  const [formData, setFormData] = useState<EquipmentFormData>({
    name: "",
    quantity: "",
  });

  // Sync form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        quantity: initialData.quantity,
      });
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate quantity is a number
    if (isNaN(Number(formData.quantity)) || Number(formData.quantity) < 0) {
      alert("Please enter a valid quantity");
      return;
    }

    onSubmit?.(formData);
  };

  const handleClose = () => {
    if (!isSubmitting) {
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
            <h1 className="mt-2 mb-4 text-3xl font-medium text-slate-900">
              Edit Equipment
            </h1>
            <div>
              <h2 className="text-xl font-medium text-slate-600">
                {initialData?.displayName}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Update equipment quantity
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Equipment Name (Read-only) */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Equipment Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={initialData?.displayName || ""}
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-gray-50 px-4 py-2.5 text-sm text-slate-500"
            />
          </div>

          {/* Quantity */}
          <div>
            <label
              htmlFor="quantity"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="Enter quantity"
              min="0"
              required
              disabled={isSubmitting}
              className="focus:ring-primary w-full rounded-lg border border-slate-200 bg-gray-100 px-4 py-2.5 text-sm transition-all focus:border-transparent focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
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
              type="submit"
              variant="default"
              size="xl"
              disabled={isSubmitting}
              className="text-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  Update Equipment
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

export default EditEquipmentModal;
