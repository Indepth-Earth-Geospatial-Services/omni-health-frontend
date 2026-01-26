"use client";
import { useState } from "react";
import { X, ChevronDown, ArrowRight } from "lucide-react";
import { User } from "../../services/super-admin.service";
import { Button } from "@/features/admin/components/ui/button";

interface ChangeUserRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSubmit: (userId: string, newRole: string) => void;
}

const roles = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
  { value: "super_admin", label: "Super Admin" },
];

const ChangeUserRoleModal: React.FC<ChangeUserRoleModalProps> = ({
  isOpen,
  onClose,
  user,
  onSubmit,
}) => {
  const [newRole, setNewRole] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!isOpen || !user) return null;

  const handleSubmit = () => {
    if (!newRole) {
      alert("Please select a new role");
      return;
    }

    onSubmit(user.user_id, newRole);
    onClose();
    setNewRole("");
  };

  // Get current role label
  const currentRoleLabel =
    roles.find((role) => role.value === user.role)?.label ||
    user.role.replace("_", " ").toUpperCase();

  // Get selected role label
  const selectedRoleLabel =
    roles.find((role) => role.value === newRole)?.label || "Select a new role";

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
            Change User Role
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
          <div className="mb-6 flex items-center gap-3">
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

          {/* Current Role */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Current Role
            </label>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              {currentRoleLabel}
            </div>
          </div>

          {/* New Role Dropdown */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              New Role
            </label>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 transition-colors hover:border-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <span
                  className={newRole ? "text-slate-800" : "text-slate-400"}
                >
                  {selectedRoleLabel}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
                  {roles
                    .filter((role) => role.value !== user.role)
                    .map((role) => (
                      <button
                        key={role.value}
                        onClick={() => {
                          setNewRole(role.value);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm transition-colors hover:bg-slate-50 ${
                          newRole === role.value
                            ? "bg-primary/10 font-medium text-primary"
                            : "text-slate-700"
                        }`}
                      >
                        {role.label}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            size="lg"
            className="flex w-full items-center justify-center gap-2"
          >
            Submit
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </>
  );
};

export default ChangeUserRoleModal;
