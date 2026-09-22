"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Building2, ChevronRight, Search, MapPin } from "lucide-react";
import { Button } from "@/features/admin/components/ui/button";
import type { ManagedFacility } from "../../services/super-admin.service";

interface SelectFacilityModalProps {
  onClose: () => void;
  adminName: string;
  facilities: ManagedFacility[];
}

/** Rows added per "Show more". An admin can manage hundreds of facilities,
 *  and mounting every row up front is wasted work when the search box is
 *  how anyone actually finds one. */
const PAGE_SIZE = 25;

/**
 * Lets a super-admin pick one of an admin's facilities straight from the
 * users table, then sends them to the read-only /super-admin/facility-view
 * page for it.
 *
 * Search is client-side on purpose: `managed_facilities` already arrives
 * complete on the user row, so filtering here is instant and costs no
 * request per keystroke. The `/facilities/search` endpoint is not an
 * option — it searches every facility in the system with no way to scope to
 * one admin, so it would offer facilities this admin doesn't manage.
 *
 * Mounted only while open (the caller renders it conditionally) so the
 * search box and paging reset on their own each time it's opened, with no
 * reset-on-open effect.
 */
export default function SelectFacilityModal({
  onClose,
  adminName,
  facilities,
}: SelectFacilityModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const matches = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return facilities;
    return facilities.filter(
      (facility) =>
        facility.facility_name.toLowerCase().includes(term) ||
        (facility.facility_lga ?? "").toLowerCase().includes(term),
    );
  }, [facilities, query]);

  const visible = matches.slice(0, visibleCount);
  const hasMore = matches.length > visible.length;

  const handleSelect = (facilityId: string) => {
    onClose();
    router.push(
      `/super-admin/facility-view?facility_id=${facilityId}&admin_name=${encodeURIComponent(adminName)}`,
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal — width leaves a gutter on phones instead of running edge to
          edge, and the list below is capped so the shell never stretches to
          the full viewport height. */}
      <div
        className="fixed top-1/2 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        style={{ maxHeight: "calc(100vh - 2rem)" }}
      >
        {/* Header */}
        <div className="from-primary to-primary/80 relative shrink-0 overflow-hidden bg-linear-to-r px-4 py-4 sm:px-6 sm:py-5">
          <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 -left-6 h-16 w-16 rounded-full bg-white/10" />
          <div className="relative flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
                <Building2 size={18} className="text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-white">
                  Select a Facility
                </h2>
                <p className="mt-0.5 truncate text-xs text-white/70">
                  Managed by {adminName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {facilities.length === 0 ? (
          <div className="px-4 py-8 sm:px-6">
            <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3.5 py-6 text-center text-xs text-slate-400">
              No facilities assigned yet
            </p>
          </div>
        ) : (
          <>
            {/* Search */}
            <div className="shrink-0 border-b border-slate-100 px-4 py-3 sm:px-6">
              <div className="relative">
                <Search
                  size={15}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  placeholder={`Search ${facilities.length} facilities by name or LGA…`}
                  className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-slate-200 py-2 pr-3 pl-9 text-sm placeholder:text-slate-400 focus:ring-2 focus:outline-none"
                />
              </div>
              <p className="mt-2 text-[11px] text-slate-400">
                {matches.length === facilities.length
                  ? `Showing ${visible.length} of ${facilities.length}`
                  : `${matches.length} match${matches.length === 1 ? "" : "es"} of ${facilities.length}`}
              </p>
            </div>

            {/* Results — capped at ~45vh rather than flex-1 so the modal
                stays compact instead of stretching down the whole screen,
                and two-up on desktop so a long list doesn't run tall. */}
            <div className="grid max-h-[45vh] grid-cols-1 gap-1.5 overflow-y-auto px-4 py-4 sm:grid-cols-2 sm:px-6">
              {matches.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-10 text-slate-400 sm:col-span-2">
                  <Building2 size={32} className="text-slate-300" />
                  <p className="text-sm font-medium">
                    No facility matches &ldquo;{query}&rdquo;
                  </p>
                </div>
              ) : (
                <>
                  {visible.map((facility) => (
                    <button
                      key={facility.facility_id}
                      onClick={() => handleSelect(facility.facility_id)}
                      className="group hover:border-primary/40 hover:bg-primary/5 flex w-full items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left transition-colors"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                        <Building2 size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-slate-700">
                          {facility.facility_name}
                        </p>
                        {facility.facility_lga && (
                          <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-slate-400">
                            <MapPin size={10} className="shrink-0" />
                            {facility.facility_lga}
                          </p>
                        )}
                      </div>
                      <span className="group-hover:text-primary flex shrink-0 items-center gap-0.5 text-[11px] font-medium text-slate-400">
                        View
                        <ChevronRight size={14} />
                      </span>
                    </button>
                  ))}

                  {hasMore && (
                    <button
                      onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                      className="hover:border-primary/40 hover:text-primary mt-1 w-full rounded-lg border border-dashed border-slate-200 py-2 text-xs font-medium text-slate-500 transition-colors sm:col-span-2"
                    >
                      Show {Math.min(PAGE_SIZE, matches.length - visible.length)}{" "}
                      more
                    </button>
                  )}
                </>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="flex shrink-0 justify-end border-t border-slate-100 px-4 py-3 sm:px-6 sm:py-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
}
