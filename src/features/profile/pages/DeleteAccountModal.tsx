"use client";

import React from "react";
import { X, AlertTriangle, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { Button } from "@/features/admin/components/ui/button";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  UserName: string;
  UserEmail: string;
  ConfirmPassword: string;
  onPasswordChange: (value: string) => void;
  isDeleting?: boolean;
}

function getInitials(name: string) {
  return (
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "?"
  );
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  UserName,
  UserEmail,
  ConfirmPassword,
  onPasswordChange,
  isDeleting = false,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

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
                  Confirm Deletion
                </h2>
                <p className="mt-0.5 text-xs text-white/70">
                  This action cannot be undone
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
          {/* User card */}
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-400 text-sm font-bold text-white shadow-sm">
              {getInitials(UserName)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {UserName}
              </p>
              <p className="truncate text-xs text-slate-500">{UserEmail}</p>
            </div>
          </div>

          {/* Password confirmation */}
          <div className="mb-5">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Confirm your password to proceed{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              {/* Honeypot: absorbs browser autofill so the search bar is never targeted */}
              <input
                type="text"
                autoComplete="username"
                tabIndex={-1}
                aria-hidden="true"
                readOnly
                style={{
                  position: "absolute",
                  width: 1,
                  height: 1,
                  opacity: 0,
                  pointerEvents: "none",
                  border: "none",
                  padding: 0,
                }}
              />
              <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
                <Lock size={16} className="text-slate-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={ConfirmPassword}
                onChange={(e) => onPasswordChange(e.target.value)}
                disabled={isDeleting}
                placeholder="Enter your password"
                autoComplete="current-password"
                name="delete-account-password"
                className="focus:border-primary focus:ring-primary/20 w-full rounded-xl border border-slate-300 bg-white py-3 pr-10 pl-9 text-sm text-slate-700 transition-colors hover:border-slate-400 focus:ring-2 focus:outline-none disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Warning note */}
          <div className="flex gap-2.5 rounded-xl border border-red-100 bg-red-50 p-3.5">
            <AlertTriangle
              size={14}
              className="mt-0.5 shrink-0 text-red-500"
            />
            <p className="text-xs text-red-700">
              <strong>Warning:</strong> All associated records and data will
              be permanently removed from the system.
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
            disabled={isDeleting || !ConfirmPassword}
            className="gap-2 bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Deleting…
              </>
            ) : (
              <>Delete Account</>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default DeleteAccountModal;
