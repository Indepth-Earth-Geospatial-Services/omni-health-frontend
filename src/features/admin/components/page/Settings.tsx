"use client";

import { useState } from "react";
import { Lock, Hospital, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useAuthStore, useCurrentFacilityId } from "@/features/auth/auth-store";
import { useMultipleFacilities } from "@/hooks/use-facilities";
import FacilityCard from "../ui/FacilityCard";
import { toast } from "sonner";
import ResetPasswordModal from "@/features/profile/pages/ResetPasswordModal";
import DeleteAccountModal from "@/features/profile/pages/DeleteAccountModal";
import Tabs from "@/features/super-admin/components/ui/Tabs";
import { adminService } from "@/services/admin.service";

const TABS = [
  { label: "Facilities", value: "facilities" },
  { label: "Security", value: "security" },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("facilities");
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const { facilityIds, setCurrentFacilityId, user, logout } = useAuthStore();
  const currentFacilityId = useCurrentFacilityId();
  const facilityQueries = useMultipleFacilities(facilityIds ?? []);

  const isLoadingFacilities = facilityQueries.some((q) => q.isLoading);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await adminService.deleteAccount({ passwordConfirmation: confirmPassword });
      toast.success("Account deleted successfully");
      logout();
    } catch {
      toast.error("Failed to delete account. Please check your password and try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExploreFacility = (facilityId: string) => {
    setCurrentFacilityId(facilityId);
    const facility = facilityQueries.find(
      (q) => q.data?.facility?.facility_id === facilityId,
    );
    const name = facility?.data?.facility?.facility_name ?? "facility";
    toast.success(`Switched to ${name}`);
  };

  return (
    <>
      <div className="w-full space-y-4">
        {/* Tab bar */}
        <Tabs
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="w-92"
        />

        {/* ── Facilities tab ─────────────────────────────────────────────── */}
        {activeTab === "facilities" && (
          <div className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                <Hospital size={20} className="text-slate-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Your Facilities
                </h3>
                <p className="text-xs text-slate-500">
                  {facilityIds?.length ?? 0}{" "}
                  {(facilityIds?.length ?? 0) === 1 ? "facility" : "facilities"}{" "}
                  assigned to your account
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="scrollbar-hide max-h-140 overflow-y-auto px-6 py-5">
              {isLoadingFacilities ? (
                <div className="flex h-40 items-center justify-center">
                  <Loader2 className="text-primary h-6 w-6 animate-spin" />
                </div>
              ) : facilityQueries.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center gap-2 text-slate-400">
                  <Hospital size={32} className="opacity-40" />
                  <p className="text-sm">No facilities assigned yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {facilityQueries.map((query) => {
                    const facility = query.data?.facility;
                    if (!facility) return null;
                    return (
                      <FacilityCard
                        key={facility.facility_id}
                        facility={facility}
                        isActive={facility.facility_id === currentFacilityId}
                        onExplore={handleExploreFacility}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Security tab ───────────────────────────────────────────────── */}
        {activeTab === "security" && (
          <div className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                <Lock size={20} className="text-slate-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Security</h3>
                <p className="text-xs text-slate-500">
                  Manage your account security
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Password
                  </p>
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
            <div className="px-6 py-5">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Delete Account
                  </p>
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
        )}
      </div>

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
