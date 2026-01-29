"use client";

import { X, AlertTriangle, Trash2, AlertCircle, Info } from "lucide-react";
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

const variantConfig = {
  danger: {
    icon: Trash2,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    borderColor: "border-red-200",
    bgColor: "bg-red-50",
    buttonClass: "bg-red-600 hover:bg-red-700",
    titleColor: "text-red-900",
    messageColor: "text-red-700",
  },
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    borderColor: "border-amber-200",
    bgColor: "bg-amber-50",
    buttonClass: "bg-amber-600 hover:bg-amber-700",
    titleColor: "text-amber-900",
    messageColor: "text-amber-700",
  },
  info: {
    icon: Info,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    borderColor: "border-blue-200",
    bgColor: "bg-blue-50",
    buttonClass: "bg-blue-600 hover:bg-blue-700",
    titleColor: "text-blue-900",
    messageColor: "text-blue-700",
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
  if (!isOpen) return null;

  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 transition-opacity"
        onClick={handleBackdropClick}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Item Info (if provided) */}
          {itemName && (
            <div
              className={`mb-6 flex items-center gap-3 rounded-lg border ${config.borderColor} ${config.bgColor} p-4`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.iconBg}`}
              >
                <Icon size={20} className={config.iconColor} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {itemName}
                </p>
                {itemDetails && (
                  <p className="truncate text-xs text-slate-500">{itemDetails}</p>
                )}
              </div>
            </div>
          )}

          {/* Warning Message */}
          <div
            className={`mb-6 flex gap-3 rounded-lg border ${config.borderColor} ${config.bgColor} p-4`}
          >
            <AlertCircle
              size={20}
              className={`mt-0.5 shrink-0 ${config.iconColor}`}
            />
            <div>
              <p className={`text-sm font-medium ${config.titleColor}`}>
                {message}
              </p>
              {description && (
                <p className={`mt-1 text-xs ${config.messageColor}`}>
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              disabled={isLoading}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              {cancelLabel}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              size="lg"
              className={`flex flex-1 items-center justify-center gap-2 ${config.buttonClass}`}
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Processing...
                </>
              ) : (
                confirmLabel
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;
