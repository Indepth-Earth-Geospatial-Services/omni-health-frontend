"use client";
import { useState } from "react";
import { X, Shield, Mail } from "lucide-react";
import { User } from "../../services/super-admin.service";
import { Button } from "@/features/admin/components/ui/button";
import {
  getInitials,
  getRoleBadgeColor,
  AVATAR_GRADIENTS,
} from "../../utils/user-helpers";

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
  const avatarGradient =
    AVATAR_GRADIENTS[user.full_name.charCodeAt(0) % AVATAR_GRADIENTS.length];

  const bannerColor = isSuspend
    ? "border-amber-200 bg-amber-50"
    : "border-green-200 bg-green-50";
  const bannerIconColor = isSuspend ? "text-amber-600" : "text-green-600";
  const bannerTitleColor = isSuspend ? "text-amber-900" : "text-green-900";
  const bannerBodyColor = isSuspend ? "text-amber-700" : "text-green-700";
  const submitBg = isSuspend
    ? "bg-amber-600 hover:bg-amber-700"
    : "bg-green-600 hover:bg-green-700";

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
            <div>
              <h2 className="text-base font-bold text-white">
                {isSuspend ? "Suspend Account" : "Unsuspend Account"}
              </h2>
              <p className="mt-0.5 text-xs text-white/70">
                {isSuspend
                  ? "Temporarily block this user's access"
                  : "Restore this user's access"}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
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
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-400 text-sm font-bold text-white shadow-sm`}
            >
              {getInitials(user.full_name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {user.full_name}
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-slate-500">
                <Mail size={11} className="shrink-0" />
                {user.email}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${getRoleBadgeColor(user.role)}`}
            >
              {user.role.replace("_", " ").toUpperCase()}
            </span>
          </div>

          {/* Reason Input - Only for suspend mode */}
          {isSuspend && (
            <div className="mb-5">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
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
                className={`w-full rounded-xl border ${
                  error ? "border-red-500" : "border-slate-300"
                } bg-white px-4 py-3 text-sm text-slate-600 transition-colors placeholder:text-slate-400 hover:border-slate-300 focus:ring focus:ring-gray-300 focus:outline-none`}
              />
              {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
            </div>
          )}

          {/* Info banner */}
          <div
            className={`flex gap-2.5 rounded-xl border p-3.5 ${bannerColor}`}
          >
            <Shield
              size={15}
              className={`mt-0.5 shrink-0 ${bannerIconColor}`}
            />
            <div>
              <p className={`text-xs font-semibold ${bannerTitleColor}`}>
                {isSuspend
                  ? "Account will be temporarily suspended"
                  : "Account will be reactivated"}
              </p>
              <p className={`mt-1 text-xs ${bannerBodyColor}`}>
                {isSuspend
                  ? "The user will not be able to log in or access any features. This action can be reversed."
                  : "The user will regain full access to their account."}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || (isSuspend && !reason.trim())}
            size="lg"
            className={`gap-2 disabled:cursor-not-allowed disabled:opacity-50 ${submitBg}`}
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {isSuspend ? "Suspending..." : "Unsuspending..."}
              </>
            ) : isSuspend ? (
              "Suspend Account"
            ) : (
              "Unsuspend Account"
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default SuspendUserModal;
