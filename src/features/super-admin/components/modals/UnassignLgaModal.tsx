"use client";

import { useState, useMemo } from "react";
import { X, MapPin, AlertTriangle, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/features/admin/components/ui/button";
import { User } from "../../services/super-admin.service";
import { RIVERS_STATE_LGAS } from "../../constants/lga";
import { useUnassignLga } from "../../hooks/useLgas";

interface UnassignLgaModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSuccess?: () => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

export default function UnassignLgaModal({
  isOpen,
  onClose,
  user,
  onSuccess,
}: UnassignLgaModalProps) {
  const [selectedLgaId, setSelectedLgaId] = useState<number | null>(null);

  const unassignMutation = useUnassignLga(() => {
    // ✅ Reset local state first, then close the modal, then notify parent to refetch.
    // Order matters: closing the modal before refetch avoids a flash of stale data
    // inside the still-open modal if onSuccess triggers a re-render.
    setSelectedLgaId(null);
    onClose();
    onSuccess?.();
  });

  // Derive LGAs the user currently manages from managed_facilities
  const assignedLgaOptions = useMemo(() => {
    if (!user?.managed_facilities?.length) return [];

    const lgaNames = Array.from(
      new Set(
        user.managed_facilities
          .map((f: any) => f.facility_lga as string | undefined)
          .filter(Boolean) as string[],
      ),
    );

    return lgaNames
      .map((name) => {
        const match = RIVERS_STATE_LGAS.find(
          (l) => l.label.toLowerCase() === name.toLowerCase(),
        );
        return match
          ? { lga_id: Number(match.value), lga_name: match.label }
          : null;
      })
      .filter((x): x is { lga_id: number; lga_name: string } => x !== null);
  }, [user]);

  // ✅ Reset state on close so the modal is clean next time it opens
  const handleClose = () => {
    if (unassignMutation.isPending) return; // prevent accidental close mid-request
    setSelectedLgaId(null);
    onClose();
  };

  const handleConfirm = () => {
    if (!user || selectedLgaId === null) return;

    // ✅ Normalise user_id to number regardless of whether the API returns a
    // string or number — avoids a silent NaN if parseInt receives undefined.
    const userId =
      typeof user.user_id === "string"
        ? parseInt(user.user_id, 10)
        : (user.user_id as unknown as number);

    if (isNaN(userId)) {
      console.error(
        "UnassignLgaModal: user_id could not be parsed to a number",
        user.user_id,
      );
      return;
    }

    unassignMutation.mutate({ userId, lgaId: selectedLgaId });
  };

  if (!isOpen || !user) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 px-6 py-5">
          <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-white/10" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <AlertTriangle size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Unassign LGA</h2>
                <p className="mt-0.5 text-xs text-red-100">
                  This will remove all facility assignments in the selected LGA
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={unassignMutation.isPending}
              className="rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white disabled:opacity-50"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-5 p-6">
          {/* User card */}
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-500 to-slate-600 text-sm font-bold text-white shadow-sm">
              {getInitials(user.full_name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {user.full_name}
              </p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
            <span className="shrink-0 rounded-full border border-blue-200 bg-blue-100 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-blue-700 uppercase">
              {user.role.replace("_", " ")}
            </span>
          </div>

          {/* LGA selector */}
          {assignedLgaOptions.length === 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
              <p className="text-sm font-medium text-amber-700">
                No LGAs to unassign
              </p>
              <p className="mt-1 text-xs text-amber-600">
                This user has no managed facilities with LGA information.
              </p>
            </div>
          ) : (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Select LGA to unassign <span className="text-red-500">*</span>
              </label>
              <p className="mb-2.5 text-xs text-slate-500">
                All facility assignments for this user within the selected LGA
                will be removed.
              </p>
              <div className="relative">
                <MapPin
                  size={14}
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                />
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
                />
                <select
                  value={selectedLgaId ?? ""}
                  onChange={(e) =>
                    setSelectedLgaId(
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                  disabled={unassignMutation.isPending}
                  className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-3 pr-8 pl-9 text-sm text-slate-700 transition-colors hover:border-slate-400 focus:border-red-400 focus:ring-2 focus:ring-red-100 focus:outline-none disabled:opacity-50"
                >
                  <option value="">Choose LGA…</option>
                  {assignedLgaOptions.map((lga) => (
                    <option key={lga.lga_id} value={lga.lga_id}>
                      {lga.lga_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Warning note — only shown once an LGA is selected */}
          {selectedLgaId !== null && (
            <div className="flex gap-2.5 rounded-xl border border-red-100 bg-red-50 p-3.5">
              <AlertTriangle
                size={14}
                className="mt-0.5 shrink-0 text-red-500"
              />
              <p className="text-xs text-red-700">
                <strong>Warning:</strong> If this is the user&apos;s only LGA
                assignment, they will be automatically demoted back to{" "}
                <strong>User</strong> role.
              </p>
            </div>
          )}

          {/* ✅ Show mutation error inline so the user knows what went wrong */}
          {unassignMutation.isError && (
            <div className="flex gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5">
              <AlertTriangle
                size={14}
                className="mt-0.5 shrink-0 text-red-500"
              />
              <p className="text-xs text-red-700">
                <strong>Error:</strong>{" "}
                {(unassignMutation.error as Error)?.message ||
                  "Something went wrong. Please try again."}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={unassignMutation.isPending}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={
                unassignMutation.isPending ||
                selectedLgaId === null ||
                assignedLgaOptions.length === 0
              }
              className="flex-1 bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
            >
              {unassignMutation.isPending ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Removing…
                </>
              ) : (
                <>
                  <MapPin size={15} />
                  Confirm Unassign
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
