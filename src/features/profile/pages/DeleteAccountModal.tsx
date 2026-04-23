"use client";

import React from "react";
import { X, AlertTriangle, Trash2, Eye, EyeOff } from "lucide-react";
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative mx-4 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header with gradient */}
        <div className="flex items-center justify-between bg-red-500 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <AlertTriangle size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Confirm Deletion</h2>
              <p className="mt-0.5 text-sm text-red-100">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg p-2 transition-colors hover:bg-white/20 disabled:opacity-50"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 p-6">
          {/* Warning Message */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="text-sm text-slate-700">
              Are you sure you want to delete{" "}
              <p className="font-semibold text-red-600">{UserName} ?</p>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              All associated records and data will be permanently removed from
              the system.
            </p>
          </div>

          {/* User Info Card */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600">
                <span className="text-sm font-bold text-white">
                  {UserName?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase() || "?"}
                </span>
              </div>
              <div>
                <p className="font-semibold text-slate-800">{UserName}</p>
                <p className="text-xs text-slate-500">{UserEmail}</p>
              </div>
            </div>
          </div>

          {/* Password Confirmation */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Confirm your password to proceed
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={ConfirmPassword}
                onChange={(e) => onPasswordChange(e.target.value)}
                disabled={isDeleting}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 pr-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 border-slate-300 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting || !ConfirmPassword}
              className="flex-1 bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <span className="mr-2 animate-spin">⏳</span>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  Delete Account
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
