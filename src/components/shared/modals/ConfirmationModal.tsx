"use client";

import { X, AlertTriangle, Loader2, Info, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ConfirmationVariant = "danger" | "warning" | "info";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  variant?: ConfirmationVariant;
  // Optional: Display item details
  itemName?: string;
  itemDetails?: string;
}

const variantConfig: Record<
  ConfirmationVariant,
  {
    icon: LucideIcon;
    noteBorder: string;
    noteBg: string;
    noteIconColor: string;
    noteTextColor: string;
    buttonClass: string;
  }
> = {
  danger: {
    icon: AlertTriangle,
    noteBorder: "border-red-100",
    noteBg: "bg-red-50",
    noteIconColor: "text-red-500",
    noteTextColor: "text-red-700",
    buttonClass: "bg-red-400 text-white hover:bg-red-400/70",
  },
  warning: {
    icon: AlertTriangle,
    noteBorder: "border-amber-100",
    noteBg: "bg-amber-50",
    noteIconColor: "text-amber-500",
    noteTextColor: "text-amber-700",
    buttonClass: "bg-amber-500 text-white hover:bg-amber-600",
  },
  info: {
    icon: Info,
    noteBorder: "border-blue-100",
    noteBg: "bg-blue-50",
    noteIconColor: "text-blue-500",
    noteTextColor: "text-blue-700",
    buttonClass: "bg-blue-500 text-white hover:bg-blue-600",
  },
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isLoading = false,
  variant = "danger",
  itemName,
  itemDetails,
}) => {
  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleClose = () => {
    if (isLoading) return;
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
                <Icon size={18} className="text-white" />
              </div>
              <h2 className="text-base font-bold text-white">{title}</h2>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
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
          {/* Item Info (if provided) */}
          {itemName && (
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-400 text-white shadow-sm">
                <Icon size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {itemName}
                </p>
                {itemDetails && (
                  <p className="truncate text-xs text-slate-500">
                    {itemDetails}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Warning note */}
          <div
            className={`flex gap-2.5 rounded-xl border ${config.noteBorder} ${config.noteBg} p-3.5`}
          >
            <AlertTriangle
              size={14}
              className={`mt-0.5 shrink-0 ${config.noteIconColor}`}
            />
            <div>
              <p className={`text-xs font-medium ${config.noteTextColor}`}>
                {message}
              </p>
              {description && (
                <p className={`mt-1 text-xs ${config.noteTextColor}`}>
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`gap-2 disabled:opacity-50 ${config.buttonClass}`}
          >
            {isLoading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Processing…
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;
