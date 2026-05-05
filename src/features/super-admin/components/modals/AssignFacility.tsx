"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  X,
  Search,
  MapPin,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Info,
  ChevronDown,
} from "lucide-react";
import { User } from "../../services/super-admin.service";
import { Button } from "@/features/admin/components/ui/button";
import { superAdminService } from "../../services/super-admin.service";
import { useUnassignedLgas } from "../../hooks/useLgas";
import { toast } from "sonner";

interface AssignFacilityModalProps {
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

function getRoleBadge(role: string) {
  if (role === "super_admin")
    return "bg-purple-100 text-purple-700 border-purple-200";
  if (role === "admin") return "bg-blue-100 text-blue-700 border-blue-200";
  return "bg-slate-100 text-slate-600 border-slate-200";
}

export default function AssignFacilityModal({
  isOpen,
  onClose,
  user,
  onSuccess,
}: AssignFacilityModalProps) {
  const [selectedLgaIds, setSelectedLgaIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isListOpen, setIsListOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedLgaIds([]);
      setSearchQuery("");
      setIsListOpen(false);
    }
  }, [isOpen]);

  const { data: unassignedLgas = [], isLoading: isLoadingLgas } =
    useUnassignedLgas(isOpen);

  const filteredLgas = useMemo(
    () =>
      unassignedLgas.filter((lga) =>
        lga.lga_name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [unassignedLgas, searchQuery],
  );

  const toggleLga = (id: number) => {
    setSelectedLgaIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const removeLga = (id: number) => {
    setSelectedLgaIds((prev) => prev.filter((x) => x !== id));
  };

  const selectedLgas = unassignedLgas.filter((lga) =>
    selectedLgaIds.includes(lga.lga_id),
  );

  const handleSubmit = async () => {
    if (!user || selectedLgaIds.length === 0) return;

    if (user.role === "super_admin") {
      toast.error("Super admins manage all facilities globally and cannot be assigned to specific LGAs.");
      return;
    }

    const userId =
      typeof user.user_id === "string"
        ? parseInt(user.user_id, 10)
        : (user.user_id as number);

    setIsSubmitting(true);
    try {
      await superAdminService.assignManager({
        user_id: userId,
        lga_ids: selectedLgaIds,
      });
      toast.success(
        `${user.full_name} has been assigned to ${selectedLgaIds.length} LGA${selectedLgaIds.length > 1 ? "s" : ""} and promoted to Admin.`,
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail?.[0]?.msg ||
        err?.response?.data?.message ||
        "Failed to assign LGA(s). Please try again.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
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
              <h2 className="text-base font-bold text-white">Assign LGA</h2>
              <p className="mt-0.5 text-xs text-white/70">
                All facilities under selected LGAs will be assigned
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
          style={{ maxHeight: "calc(100vh - 2rem - 80px)" }}
        >
          {/* User card */}
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
            <div className="from-primary to-primary/70 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-sm font-bold text-white shadow-sm">
              {getInitials(user.full_name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {user.full_name}
              </p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
            <span
              className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${getRoleBadge(user.role)}`}
            >
              {user.role.replace("_", " ")}
            </span>
          </div>

          {/* Currently assigned LGAs */}
          {user.managed_facilities && user.managed_facilities.length > 0 && (
            <div className="mb-5">
              <p className="mb-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                Currently Managing
              </p>
              <div className="flex flex-wrap gap-1.5">
                {Array.from(
                  new Set(
                    user.managed_facilities
                      .map((f: any) => f.facility_lga)
                      .filter(Boolean),
                  ),
                ).map((lga) => (
                  <span
                    key={lga as string}
                    className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700"
                  >
                    <MapPin size={10} />
                    {lga as string}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* LGA selector */}
          <div className="mb-5">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Select LGA(s) <span className="text-red-500">*</span>
            </label>
            <p className="mb-2.5 text-xs text-slate-500">
              All facilities within the selected LGA(s) will be assigned to this
              user.
            </p>

            {/* Trigger button */}
            <button
              type="button"
              onClick={() => {
                setIsListOpen((v) => !v);
                setTimeout(() => searchRef.current?.focus(), 50);
              }}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm transition-colors focus:outline-none ${
                isListOpen
                  ? "border-slate-400 bg-slate-50"
                  : "border-slate-300 bg-white text-slate-500 hover:border-slate-400"
              }`}
            >
              <span
                className={
                  isListOpen || selectedLgaIds.length > 0
                    ? "text-slate-700"
                    : "text-slate-400"
                }
              >
                {selectedLgaIds.length === 0
                  ? "Choose LGA(s)..."
                  : `${selectedLgaIds.length} LGA${selectedLgaIds.length > 1 ? "s" : ""} selected`}
              </span>
              <ChevronDown
                size={16}
                className={`text-slate-400 transition-transform ${isListOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Inline expanding list */}
            {isListOpen && (
              <div className="mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white">
                {/* Search */}
                <div className="border-b border-slate-100 p-2">
                  <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                    <Search size={14} className="shrink-0 text-slate-400" />
                    <input
                      ref={searchRef}
                      type="text"
                      placeholder="Search LGA..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
                    />
                  </div>
                </div>

                {/* List */}
                <div className="max-h-32 overflow-y-auto">
                  {isLoadingLgas ? (
                    <div className="flex items-center justify-center gap-2 py-6 text-xs text-slate-400">
                      <Loader2 size={14} className="animate-spin" />
                      Loading available LGAs…
                    </div>
                  ) : filteredLgas.length === 0 ? (
                    <p className="py-6 text-center text-xs text-slate-400">
                      {unassignedLgas.length === 0
                        ? "All LGAs are already assigned"
                        : "No LGAs match your search"}
                    </p>
                  ) : (
                    filteredLgas.map((lga) => {
                      const checked = selectedLgaIds.includes(lga.lga_id);
                      return (
                        <button
                          key={lga.lga_id}
                          type="button"
                          onClick={() => toggleLga(lga.lga_id)}
                          className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-slate-50 ${
                            checked ? "bg-primary/5" : ""
                          }`}
                        >
                          <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                              checked
                                ? "border-primary bg-primary"
                                : "border-slate-300 bg-white"
                            }`}
                          >
                            {checked && (
                              <svg
                                viewBox="0 0 10 8"
                                className="h-2.5 w-2.5 text-white"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path d="M1 4l2.5 2.5L9 1" />
                              </svg>
                            )}
                          </span>
                          <MapPin
                            size={13}
                            className={
                              checked ? "text-primary" : "text-slate-400"
                            }
                          />
                          <span
                            className={
                              checked
                                ? "font-medium text-slate-800"
                                : "text-slate-600"
                            }
                          >
                            {lga.lga_name}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                {selectedLgaIds.length > 0 && (
                  <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2">
                    <span className="text-xs text-slate-500">
                      {selectedLgaIds.length} selected
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedLgaIds([])}
                      className="text-xs font-medium text-red-500 hover:text-red-600"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected chips */}
          {selectedLgas.length > 0 && (
            <div className="mb-5">
              <p className="mb-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                Selected LGAs
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedLgas.map((lga) => (
                  <span
                    key={lga.lga_id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 py-1 pr-1.5 pl-2.5 text-xs font-medium text-teal-700"
                  >
                    <MapPin size={11} />
                    {lga.lga_name}
                    <button
                      type="button"
                      onClick={() => removeLga(lga.lga_id)}
                      className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full text-teal-500 transition-colors hover:bg-teal-200 hover:text-teal-700"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Info banner */}
          <div className="mb-5 flex gap-2.5 rounded-xl border border-blue-100 bg-blue-50 p-3.5">
            <Info size={15} className="mt-0.5 shrink-0 text-blue-500" />
            <p className="text-xs text-blue-700">
              <strong>Note:</strong> This will promote the user to{" "}
              <strong>Admin</strong> and assign all healthcare facilities under
              the selected LGA(s) to them. Existing assignments may be updated.
            </p>
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || selectedLgaIds.length === 0}
            size="lg"
            className="flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Assigning...
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                Assign{" "}
                {selectedLgaIds.length > 0
                  ? `${selectedLgaIds.length} LGA${selectedLgaIds.length > 1 ? "s" : ""}`
                  : "LGA(s)"}
                <ArrowRight size={16} />
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
