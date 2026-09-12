"use client";

import { useState } from "react";
import { Lock, UserPlus } from "lucide-react";
import { Button } from "@/features/admin/components/ui/button";
import { useAuthStore } from "@/features/auth/auth-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ResetPasswordModal from "@/features/profile/pages/ResetPasswordModal";
import DeleteAccountModal from "@/features/profile/pages/DeleteAccountModal";
import { superAdminService } from "@/features/super-admin/services/super-admin.service";
import InviteUserModal from "@/features/super-admin/components/modals/InviteUserModal";
import InvitationsList from "@/features/super-admin/components/layouts/InvitationsList";

export default function Settings() {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await superAdminService.deactivateAccount(confirmPassword);
      toast.success("Account deleted successfully");
      await logout();
      router.push("/login");
    } catch {
      toast.error("Failed to delete account. Please check your password and try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="w-full space-y-4">
        {/* Team */}
        <div className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white">
          <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
              <UserPlus size={20} className="text-slate-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Team</h3>
              <p className="text-xs text-slate-500">
                Invite people and assign their access
              </p>
            </div>
          </div>

          <div className="px-6 py-5">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Invite User
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Send an invitation with a role and assigned LGAs
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-primary text-xs text-white"
                onClick={() => setIsInviteOpen(true)}
              >
                Invite
              </Button>
            </div>
          </div>
        </div>

        <InvitationsList />

        <div className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
              <Lock size={20} className="text-slate-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Security</h3>
              <p className="text-xs text-slate-500">Manage your account security</p>
            </div>
          </div>

          {/* Change Password */}
          <div className="px-6 py-5">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">Password</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Reset your password via email OTP
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-primary text-xs text-white"
                onClick={() => setIsResetPasswordOpen(true)}
              >
                Change
              </Button>
            </div>
          </div>

          {/* Delete Account */}
          <div className="px-6 pb-5">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">Delete Account</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-red-400 text-xs text-white"
                onClick={() => setIsDeleteAccountOpen(true)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      <InviteUserModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />

      <ResetPasswordModal
        isOpen={isResetPasswordOpen}
        onClose={() => setIsResetPasswordOpen(false)}
        userEmail={user?.email ?? ""}
      />

      <DeleteAccountModal
        isOpen={isDeleteAccountOpen}
        onClose={() => {
          setIsDeleteAccountOpen(false);
          setConfirmPassword("");
        }}
        onConfirm={handleDeleteAccount}
        UserName={`${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() || "User"}
        UserEmail={user?.email ?? ""}
        ConfirmPassword={confirmPassword}
        onPasswordChange={setConfirmPassword}
        isDeleting={isDeleting}
      />
    </>
  );
}
