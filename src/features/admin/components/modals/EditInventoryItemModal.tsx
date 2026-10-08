"use client";

import React, { useState } from "react";
import { Check, Hospital, Loader2, Package, X } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import type { InventoryType } from "@/services/admin.service";
import type {
  ConditionCounts,
  InventoryItem,
} from "@/features/admin/hooks/use-equipment-actions";
import {
  ConditionCountFields,
  parseConditionDraft,
  type ConditionDraft,
} from "./ConditionCountFields";

interface EditInventoryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (counts: ConditionCounts) => void;
  isSubmitting?: boolean;
  type: InventoryType;
  initialData: InventoryItem | null;
}

const typeConfig = {
  equipment: {
    title: "Edit Equipment",
    label: "Equipment",
    icon: Package,
    badge: "border-blue-200 bg-blue-100 text-blue-700",
  },
  infrastructure: {
    title: "Edit Infrastructure",
    label: "Infrastructure",
    icon: Hospital,
    badge: "border-green-200 bg-green-100 text-green-700",
  },
};

/**
 * One edit modal for both types. Mounted only while open and keyed by item,
 * so the fields always start from the item being edited.
 */
const EditInventoryItemModal: React.FC<EditInventoryItemModalProps> = (props) =>
  props.isOpen && props.initialData ? (
    <EditInventoryItemForm key={props.initialData.name} {...props} />
  ) : null;

const EditInventoryItemForm: React.FC<EditInventoryItemModalProps> = ({
  onClose,
  onSubmit,
  isSubmitting = false,
  type,
  initialData,
}) => {
  const [counts, setCounts] = useState<ConditionDraft>(() => ({
    functional: String(initialData?.functional ?? 0),
    notFunctional: String(initialData?.notFunctional ?? 0),
  }));
  const [error, setError] = useState("");

  const config = typeConfig[type];
  const Icon = config.icon;

  const surplus = initialData
    ? Math.max(
        0,
        initialData.total - initialData.functional - initialData.notFunctional,
      )
    : 0;

  const handleClose = () => {
    if (!isSubmitting) onClose();
  };

  const handleSubmit = () => {
    const parsed = parseConditionDraft(counts);
    if (!parsed) {
      setError("Counts must be whole numbers, 0 or more.");
      return;
    }
    onSubmit?.(parsed);
  };

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
                  Update how many are functional and non-functional
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              aria-label="Close"
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
              <Icon size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="truncate text-sm font-semibold text-slate-800"
                title={initialData?.displayName}
              >
                {initialData?.displayName || "—"}
              </p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                config.badge,
              )}
            >
              {config.label}
            </span>
          </div>

          <ConditionCountFields
            value={counts}
            onChange={(next) => {
              setCounts(next);
              if (error) setError("");
            }}
            disabled={isSubmitting}
            surplus={surplus}
            error={error || undefined}
          />
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
                Update {config.label}
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default EditInventoryItemModal;
