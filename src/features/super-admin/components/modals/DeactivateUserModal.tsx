"use client";
import { useState } from "react";
import { X, ArrowRight, AlertTriangle, Eye, EyeOff, Lock } from "lucide-react";
import { User } from "../../services/super-admin.service";
import { Button } from "@/features/admin/components/ui/button";

interface DeactivateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSubmit: (userId: string, password: string) => void;
  isLoading?: boolean;
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
  isLoading = false,
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !user) return null;

  const handleSubmit = () => {
    // Validate password
    if (!password.trim()) {
      setError("Password is required to deactivate this account");
      return;
    }

    setError("");
    onSubmit(user.user_id, password);
  };

  const handleClose = () => {
    setPassword("");
    setError("");
    setShowPassword(false);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800">
            Deactivate Account
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
          <div className="mb-6 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3">
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

          {/* Password Input */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Enter your password to confirm <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                <Lock size={18} className="text-slate-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter your password"
                className={`w-full rounded-lg border ${
                  error ? "border-red-500" : "border-slate-300"
                } bg-white py-3 pl-10 pr-12 text-sm text-slate-600 transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-xs text-red-500">{error}</p>
            )}
          </div>

          {/* Warning Message */}
          <div className="mb-6 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-900">
                This action can be reversed
              </p>
              <p className="mt-1 text-xs text-amber-700">
                You can reactivate this account at any time from the user
                management page
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !password.trim()}
            size="lg"
            className="flex w-full items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Deactivating...
              </>
            ) : (
              <>
                Deactivate Account
                <ArrowRight size={16} />
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default DeactivateUserModal;
