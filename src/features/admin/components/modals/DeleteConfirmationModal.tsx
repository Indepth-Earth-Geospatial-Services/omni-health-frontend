"use client";

import React from "react";
import { AlertTriangle, Loader2, Package, X } from "lucide-react";
import { Button } from "../ui/button";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  itemName: string;
  itemType: "equipment" | "infrastructure";
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  itemName,
  itemType,
}) => {
  const handleClose = () => {
    if (isDeleting) return;
    onClose();
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
                <AlertTriangle size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  Confirm Delete
                </h2>
                <p className="mt-0.5 text-xs text-white/70">
                  This will permanently remove the item from inventory
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isDeleting}
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
              <Package size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {itemName}
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-blue-200 bg-blue-100 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-blue-700 uppercase">
              {itemType}
            </span>
          </div>

          {/* Warning note */}
          <div className="flex gap-2.5 rounded-xl border border-red-100 bg-red-50 p-3.5">
            <AlertTriangle
              size={14}
              className="mt-0.5 shrink-0 text-red-500"
            />
            <p className="text-xs text-red-700">
              <strong>Warning:</strong> This action cannot be undone. Deleting
              this {itemType} will permanently remove it from the
              facility&apos;s inventory.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <Button variant="outline" onClick={handleClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            className="gap-2 bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Deleting…
              </>
            ) : (
              <>Delete {itemType}</>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmationModal;
