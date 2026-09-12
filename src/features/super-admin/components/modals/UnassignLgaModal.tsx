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

type LgaOption = {
  lga_id: number;
  lga_name: string;
};

export default function UnassignLgaModal({
  isOpen,
  onClose,
  user,
  onSuccess,
}: UnassignLgaModalProps) {
  const [selectedLgaId, setSelectedLgaId] = useState<number | null>(null);

  const unassignMutation = useUnassignLga(() => {
    setSelectedLgaId(null);
    onClose();
    onSuccess?.();
  });

  const assignedLgaOptions = useMemo((): LgaOption[] => {
    const result: LgaOption[] = [];

    // Primary: managed_lga from API — keys are lga_id strings, values are lga_names.
    // This is the only source that carries the real backend lga_id needed for DELETE.
    const managedLga = user?.managed_lga;
    if (managedLga && Object.keys(managedLga).length > 0) {
      for (const [lgaIdStr, lgaName] of Object.entries(managedLga)) {
        const lgaId = parseInt(lgaIdStr, 10);
        if (!isNaN(lgaId)) {
          result.push({ lga_id: lgaId, lga_name: String(lgaName) });
        }
      }
      if (result.length > 0) return result;
    }

    // Fallback: derive from managed_facilities[].facility_lga when managed_lga
    // is absent. Uses RIVERS_STATE_LGAS sequential index as lga_id — may be
    // inaccurate if backend IDs differ, but better than showing nothing.
    if (!user?.managed_facilities?.length) return [];
    const lgaNames = Array.from(
      new Set(
        user.managed_facilities
          .map((f) => f.facility_lga)
          .filter((name): name is string => typeof name === "string" && name.length > 0),
      ),
    );
    for (const name of lgaNames) {
      const match = RIVERS_STATE_LGAS.find(
        (l) => l.label.toLowerCase() === name.toLowerCase(),
      );
      if (match) {
        result.push({ lga_id: Number(match.value), lga_name: match.label });
      }
    }
    return result;
  }, [user]);

  const handleClose = () => {
    if (unassignMutation.isPending) return;
    setSelectedLgaId(null);
    onClose();
  };

  const handleConfirm = () => {
    if (!user || selectedLgaId === null) return;

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
      <div
        className="fixed top-1/2 left-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl"
        style={{ maxHeight: "calc(100vh - 2rem)" }}
      >
        {/* Header */}
        <div className="from-primary to-primary/80 relative overflow-hidden bg-linear-to-r px-6 py-5">
          <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 -left-6 h-16 w-16 rounded-full bg-white/10" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <AlertTriangle size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Unassign LGA</h2>
                <p className="mt-0.5 text-xs text-white/70">
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

        {/* Scrollable content */}
        <div
          className="overflow-y-auto px-6 py-5"
          style={{ maxHeight: "calc(100vh - 2rem - 140px)" }}
        >
          {/* User card */}
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-400 text-sm font-bold text-white shadow-sm">
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
          <div className="mb-5">
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
              <>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Select LGA to unassign{" "}
                  <span className="text-red-500">*</span>
                </label>
                <p className="mb-2.5 text-xs text-slate-500">
                  All facility assignments for this user within the selected
                  LGA will be removed.
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
              </>
            )}
          </div>

          {/* Warning note */}
          {selectedLgaId !== null && (
            <div className="mb-5 flex gap-2.5 rounded-xl border border-red-100 bg-red-50 p-3.5">
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

          {/* Inline error */}
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
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={unassignMutation.isPending}
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
            className="gap-2 bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
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
    </>
  );
}
