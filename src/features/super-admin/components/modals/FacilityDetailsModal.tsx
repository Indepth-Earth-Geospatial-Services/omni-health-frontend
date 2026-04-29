"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { superAdminService } from "@/features/super-admin/services/super-admin.service";
import type { StaffMember } from "@/services/admin.service";
import SlideInModal from "./SlideInModal";
import { Button } from "@/features/admin/components/ui/button";
import {
  Phone,
  Mail,
  Edit,
  MessageSquare,
  MapPinIcon,
  Bed,
  Users,
  Star,
  Calendar,
  X,
  UserCircle,
  Search,
  Clock,
} from "lucide-react";

interface FacilityDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  facility: {
    facility_id?: string;
    hfr_id?: string;
    facility_name?: string;
    facility_category?: string;
    facility_lga?: string;
    address?: string;
    lat?: number;
    lon?: number;
    contact_info?: {
      phone?: string;
      email?: string;
    };
    inventory?: {
      equipment?: Record<string, unknown>;
      infrastructure?: Record<string, unknown>;
    };
    specialists?: string[];
    services_list?: string[];
    staff_count?: number;
    last_updated?: string;
    working_hours?: Record<string, unknown>;
  } | null;
  onEditFacility?: () => void;
}

type TabType = "overview" | "Staff" | "working_hours";

export default function FacilityDetailsModal({
  isOpen,
  onClose,
  facility,
  onEditFacility,
}: FacilityDetailsModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [staffSearch, setStaffSearch] = useState("");
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffError, setStaffError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !facility?.facility_id) return;
    const fetchStaff = async () => {
      setStaffLoading(true);
      setStaffError(null);
      try {
        const res = await superAdminService.getStaffByFacility(
          facility.facility_id!,
        );
        setStaffList(Array.isArray(res) ? res : []);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to load staff";
        setStaffError(message);
        setStaffList([]);
      } finally {
        setStaffLoading(false);
      }
    };
    fetchStaff();
  }, [isOpen, facility?.facility_id]);

  if (!facility) return null;

  const handleEditFacility = () => {
    onClose();
    onEditFacility?.();
  };

  // const handleContact = () => {
  //   if (facility.contact_info?.phone) {
  //     window.open(`tel:${facility.contact_info.phone}`);
  //   }
  // };

  const handleOpenMap = () => {
    if (facility.facility_id) {
      onClose();
      router.push(`/super-admin/map?facility_id=${facility.facility_id}`);
    }
  };

  return (
    <SlideInModal isOpen={isOpen} onClose={onClose} width="lg">
      <div className="flex h-full flex-col">
        {/* Header with facility name and close button */}
        <div className="flex items-center justify-between border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {facility.facility_name || "Facility Details"}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {/* {facility.hfr_id || "N/A"} */}
              {facility.facility_id || "N/A"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 transition-colors hover:bg-slate-100"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 px-6 py-3">
          <Button
            onClick={handleEditFacility}
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs"
          >
            <Edit size={14} />
            Edit Facility
          </Button>
          {/* <Button
            onClick={handleContact}
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs"
            disabled={!facility.contact_info?.phone}
          >
            <MessageSquare size={14} />
            Contact
          </Button> */}
          {/* <Button size="sm" variant="outline" className="gap-1.5 text-xs">
            <FileText size={14} />
            Request Report
          </Button> */}
          <Button
            onClick={handleOpenMap}
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs"
            disabled={!facility.facility_id}
          >
            <MapPinIcon size={14} />
            View on Map
          </Button>
        </div>

        {/* Tabs */}
        <div className="mx-4 rounded-2xl border bg-[#F6F8FA] px-3 py-2">
          <div className="flex justify-around gap-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`rounded-2xl px-8 py-2 text-sm font-normal transition-all ${
                activeTab === "overview"
                  ? "bg-[#E2E4E9] text-slate-900"
                  : "bg-transparent text-[#868C98] hover:bg-slate-300/50"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("Staff")}
              className={`rounded-2xl px-8 py-2 text-sm font-normal transition-all ${
                activeTab === "Staff"
                  ? "bg-[#E2E4E9] text-slate-900"
                  : "bg-transparent text-[#868C98] hover:bg-slate-300/50"
              }`}
            >
              Staff
            </button>

            <button
              onClick={() => setActiveTab("working_hours")}
              className={`rounded-2xl px-8 py-2 text-sm font-normal transition-all ${
                activeTab === "working_hours"
                  ? "bg-[#E2E4E9] text-slate-900"
                  : "bg-transparent text-[#868C98] hover:bg-slate-300/50"
              }`}
            >
              Working Hours
            </button>

            {/* <button
              onClick={() => setActiveTab("audit")}
              className={`rounded-2xl px-12 py-3 text-sm font-medium transition-all ${
                activeTab === "audit"
                  ? "bg-[#E2E4E9] text-slate-900"
                  : "bg-transparent text-[#868C98] hover:bg-slate-300/50"
              }`}
            >
              Audit
            </button> */}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "overview" && (
            <div className="space-y-6 p-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Bed Capacity */}
                <div className="flex flex-row rounded-lg border border-slate-200 bg-white p-4">
                  <div className="mr-6 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 p-2">
                    <Bed size={18} className="text-black" />
                  </div>
                  <div className="ml-4">
                    <div className="mb-2 flex items-center gap-2">
                      <p className="text-xs font-medium text-slate-600">
                        Staff
                      </p>
                    </div>
                    <p className="text-xl font-medium text-slate-900">
                      {staffLoading ? "—" : staffList.length}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">Total Staff</p>
                  </div>
                </div>

                {/* Staff on Duty */}
                <div className="flex flex-row rounded-lg border border-slate-200 bg-white p-4">
                  <div className="mr-6 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 p-2">
                    <Users size={18} className="text-black" />
                  </div>
                  <div className="ml-4">
                    <div className="mb-2 flex items-center gap-2">
                      <p className="text-xs font-medium text-slate-600">
                        Specialist
                      </p>
                    </div>
                    <p className="text-xl font-medium text-slate-900">
                      {facility.specialists?.length}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Total Specialists
                    </p>
                  </div>
                </div>

                {/* Equipment */}
                <div className="flex flex-row rounded-lg border border-slate-200 bg-white p-4">
                  <div className="mr-6 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 p-2">
                    <Star size={18} className="text-black" />
                  </div>
                  <div className="ml-4">
                    <div className="mb-2 flex items-center gap-2">
                      <p className="text-xs font-medium text-slate-600">
                        Equipments
                      </p>
                    </div>
                    <p className="text-xl font-medium text-slate-900">
                      {Object.keys(facility.inventory?.equipment ?? {}).length}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Total Equipment
                    </p>
                  </div>
                </div>

                {/* Infrastructure */}
                <div className="flex flex-row rounded-lg border border-slate-200 bg-white p-4">
                  <div className="mr-6 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 p-2">
                    <Calendar size={18} className="text-black" />
                  </div>
                  <div className="ml-4">
                    <div className="mb-2 flex items-center gap-2">
                      <p className="text-xs font-medium text-slate-600">
                        Infrastructure
                      </p>
                    </div>
                    <p className="text-xl font-medium text-slate-900">
                      {
                        Object.keys(facility.inventory?.infrastructure ?? {})
                          .length
                      }
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Total Infrastructure
                    </p>
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-slate-900">
                  Location
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="mb-1 text-xs font-medium text-slate-500">
                      Local Government Area
                    </p>
                    <p className="border-b border-gray-200 pb-2 text-sm text-slate-900">
                      {facility.facility_lga || "N/A"}
                    </p>
                  </div>
                  {facility.lat && facility.lon && (
                    <div>
                      <p className="mb-1 text-xs font-medium text-slate-500">
                        Geo-Coordinates
                      </p>
                      <p className="border-b border-gray-200 pb-2 text-sm text-slate-900">
                        {facility.lat.toFixed(4)}, {facility.lon.toFixed(4)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Facility Specialists */}
              <div>
                <div className="mb-2.5 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Facility Specialists
                  </h3>
                  {(facility.specialists?.length ?? 0) > 0 && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                      {facility.specialists!.length}
                    </span>
                  )}
                </div>
                {(facility.specialists?.length ?? 0) === 0 ? (
                  <p className="text-xs text-slate-400">No specialists listed</p>
                ) : (
                  <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto">
                    {facility.specialists!.map((name, idx) => {
                      const colors = [
                        "bg-blue-50 text-blue-700 border-blue-100",
                        "bg-violet-50 text-violet-700 border-violet-100",
                        "bg-indigo-50 text-indigo-700 border-indigo-100",
                        "bg-sky-50 text-sky-700 border-sky-100",
                      ];
                      return (
                        <span
                          key={idx}
                          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${colors[idx % colors.length]}`}
                        >
                          {name}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Services List */}
              <div>
                {(() => {
                  const COLORS = [
                    "bg-teal-50 text-teal-700 border-teal-100",
                    "bg-emerald-50 text-emerald-700 border-emerald-100",
                    "bg-green-50 text-green-700 border-green-100",
                    "bg-cyan-50 text-cyan-700 border-cyan-100",
                  ];
                  const services = (facility.services_list ?? [])
                    .flatMap((item) => item.split(/\s+/))
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((s) => s.charAt(0).toUpperCase() + s.slice(1));

                  return (
                    <>
                      <div className="mb-2.5 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-900">
                          Services Offered
                        </h3>
                        {services.length > 0 && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                            {services.length}
                          </span>
                        )}
                      </div>
                      {services.length === 0 ? (
                        <p className="text-xs text-slate-400">
                          No services listed
                        </p>
                      ) : (
                        <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto">
                          {services.map((name, idx) => (
                            <span
                              key={idx}
                              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${COLORS[idx % COLORS.length]}`}
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  {facility.contact_info?.phone && (
                    <div className="flex items-center gap-2 rounded bg-[#E2E4E9] px-4 py-2">
                      <Phone size={16} className="text-slate-400" />
                      <p className="text-sm text-[#868C98]">
                        +234 {facility.contact_info.phone}
                      </p>
                    </div>
                  )}
                  {facility.contact_info?.email && (
                    <div className="flex items-center gap-2 rounded bg-[#E2E4E9] px-4 py-2">
                      <Mail size={16} className="text-slate-400" />
                      <p className="text-sm text-[#868C98]">
                        {facility.contact_info.email}
                      </p>
                    </div>
                  )}
                  {!facility.contact_info?.phone &&
                    !facility.contact_info?.email && (
                      <p className="text-sm text-slate-500">
                        No contact information available
                      </p>
                    )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "Staff" && (
            <div className="p-6">
              {/* Search */}
              <div className="relative mb-4">
                <Search
                  size={16}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search staff..."
                  value={staffSearch}
                  onChange={(e) => setStaffSearch(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pr-4 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-200 focus:outline-none"
                />
              </div>

              {staffLoading ? (
                <div className="flex h-48 items-center justify-center text-slate-400">
                  <p className="text-sm">Loading staff...</p>
                </div>
              ) : staffError ? (
                <div className="flex h-48 flex-col items-center justify-center gap-2 text-slate-400">
                  <Users size={40} className="text-slate-300" />
                  <p className="text-sm font-medium text-red-500">
                    Could not load staff
                  </p>
                  <p className="max-w-xs text-center text-xs text-slate-400">
                    {staffError}
                  </p>
                </div>
              ) : staffList.length === 0 ? (
                <div className="flex h-48 flex-col items-center justify-center gap-2 text-slate-400">
                  <Users size={40} className="text-slate-300" />
                  <p className="text-sm font-medium">No staff found</p>
                  <p className="text-xs">
                    No staff have been assigned to this facility
                  </p>
                </div>
              ) : (
                <>
                  {/* Count */}
                  <p className="mb-3 text-xs font-medium text-slate-500">
                    {
                      staffList.filter((s) =>
                        s.full_name
                          .toLowerCase()
                          .includes(staffSearch.toLowerCase()),
                      ).length
                    }{" "}
                    staff member
                    {staffList.filter((s) =>
                      s.full_name
                        .toLowerCase()
                        .includes(staffSearch.toLowerCase()),
                    ).length !== 1
                      ? "s"
                      : ""}
                  </p>

                  <div className="space-y-2">
                    {staffList
                      .filter((s) =>
                        s.full_name
                          .toLowerCase()
                          .includes(staffSearch.toLowerCase()),
                      )
                      .map((member) => (
                        <div
                          key={member.staff_id}
                          className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
                            <UserCircle size={20} className="text-slate-500" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-slate-900">
                              {member.full_name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {member.rank_cadre ??
                                member.grade_level ??
                                "Staff"}
                            </p>
                          </div>
                          {member.is_active !== undefined && (
                            <span
                              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                                member.is_active
                                  ? "bg-green-100 text-green-700"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {member.is_active ? "Active" : "Inactive"}
                            </span>
                          )}
                        </div>
                      ))}
                    {staffList.filter((s) =>
                      s.full_name
                        .toLowerCase()
                        .includes(staffSearch.toLowerCase()),
                    ).length === 0 && (
                      <div className="flex h-32 flex-col items-center justify-center gap-2 text-slate-400">
                        <p className="text-sm">
                          No results for &quot;{staffSearch}&quot;
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "working_hours" && (
            <div className="p-6">
              {(() => {
                const DAY_ORDER = [
                  "monday",
                  "tuesday",
                  "wednesday",
                  "thursday",
                  "friday",
                  "saturday",
                  "sunday",
                ];
                const todayKey = new Date()
                  .toLocaleDateString("en-US", { weekday: "long" })
                  .toLowerCase();

                const formatHours = (value: unknown): string => {
                  if (!value) return "Closed";
                  if (typeof value === "string") return value;
                  if (typeof value === "object" && value !== null) {
                    const v = value as Record<string, unknown>;
                    const open = v.open ?? v.opening_time ?? v.start ?? v.from;
                    const close = v.close ?? v.closing_time ?? v.end ?? v.to;
                    if (open && close) return `${open} – ${close}`;
                    if (v.hours && typeof v.hours === "string") return v.hours;
                    if (v.is_closed === true || v.closed === true)
                      return "Closed";
                  }
                  return "—";
                };

                const isClosed = (value: unknown): boolean => {
                  if (!value) return true;
                  if (typeof value === "object" && value !== null) {
                    const v = value as Record<string, unknown>;
                    if (v.is_closed === true || v.closed === true) return true;
                  }
                  return false;
                };

                const hours = facility.working_hours ?? {};
                const entries = Object.entries(hours);

                if (entries.length === 0) {
                  return (
                    <div className="flex h-48 flex-col items-center justify-center gap-2 text-slate-400">
                      <Clock size={40} className="text-slate-300" />
                      <p className="text-sm font-medium">No hours available</p>
                      <p className="text-xs">
                        Working hours have not been set for this facility
                      </p>
                    </div>
                  );
                }

                const sorted = [...entries].sort(([a], [b]) => {
                  const ai = DAY_ORDER.indexOf(a.toLowerCase());
                  const bi = DAY_ORDER.indexOf(b.toLowerCase());
                  if (ai === -1 && bi === -1) return a.localeCompare(b);
                  if (ai === -1) return 1;
                  if (bi === -1) return -1;
                  return ai - bi;
                });

                return (
                  <div className="space-y-2">
                    {sorted.map(([day, value]) => {
                      const isToday = day.toLowerCase() === todayKey;
                      const closed = isClosed(value);
                      return (
                        <div
                          key={day}
                          className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
                            isToday
                              ? "border-blue-200 bg-blue-50"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                isToday ? "bg-blue-100" : "bg-slate-100"
                              }`}
                            >
                              <Clock
                                size={15}
                                className={
                                  isToday ? "text-blue-500" : "text-slate-400"
                                }
                              />
                            </div>
                            <div>
                              <p
                                className={`text-sm font-medium capitalize ${
                                  isToday ? "text-blue-700" : "text-slate-900"
                                }`}
                              >
                                {day}
                                {isToday && (
                                  <span className="ml-2 text-xs font-normal text-blue-400">
                                    Today
                                  </span>
                                )}
                              </p>
                              {!closed && (
                                <p className="text-xs text-slate-500">
                                  {formatHours(value)}
                                </p>
                              )}
                            </div>
                          </div>
                          <span
                            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              closed
                                ? "bg-red-50 text-red-500"
                                : "bg-green-50 text-green-600"
                            }`}
                          >
                            {closed ? "Closed" : "Open"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4">
          <Button onClick={onClose} variant="default" className="" size="lg">
            Cancel
          </Button>
        </div>
      </div>
    </SlideInModal>
  );
}
