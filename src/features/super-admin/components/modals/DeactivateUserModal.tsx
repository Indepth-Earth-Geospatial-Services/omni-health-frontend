"use client";
import { useState } from "react";
import { X, ArrowRight, AlertTriangle } from "lucide-react";
import { User } from "../../services/super-admin.service";
import { Button } from "@/features/admin/components/ui/button";

interface DeactivateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSubmit: (userId: string, reason: string) => void;
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

const DeactivateUserModal: React.FC<DeactivateUserModalProps> = ({
  isOpen,
  onClose,
  user,
  onSubmit,
}) => {
  const [reason, setReason] = useState("");

  if (!isOpen || !user) return null;

  const handleSubmit = () => {
    onSubmit(user.user_id, reason);
    onClose();
    setReason("");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800">
            Deactivate User
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* User Info */}
          <div className="mb-6 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
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

          {/* Reason Input */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Reason for deactivation (optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter the reason for deactivating this user..."
              rows={4}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Warning Message */}
          <div className="mb-6 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-900">
                This action can be reversed
              </p>
              <p className="mt-1 text-xs text-amber-700">
                You can reactivate this user at any time from the user
                management page
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            size="lg"
            className="flex w-full items-center justify-center gap-2 bg-red-600 hover:bg-red-700"
          >
            Deactivate User
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </>
  );
};

export default DeactivateUserModal;
