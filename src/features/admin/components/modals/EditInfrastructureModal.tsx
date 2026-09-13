"use client";

import React, { useState, useEffect } from "react";
import { Check, Hospital, Loader2, X } from "lucide-react";
import { Button } from "../ui/button";

interface EditInfrastructureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (infrastructureData: InfrastructureFormData) => void;
  isSubmitting?: boolean;
  initialData: { name: string; displayName: string; quantity: string } | null;
}

interface InfrastructureFormData {
  name: string;
  quantity: string;
}

const EditInfrastructureModal: React.FC<EditInfrastructureModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  initialData,
}) => {
  const [formData, setFormData] = useState<InfrastructureFormData>({
    name: "",
    quantity: "",
  });
  const [error, setError] = useState("");

  // Sync form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        quantity: initialData.quantity,
      });
      setError("");
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleSubmit = () => {
    if (isNaN(Number(formData.quantity)) || Number(formData.quantity) < 0) {
      setError("Please enter a valid quantity");
      return;
    }
    onSubmit?.(formData);
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
                <Hospital size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  Edit Infrastructure
                </h2>
                <p className="mt-0.5 text-xs text-white/70">
                  Update this item&apos;s quantity or capacity
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
          {/* Item card */}
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-400 text-white shadow-sm">
              <Hospital size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {initialData?.displayName || "—"}
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-green-200 bg-green-100 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-green-700 uppercase">
              Infrastructure
            </span>
          </div>

          {/* Quantity/Capacity */}
          <div>
            <label
              htmlFor="quantity"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Quantity/Capacity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="Enter quantity or capacity"
              min="0"
              disabled={isSubmitting}
              className={`w-full rounded-xl border ${
                error ? "border-red-500" : "border-slate-300"
              } focus:border-primary focus:ring-primary/20 bg-white px-4 py-3 text-sm text-slate-700 transition-colors hover:border-slate-400 focus:ring-2 focus:outline-none disabled:opacity-50`}
            />
            {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
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
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Updating…
              </>
            ) : (
              <>
                <Check size={15} />
                Update Infrastructure
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default EditInfrastructureModal;
