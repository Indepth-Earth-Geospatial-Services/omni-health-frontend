"use client";
import { useState } from "react";
import { X, Shield, ChevronDown, Loader2 } from "lucide-react";
import { User } from "../../services/super-admin.service";
import { Button } from "@/features/admin/components/ui/button";

type Role = "user" | "admin" | "super_admin";

const ROLE_OPTIONS: { value: Role; label: string; description: string }[] = [
  { value: "user", label: "User", description: "Standard access — can browse and review facilities" },
  { value: "admin", label: "Admin", description: "Facility-level access — can manage assigned facilities" },
  { value: "super_admin", label: "Super Admin", description: "Full access — can manage all facilities and users" },
];

interface ChangeUserRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSubmit: (userId: string, role: string) => void;
  isLoading?: boolean;
}

export default function ChangeUserRoleModal({
  isOpen,
  onClose,
  user,
  onSubmit,
  isLoading = false,
}: ChangeUserRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState<Role | "">("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleClose = () => {
    if (isLoading) return;
    setSelectedRole("");
    setIsDropdownOpen(false);
    onClose();
  };

  const handleSubmit = () => {
    if (!user || !selectedRole) return;
    onSubmit(user.user_id, selectedRole);
  };

  const selectedOption = ROLE_OPTIONS.find((r) => r.value === selectedRole);
  const currentRoleLabel = ROLE_OPTIONS.find((r) => r.value === user?.role)?.label ?? user?.role;

  if (!isOpen || !user) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={handleClose} />

      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
              <Shield size={18} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">Change Role</h2>
              <p className="text-xs text-slate-500">Update this user's system role</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {/* User card */}
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
              {user.full_name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">{user.full_name}</p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
            <span className="shrink-0 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-slate-600 uppercase">
              {currentRoleLabel}
            </span>
          </div>

          {/* Role selector */}
          <div className="mb-5">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              New Role <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen((v) => !v)}
                disabled={isLoading}
                className="flex w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm transition-colors hover:border-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none disabled:opacity-50"
              >
                <span className={selectedOption ? "text-slate-800" : "text-slate-400"}>
                  {selectedOption ? selectedOption.label : "Select a role…"}
                </span>
                <ChevronDown
                  size={15}
                  className={`text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isDropdownOpen && (
                <div className="mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  {ROLE_OPTIONS.filter((r) => r.value !== user.role).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => { setSelectedRole(option.value); setIsDropdownOpen(false); }}
                      className={`flex w-full flex-col gap-0.5 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${selectedRole === option.value ? "bg-blue-50" : ""}`}
                    >
                      <span className="text-sm font-medium text-slate-800">{option.label}</span>
                      <span className="text-xs text-slate-500">{option.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleClose} disabled={isLoading} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !selectedRole}
              className="flex-1 disabled:opacity-50"
            >
              {isLoading ? (
                <><Loader2 size={15} className="animate-spin" /> Saving…</>
              ) : (
                "Confirm Change"
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
