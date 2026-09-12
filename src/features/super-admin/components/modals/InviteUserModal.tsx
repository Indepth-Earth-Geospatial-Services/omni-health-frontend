"use client";

import { useMemo, useState } from "react";
import {
  X,
  Mail,
  MapPin,
  Info,
  Loader2,
  Send,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/features/admin/components/ui/button";
import { Input } from "../ui/input";
import { MultiSelectDropdown } from "../ui/MultiSelectDropdown";
import { useMultiSelect } from "../../hooks/use-multi-select";
import { useCreateInvite, getUnavailableLgas } from "../../hooks/useInvites";
import { useUnassignedLgas } from "../../hooks/useLgas";
import { useLgaFacilityCounts } from "../../hooks/useLgaFacilityCounts";
import type { InviteRole } from "../../services/super-admin.service";

const ROLE_OPTIONS: {
  value: InviteRole;
  label: string;
  description: string;
}[] = [
  {
    value: "admin",
    label: "Admin",
    description: "Manages every facility within the LGAs assigned below",
  },
  {
    value: "super_admin",
    label: "Super Admin",
    description: "Full authority across all LGAs, facilities and users",
  },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function InviteUserModal({
  isOpen,
  onClose,
  onSuccess,
}: InviteUserModalProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<InviteRole | "">("");
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conflictingLgas, setConflictingLgas] = useState<string[]>([]);

  // Only LGAs with no coverage yet can be handed to a new admin. Fetched
  // rather than hardcoded — availability changes as admins are added.
  const { data: unassignedLgas = [], isLoading: isLoadingLgas } =
    useUnassignedLgas(isOpen);
  const { data: lgaFacilityCounts } = useLgaFacilityCounts();

  // Inviting an admin to an LGA with 0 facilities succeeds but hands them
  // coverage over nothing — same dead end assign-manager rejects outright —
  // so it's kept out of the picker rather than offered. Nothing is filtered
  // until the counts have actually loaded — an LGA absent from that map
  // means 0 facilities only once it's known to be complete, not while it's
  // simply still in flight.
  const assignableLgas = useMemo(
    () =>
      lgaFacilityCounts
        ? unassignedLgas.filter((lga) => (lgaFacilityCounts[lga.lga_name] ?? 0) > 0)
        : unassignedLgas,
    [unassignedLgas, lgaFacilityCounts],
  );
  const hiddenEmptyLgaCount = unassignedLgas.length - assignableLgas.length;

  const lgaSelect = useMultiSelect({
    items: assignableLgas,
    getItemId: (lga) => String(lga.lga_id),
    getItemLabel: (lga) => lga.lga_name,
  });

  const resetForm = () => {
    setEmail("");
    setFirstName("");
    setLastName("");
    setRole("");
    setIsRoleOpen(false);
    setError(null);
    setConflictingLgas([]);
    lgaSelect.deselectAll();
  };

  const { mutate: createInvite, isPending } = useCreateInvite(() => {
    resetForm();
    onSuccess?.();
    onClose();
  });

  const selectedRole = ROLE_OPTIONS.find((r) => r.value === role);
  const isAdminInvite = role === "admin";

  const clearErrors = () => {
    setError(null);
    setConflictingLgas([]);
  };

  const handleClose = () => {
    if (isPending) return;
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    const trimmedEmail = email.trim();
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!trimmedFirst || trimmedFirst.length > 100) {
      setError("Enter a first name of 1–100 characters.");
      return;
    }
    if (!trimmedLast || trimmedLast.length > 100) {
      setError("Enter a last name of 1–100 characters.");
      return;
    }
    if (!role) {
      setError("Select a role for the invitee.");
      return;
    }

    clearErrors();
    createInvite(
      {
        email: trimmedEmail,
        first_name: trimmedFirst,
        last_name: trimmedLast,
        role,
        lga_ids: isAdminInvite
          ? lgaSelect.selectedIds.map((id) => Number(id))
          : undefined,
      },
      {
        onError: (err) => {
          // All-or-nothing: nothing was created and no email was sent, so the
          // super admin can drop the listed LGAs and send again.
          const taken = getUnavailableLgas(err);
          if (taken?.length) {
            setConflictingLgas(taken);
            setError(
              "Some LGAs are already covered. Remove them and send again.",
            );
            return;
          }
          setError(
            err instanceof Error && err.message
              ? err.message
              : "Failed to send the invitation. Please try again.",
          );
        },
      },
    );
  };

  if (!isOpen) return null;

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
              <h2 className="text-base font-bold text-white">Invite User</h2>
              <p className="mt-0.5 text-xs text-white/70">
                They receive a link to set their own password
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isPending}
              className="rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white disabled:opacity-50"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div
          className="overflow-y-auto px-6 py-5"
          style={{ maxHeight: "calc(100vh - 2rem - 80px)" }}
        >
          {/* Name */}
          <div className="mb-5 grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="invite-first-name"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                First Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="invite-first-name"
                type="text"
                maxLength={100}
                autoComplete="off"
                placeholder="Ada"
                value={firstName}
                disabled={isPending}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  clearErrors();
                }}
              />
            </div>
            <div>
              <label
                htmlFor="invite-last-name"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Last Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="invite-last-name"
                type="text"
                maxLength={100}
                autoComplete="off"
                placeholder="Obi"
                value={lastName}
                disabled={isPending}
                onChange={(e) => {
                  setLastName(e.target.value);
                  clearErrors();
                }}
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-5">
            <label
              htmlFor="invite-email"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail
                size={15}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
              />
              <Input
                id="invite-email"
                type="email"
                autoComplete="off"
                placeholder="name@example.com"
                value={email}
                disabled={isPending}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearErrors();
                }}
                className="pl-9"
              />
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              This becomes their sign-in address and cannot be changed later.
            </p>
          </div>

          {/* Role */}
          <div className="mb-5">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Role <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRoleOpen((v) => !v)}
                disabled={isPending}
                className="focus:border-primary focus:ring-primary/20 flex w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm transition-colors hover:border-slate-400 focus:ring-2 focus:outline-none disabled:opacity-50"
              >
                <span
                  className={selectedRole ? "text-slate-800" : "text-slate-400"}
                >
                  {selectedRole ? selectedRole.label : "Select a role…"}
                </span>
                <ChevronDown
                  size={15}
                  className={`text-slate-400 transition-transform ${isRoleOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isRoleOpen && (
                <div className="mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  {ROLE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setRole(option.value);
                        setIsRoleOpen(false);
                        clearErrors();
                      }}
                      className={`flex w-full flex-col gap-0.5 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${
                        role === option.value ? "bg-primary/5" : ""
                      }`}
                    >
                      <span className="text-sm font-medium text-slate-800">
                        {option.label}
                      </span>
                      <span className="text-xs text-slate-500">
                        {option.description}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* LGAs — admins only */}
          {isAdminInvite && (
            <div className="mb-5">
              <MultiSelectDropdown
                items={assignableLgas}
                selectedIds={lgaSelect.selectedIds}
                getItemId={(lga) => String(lga.lga_id)}
                getItemLabel={(lga) => lga.lga_name}
                onToggle={(id) => {
                  lgaSelect.toggle(id);
                  clearErrors();
                }}
                onSelectAll={() =>
                  lgaSelect.isAllSelected
                    ? lgaSelect.deselectAll()
                    : lgaSelect.selectAll()
                }
                isAllSelected={lgaSelect.isAllSelected}
                isPartiallySelected={lgaSelect.isPartiallySelected}
                label="Assigned LGAs"
                disabled={isPending}
                isLoading={isLoadingLgas}
                loadingText="Loading available LGAs…"
                placeholder="Choose LGA(s)…"
                searchPlaceholder="Search LGA…"
                emptyText={
                  unassignedLgas.length === 0
                    ? "Every LGA is already covered"
                    : assignableLgas.length === 0
                      ? "The remaining LGAs have no facilities yet"
                      : "No LGAs match your search"
                }
                icon={<MapPin size={15} className="text-slate-400" />}
              />
              <p className="mt-2 text-xs text-slate-500">
                Optional — you can invite an admin with no coverage and assign
                LGAs later. Only LGAs nobody covers yet are listed
                {hiddenEmptyLgaCount > 0 &&
                  ` (${hiddenEmptyLgaCount} hidden — no facilities registered there yet)`}
                .
              </p>
            </div>
          )}

          {/* Info banner */}
          <div className="mb-5 flex gap-2.5 rounded-xl border border-blue-100 bg-blue-50 p-3.5">
            <Info size={15} className="mt-0.5 shrink-0 text-blue-500" />
            <p className="text-xs text-blue-700">
              {role === "super_admin" ? (
                <>
                  <strong>Note:</strong> Super admins hold authority over every
                  LGA, facility and user — there is no LGA to assign. Only
                  invite someone you intend to give full control of the system.
                </>
              ) : (
                <>
                  <strong>Note:</strong> The invitee gets an email with a link
                  to set a password. Their name, email and role come from this
                  form — they cannot change them when accepting.
                </>
              )}
            </p>
          </div>

          {/* LGA conflict detail */}
          {conflictingLgas.length > 0 && (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
              <div className="flex gap-2.5">
                <AlertTriangle
                  size={15}
                  className="mt-0.5 shrink-0 text-amber-500"
                />
                <div>
                  <p className="text-xs font-semibold text-amber-800">
                    Already covered by another admin
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {conflictingLgas.map((lga) => (
                      <span
                        key={lga}
                        className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-white px-2.5 py-1 text-[11px] font-medium text-amber-700"
                      >
                        <MapPin size={10} />
                        {lga}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-amber-700">
                    No invite was created and no email was sent.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Validation / API error */}
          {error && (
            <p className="mb-4 rounded-lg border border-red-100 bg-red-50 px-3.5 py-2.5 text-xs text-red-600">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="flex flex-1 items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send size={15} />
                  Send Invitation
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
