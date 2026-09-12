"use client";

import { memo, useMemo } from "react";
import { X, Mail, MapPin, Building2 } from "lucide-react";
import { Button } from "@/features/admin/components/ui/button";
import type { User } from "../../services/super-admin.service";
import { getInitials, getRoleBadgeColor } from "../../utils/user-helpers";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

function getStatusBadge(user: User) {
  if (user.is_suspended) {
    return {
      label: "Suspended",
      className: "border-amber-200 bg-amber-50 text-amber-700",
    };
  }
  if (user.is_active) {
    return {
      label: "Active",
      className: "border-green-200 bg-green-50 text-green-700",
    };
  }
  return {
    label: "Inactive",
    className: "border-slate-200 bg-slate-100 text-slate-600",
  };
}

/**
 * Read-only, so there's nothing to hold in state — the whole component is
 * just a projection of the `user` prop. Wrapped in `memo` so it doesn't
 * re-render on unrelated parent state changes (the table re-renders on
 * every search keystroke and page/dropdown toggle) unless `isOpen` or
 * `user` actually change.
 */
const UserProfileModal = memo(function UserProfileModal({
  isOpen,
  onClose,
  user,
}: UserProfileModalProps) {
  // Hooks run unconditionally, before the early return below. Both derive
  // from data the list query already fetched — there's no separate
  // per-user facilities endpoint to call — so this is a memo, not a fetch:
  // it just stops the row-projection work from re-running on every render
  // the modal's parent triggers (search keystrokes, pagination, dropdown
  // toggles) unless the user's own data actually changed.
  const lgaNames = useMemo(
    () => (user?.managed_lga ? Object.values(user.managed_lga) : []),
    [user?.managed_lga],
  );
  const facilities = useMemo(
    () => user?.managed_facilities ?? [],
    [user?.managed_facilities],
  );

  if (!isOpen || !user) return null;

  const status = getStatusBadge(user);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed top-1/2 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl"
        style={{ maxHeight: "calc(100vh - 2rem)" }}
      >
        {/* Header */}
        <div className="from-primary to-primary/80 relative overflow-hidden bg-linear-to-r px-6 py-5">
          <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 -left-6 h-16 w-16 rounded-full bg-white/10" />
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">User Profile</h2>
              <p className="mt-0.5 text-xs text-white/70">
                Account details and LGA coverage
              </p>
            </div>
            <button
              onClick={onClose}
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
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getRoleBadgeColor(user.role)}`}
            >
              {user.role.replace("_", " ").toUpperCase()}
            </span>
          </div>

          {/* Role + Status */}
          <div className="mb-5 grid grid-cols-2 gap-3">
            <div>
              <p className="mb-1.5 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                Status
              </p>
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${status.className}`}
              >
                {status.label}
              </span>
            </div>
          </div>

          {/* Assigned LGAs */}
          <div className="mb-5">
            <p className="mb-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">
              Assigned LGAs{lgaNames.length > 0 && ` (${lgaNames.length})`}
            </p>
            {lgaNames.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {lgaNames.map((lga) => (
                  <span
                    key={lga}
                    className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700"
                  >
                    <MapPin size={10} />
                    {lga}
                  </span>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3.5 py-4 text-center text-xs text-slate-400">
                {user.role === "super_admin"
                  ? "No LGA list — super admins cover every LGA"
                  : "No LGAs assigned yet"}
              </p>
            )}
          </div>

          {/* Managed Facilities — the full batch. Previously a 2-item
              preview in the table row with its own expand/collapse; that
              column is gone now that the complete list lives here. */}
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">
              Managed Facilities
              {facilities.length > 0 && ` (${facilities.length})`}
            </p>
            {facilities.length > 0 ? (
              <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50/50 p-2.5">
                <div className="flex flex-wrap gap-1.5">
                  {facilities.map((facility) => (
                    <span
                      key={facility.facility_id}
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600"
                    >
                      <Building2 size={10} className="text-slate-400" />
                      {facility.facility_name}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3.5 py-4 text-center text-xs text-slate-400">
                No facilities assigned yet
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-100 px-6 py-4">
          <Button onClick={onClose} size="lg">
            Close
          </Button>
        </div>
      </div>
    </>
  );
});

export default UserProfileModal;
