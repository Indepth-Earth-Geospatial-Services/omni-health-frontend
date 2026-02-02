"use client";
import { useState } from "react";
import { X, ArrowRight, Shield } from "lucide-react";
import { User } from "../../services/super-admin.service";
import { Button } from "@/features/admin/components/ui/button";

interface SuspendUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSubmit: (
    userId: string,
    reason: string,
    mode: "suspend" | "unsuspend",
  ) => void;
  isLoading?: boolean;
  mode?: "suspend" | "unsuspend";
}

// Helper function to get role badge color
const getRoleBadgeColor = (role: string) => {
  switch (role.toLowerCase()) {
    case "super_admin":
      return "bg-blue-400 text-white";
    case "admin":
      return "bg-red-400 text-white";
    default:
      return "border-gray-200 bg-gray-50 text-gray-600";
  }
};

const SuspendUserModal: React.FC<SuspendUserModalProps> = ({
  isOpen,
  onClose,
  user,
  onSubmit,
  isLoading = false,
  mode = "suspend",
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  if (!isOpen || !user) return null;

  const handleSubmit = () => {
    if (mode === "suspend") {
      // Validate reason for suspension
      if (!reason.trim()) {
        setError("Please provide a reason for suspension");
        return;
      }
    }

    setError("");
    onSubmit(user.user_id, reason, mode);
  };

  const handleClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  const isSuspend = mode === "suspend";
  const titleColor = isSuspend ? "text-amber-700" : "text-green-700";
  const borderColor = isSuspend
    ? "border-amber-200 bg-amber-50"
    : "border-green-200 bg-green-50";
  const buttonBg = isSuspend
    ? "bg-amber-600 hover:bg-amber-700"
    : "bg-green-600 hover:bg-green-700";
  const badgeBg = isSuspend
    ? "border-amber-200 bg-amber-50"
    : "border-green-200 bg-green-50";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <h2 className={`text-lg font-semibold ${titleColor}`}>
            {isSuspend ? "Suspend Account" : "Unsuspend Account"}
          </h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* User Info */}
          <div
            className={`mb-6 flex items-center justify-between rounded-lg border ${badgeBg} p-3`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
                {user.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {user.full_name}
                </p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </div>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${getRoleBadgeColor(user.role)}`}
            >
              {user.role.replace("_", " ").toUpperCase()}
            </span>
          </div>

          {/* Reason Input - Only for suspend mode */}
          {isSuspend && (
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Reason for suspension <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter reason for suspending this account"
                rows={4}
                className={`w-full rounded-lg border ${
                  error ? "border-red-500" : "border-slate-300"
                } focus:border-primary focus:ring-primary/20 bg-white px-4 py-3 text-sm text-slate-600 transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:ring-2 focus:outline-none`}
              />
              {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
            </div>
          )}

          {/* Info Message */}
          <div
            className={`mb-6 flex gap-3 rounded-lg border ${borderColor} p-4`}
          >
            <Shield
              size={20}
              className={`mt-0.5 shrink-0 ${isSuspend ? "text-amber-600" : "text-green-600"}`}
            />
            <div>
              <p
                className={`text-sm font-medium ${isSuspend ? "text-amber-900" : "text-green-900"}`}
              >
                {isSuspend
                  ? "Account will be temporarily suspended"
                  : "Account will be reactivated"}
              </p>
              <p
                className={`mt-1 text-xs ${isSuspend ? "text-amber-700" : "text-green-700"}`}
              >
                {isSuspend
                  ? "The user will not be able to log in or access any features. This action can be reversed."
                  : "The user will regain full access to their account."}
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isLoading || (isSuspend && !reason.trim())}
            size="lg"
            className={`flex w-full items-center justify-center gap-2 ${buttonBg} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {isSuspend ? "Suspending..." : "Unsuspending..."}
              </>
            ) : (
              <>
                {isSuspend ? "Suspend Account" : "Unsuspend Account"}
                <ArrowRight size={16} />
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default SuspendUserModal;
