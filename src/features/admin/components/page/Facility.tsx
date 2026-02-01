"use client";

import React, { useState } from "react";
import {
  Calendar,
  ChevronUp,
  ChevronDown,
  Activity,
  Clock,
  Users,
  MapPin,
} from "lucide-react";
import { Button } from "../ui/button";
import { useAuthStore } from "@/store/auth-store";
import { useFacility } from "@/hooks/useFacilities";
import { useAdminStaff } from "@/features/admin/hooks/useAdminStaff";

const LoadingSkeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded bg-slate-200 ${className}`} />
);

export default function Facility() {
  // Collapsible section states
  const [isFacilityOverviewOpen, setIsFacilityOverviewOpen] = useState(true);
  const [isOperatingHoursOpen, setIsOperatingHoursOpen] = useState(true);
  const [isStaffInventory, setIsStaffInventory] = useState(true);
  const [isSpecialistsOpen, setIsSpecialistsOpen] = useState(true);
  const [isActivityOpen, setIsActivityOpen] = useState(true);

  // Facility data
  const { facilityIds } = useAuthStore();
  const facilityId = facilityIds?.[0] || "";
  const { data: facilityData, isLoading, isError } = useFacility(facilityId);
  const facility = facilityData?.facility;

  // Staff data for Specialist Availability
  const {
    data: staffData,
    isLoading: isStaffLoading,
    isError: isStaffError,
  } = useAdminStaff(facilityId, 1, 50);

  // Time formatting helpers
  const formatTime = (time: string): string => {
    const match = time.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return time;

    let hour = parseInt(match[1], 10);
    const minute = match[2];
    const period = hour >= 12 ? "pm" : "am";

    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;

    return `${hour}:${minute}${period}`;
  };

  const formatTimeRange = (range: string): string => {
    if (!range || range === "Closed") return range;

    const parts = range.split("-");
    if (parts.length !== 2) return range;

    const start = formatTime(parts[0].trim());
    const end = formatTime(parts[1].trim());

    return `${start} - ${end}`;
  };

  const getWeekdayHours = () => {
    if (!facility?.working_hours) return "Not available";
    const { monday } = facility.working_hours;
    if (!monday) return "Not available";
    return formatTimeRange(monday);
  };

  const getWeekendHours = () => {
    if (!facility?.working_hours) return "Not available";
    const { saturday } = facility.working_hours;
    if (!saturday || saturday === "Closed") return "Closed";
    return formatTimeRange(saturday);
  };

  // Map helpers
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const getStaticMapUrl = () => {
    if (!facility?.lat || !facility?.lon || !mapboxToken) return null;
    return `https://api.mapbox.com/styles/v1/mapbox/light-v10/static/${facility.lon},${facility.lat},13,0/600x300@2x?access_token=${mapboxToken}`;
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex justify-end">
        <Button type="button" variant="default" size="xl" className="text-lg">
          <Calendar size={18} />
          Edit Profile
        </Button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ==================== FACILITY OVERVIEW ==================== */}
        <div className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white">
          <button
            onClick={() => setIsFacilityOverviewOpen(!isFacilityOverviewOpen)}
            className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                <Activity size={20} className="text-slate-600" />
              </div>
              <div className="text-left">
                <h3 className="font-geist text-[18px] font-medium text-black">
                  Facility Overview
                </h3>
                <p className="font-geist text-sm font-normal text-[#868C98]">
                  Basic details about your facility
                </p>
              </div>
            </div>
            {isFacilityOverviewOpen ? (
              <ChevronUp size={20} className="text-slate-400" />
            ) : (
              <ChevronDown size={20} className="text-slate-400" />
            )}
          </button>

          {isFacilityOverviewOpen && (
            <div className="px-6 pt-2 pb-6">
              {isLoading ? (
                <div className="space-y-3">
                  <LoadingSkeleton className="h-5 w-48" />
                  <LoadingSkeleton className="h-4 w-full" />
                  <LoadingSkeleton className="h-4 w-3/4" />
                </div>
              ) : isError ? (
                <p className="text-sm text-red-500">
                  Failed to load facility data
                </p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="font-geist mb-1.5 block text-[19px] font-normal text-black">
                      Facility Name
                    </label>
                    <div className="font-geist w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] font-normal text-[#868C98]">
                      {facility?.facility_name || "Not available"}
                    </div>
                  </div>

                  <div>
                    <label className="font-geist mb-1.5 block text-[19px] font-normal text-black">
                      Officer in-Charge
                    </label>
                    <div className="font-geist w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] font-normal text-[#868C98]">
                      {facility?.contact_info?.phone || "Not available"}
                    </div>
                  </div>

                  <div>
                    <label className="font-giest mb-1.5 block text-[19px] font-normal text-black">
                      Address
                    </label>
                    <div className="font-giest w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] font-normal text-[#868C98]">
                      {facility?.address || "Not available"}
                    </div>
                  </div>

                  <div>
                    <label className="font-geist mb-1.5 block text-[19px] font-normal text-black">
                      Facility Description
                    </label>
                    <div className="font-geist min-h-[100px] w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] leading-tight font-normal tracking-[0%] text-[#868C98]">
                      A comprehensive healthcare facility providing primary and
                      specialized medical services to the{" "}
                      {facility?.facility_lga || "local"} community. Our team of
                      dedicated healthcare professionals is committed to
                      delivering quality care with compassion and excellence.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ==================== RIGHT COLUMN (Operating Hours + Staff) ==================== */}
        <div className="flex flex-col gap-6">
          {/* Operating Hours */}
          <div className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white">
            <button
              onClick={() => setIsOperatingHoursOpen(!isOperatingHoursOpen)}
              className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                  <Clock size={20} className="text-slate-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-geist text-[18px] font-medium text-black">
                    Operating Hours
                  </h3>
                  <p className="font-geist text-sm font-normal text-[#868C98]">
                    When your facility is open
                  </p>
                </div>
              </div>
              {isOperatingHoursOpen ? (
                <ChevronUp size={20} className="text-slate-400" />
              ) : (
                <ChevronDown size={20} className="text-slate-400" />
              )}
            </button>

            {isOperatingHoursOpen && (
              <div className="px-6 pt-4 pb-3">
                {isLoading ? (
                  <div className="grid grid-cols-2 gap-3">
                    <LoadingSkeleton className="h-14 w-full rounded-xl" />
                    <LoadingSkeleton className="h-14 w-full rounded-xl" />
                  </div>
                ) : isError ? (
                  <p className="text-sm text-red-500">
                    Failed to load operating hours
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-6">
                      <p className="mb-0.5 py-2 text-[16px] text-slate-500">
                        Weekdays (Mon - Fri)
                      </p>
                      <p className="font-giest text-[24px] font-medium text-slate-900">
                        {getWeekdayHours()}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-6">
                      <p className="mb-0.5 py-2 text-[16px] text-slate-500">
                        Weekends (Sat - Sun)
                      </p>
                      <p className="font-giest text-[24px] font-medium text-slate-900">
                        {getWeekendHours()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ==================== STAFF INVENTORY ==================== */}
          <div className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white">
            <button
              onClick={() => setIsStaffInventory(!isStaffInventory)}
              className="flex w-full items-center justify-between px-6 py-3 transition-colors hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                  <Users size={20} className="text-slate-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-geist text-[18px] font-medium text-black">
                    Staff Inventory
                  </h3>
                  <p className="font-geist text-sm font-normal text-[#868C98]">
                    Number of Staff
                  </p>
                </div>
              </div>
              {isStaffInventory ? (
                <ChevronUp size={20} className="text-slate-400" />
              ) : (
                <ChevronDown size={20} className="text-slate-400" />
              )}
            </button>

            {isStaffInventory && (
              <div className="px-6 pb-6">
                <div className="py-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                    <Users size={28} className="text-[#868C98]" />
                  </div>
                  <p className="font-geist mb-1 text-[15px] font-normal text-[#868C98]">
                    Staff inventory data is not available
                  </p>
                  <p className="font-geist text-[13px] font-normal text-[#868C98]/70">
                    Staff category counts will appear here once the data is
                    provided by the backend.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ==================== SPECIALIST AVAILABILITY ==================== */}
        <div className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white">
          <button
            onClick={() => setIsSpecialistsOpen(!isSpecialistsOpen)}
            className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                <Users size={20} className="text-slate-600" />
              </div>
              <div className="text-left">
                <h3 className="font-geist text-[18px] font-medium text-black">
                  Specialist Availability
                </h3>
                <p className="font-geist text-sm font-normal text-[#868C98]">
                  Healthcare professionals at your facility
                </p>
              </div>
            </div>
            {isSpecialistsOpen ? (
              <ChevronUp size={20} className="text-slate-400" />
            ) : (
              <ChevronDown size={20} className="text-slate-400" />
            )}
          </button>

          {isSpecialistsOpen && (
            <div className="space-y-3 p-6">
              {isStaffLoading ? (
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <LoadingSkeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <LoadingSkeleton className="h-4 w-32" />
                        <LoadingSkeleton className="h-3 w-40" />
                        <LoadingSkeleton className="h-3 w-24" />
                      </div>
                    </div>
                  ))}
                </>
              ) : isStaffError ? (
                <p className="py-4 text-center text-sm text-red-500">
                  Failed to load specialists. Please try again later.
                </p>
              ) : staffData?.staff && staffData.staff.length > 0 ? (
                staffData.staff.map((staff) => (
                  <div
                    key={staff.staff_id}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#375DFB] text-sm font-medium text-white">
                      {staff.full_name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase() || "??"}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-geist text-[15px] font-medium text-black">
                        {staff.full_name || "Unknown"}
                      </h4>
                      <p className="font-geist text-[13px] text-[#868C98]">
                        {staff.email || "No email available"}
                      </p>
                      <p className="font-geist mt-0.5 text-[13px] text-[#375DFB]">
                        {staff.rank_cadre || "General Consulting"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="font-geist py-4 text-center text-sm text-[#868C98]">
                  No specialists listed for this facility
                </p>
              )}
            </div>
          )}
        </div>

        {/* ==================== ACTIVITY OVERVIEW ==================== */}
        <div className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white">
          <button
            onClick={() => setIsActivityOpen(!isActivityOpen)}
            className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                <Activity size={20} className="text-slate-600" />
              </div>
              <div className="text-left">
                <h3 className="font-geist text-[18px] font-medium text-black">
                  Activity Overview
                </h3>
                <p className="font-geist text-sm font-normal text-[#868C98]">
                  Read-only system information
                </p>
              </div>
            </div>
            {isActivityOpen ? (
              <ChevronUp size={20} className="text-slate-400" />
            ) : (
              <ChevronDown size={20} className="text-slate-400" />
            )}
          </button>

          {isActivityOpen && (
            <div className="space-y-4 p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border-b border-gray-100 pb-2">
                      <LoadingSkeleton className="mb-2 h-3 w-24" />
                      <LoadingSkeleton className="h-5 w-32" />
                    </div>
                  ))}
                  <LoadingSkeleton className="h-48 w-full rounded-xl" />
                </div>
              ) : isError ? (
                <p className="text-sm text-red-500">
                  Failed to load activity data
                </p>
              ) : (
                <>
                  <div className="border-b border-gray-100">
                    <p className="font-geist mb-1 text-[15px] font-normal text-[#868C98]">
                      Local Government Area
                    </p>
                    <p className="font-geist mb-2 text-[19px] font-normal text-black">
                      {facility?.facility_lga || "Not available"}
                    </p>
                  </div>

                  <div className="border-b border-gray-100">
                    <p className="mb-1 text-xs text-slate-500">Facility ID</p>
                    <p className="font-giest mb-2 text-[19px] font-normal text-black">
                      {facility?.facility_id || "Not available"}
                    </p>
                  </div>

                  <div className="border-b border-gray-100">
                    <p className="font-geist mb-1 text-[15px] font-normal text-[#868C98]">
                      Geo-Coordinates
                    </p>
                    <p className="font-geist mb-2 text-[19px] font-normal text-black">
                      {facility?.lat && facility?.lon
                        ? `${facility.lat.toFixed(4)}, ${facility.lon.toFixed(4)}`
                        : "Not available"}
                    </p>
                  </div>

                  <div className="mt-4">
                    <div className="h-48 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                      {getStaticMapUrl() ? (
                        <img
                          src={getStaticMapUrl()!}
                          alt="Facility Location Map"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            if (e.currentTarget.parentElement) {
                              e.currentTarget.parentElement.innerHTML =
                                '<div class="w-full h-full flex items-center justify-center text-slate-400"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>';
                            }
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                          <MapPin size={48} />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
