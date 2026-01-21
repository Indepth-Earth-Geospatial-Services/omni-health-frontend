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
import { useAdminStaff } from "@/hooks/useAdminStaff";

const LoadingSkeleton = ({ className }: { className?: string }) => (
    <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
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
        isError: isStaffError
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
            <div className="flex justify-end mb-6">
                <Button type="button" variant="default" size="xl" className="text-lg">
                    <Calendar size={18} />
                    Edit Profile
                </Button>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* ==================== FACILITY OVERVIEW ==================== */}
                <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
                    <button
                        onClick={() => setIsFacilityOverviewOpen(!isFacilityOverviewOpen)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                                <Activity size={20} className="text-slate-600" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-[18px] font-medium font-geist text-black">Facility Overview</h3>
                                <p className="text-sm text-[#868C98] font-geist font-normal">Basic details about your facility</p>
                            </div>
                        </div>
                        {isFacilityOverviewOpen ? (
                            <ChevronUp size={20} className="text-slate-400" />
                        ) : (
                            <ChevronDown size={20} className="text-slate-400" />
                        )}
                    </button>

                    {isFacilityOverviewOpen && (
                        <div className="px-6 pb-6 pt-2">
                            {isLoading ? (
                                <div className="space-y-3">
                                    <LoadingSkeleton className="h-5 w-48" />
                                    <LoadingSkeleton className="h-4 w-full" />
                                    <LoadingSkeleton className="h-4 w-3/4" />
                                </div>
                            ) : isError ? (
                                <p className="text-sm text-red-500">Failed to load facility data</p>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[19px] font-normal text-black mb-1.5 font-geist">
                                            Facility Name
                                        </label>
                                        <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-[15px] text-[#868C98] font-normal font-geist">
                                            {facility?.facility_name || "Not available"}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[19px] font-normal font-geist text-black mb-1.5">
                                            Officer in-Charge
                                        </label>
                                        <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-[15px] text-[#868C98] font-normal font-geist">
                                            {facility?.contact_info?.phone || "Not available"}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[19px] text-black mb-1.5 font-normal font-giest">
                                            Address
                                        </label>
                                        <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-[15px] text-[#868C98] font-normal font-giest">
                                            {facility?.address || "Not available"}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[19px] font-normal font-geist text-black mb-1.5">
                                            Facility Description
                                        </label>
                                        <div className=" w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-[15px] leading-tight tracking-[0%] font-normal font-geist text-[#868C98] min-h-[100px] ">
                                            A comprehensive healthcare facility providing primary and specialized
                                            medical services to the {facility?.facility_lga || "local"} community.
                                            Our team of dedicated healthcare professionals is committed to delivering
                                            quality care with compassion and excellence.
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
                    <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
                        <button
                            onClick={() => setIsOperatingHoursOpen(!isOperatingHoursOpen)}
                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <Clock size={20} className="text-slate-600" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-[18px] font-medium font-geist text-black">Operating Hours</h3>
                                    <p className="text-sm text-[#868C98] font-geist font-normal">When your facility is open</p>
                                </div>
                            </div>
                            {isOperatingHoursOpen ? (
                                <ChevronUp size={20} className="text-slate-400" />
                            ) : (
                                <ChevronDown size={20} className="text-slate-400" />
                            )}
                        </button>

                        {isOperatingHoursOpen && (
                            <div className="px-6 pb-3 pt-4">
                                {isLoading ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        <LoadingSkeleton className="h-14 w-full rounded-xl" />
                                        <LoadingSkeleton className="h-14 w-full rounded-xl" />
                                    </div>
                                ) : isError ? (
                                    <p className="text-sm text-red-500">Failed to load operating hours</p>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-6">
                                            <p className="text-[16px] text-slate-500 mb-0.5 py-2">Weekdays (Mon - Fri)</p>
                                            <p className="text-[24px] font-medium font-giest text-slate-900">{getWeekdayHours()}</p>
                                        </div>
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-6">
                                            <p className="text-[16px] text-slate-500 mb-0.5 py-2">Weekends (Sat - Sun)</p>
                                            <p className="text-[24px] font-medium font-giest text-slate-900">{getWeekendHours()}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ==================== STAFF INVENTORY ==================== */}
                    <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
                        <button
                            onClick={() => setIsStaffInventory(!isStaffInventory)}
                            className="w-full px-6 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <Users size={20} className="text-slate-600" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-[18px] font-medium font-geist text-black">Staff Inventory</h3>
                                    <p className="text-sm text-[#868C98] font-geist font-normal">Number of Staff</p>
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
                                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                                        <Users size={28} className="text-[#868C98]" />
                                    </div>
                                    <p className="text-[15px] text-[#868C98] font-geist font-normal mb-1">
                                        Staff inventory data is not available
                                    </p>
                                    <p className="text-[13px] text-[#868C98]/70 font-geist font-normal">
                                        Staff category counts will appear here once the data is provided by the backend.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ==================== SPECIALIST AVAILABILITY ==================== */}
                <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
                    <button
                        onClick={() => setIsSpecialistsOpen(!isSpecialistsOpen)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                <Users size={20} className="text-slate-600" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-[18px] font-medium font-geist text-black">Specialist Availability</h3>
                                <p className="text-sm text-[#868C98] font-geist font-normal">Healthcare professionals at your facility</p>
                            </div>
                        </div>
                        {isSpecialistsOpen ? (
                            <ChevronUp size={20} className="text-slate-400" />
                        ) : (
                            <ChevronDown size={20} className="text-slate-400" />
                        )}
                    </button>

                    {isSpecialistsOpen && (
                        <div className="p-6 space-y-3">
                            {isStaffLoading ? (
                                <>
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                                            <LoadingSkeleton className="w-10 h-10 rounded-full" />
                                            <div className="flex-1 space-y-2">
                                                <LoadingSkeleton className="h-4 w-32" />
                                                <LoadingSkeleton className="h-3 w-40" />
                                                <LoadingSkeleton className="h-3 w-24" />
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : isStaffError ? (
                                <p className="text-sm text-red-500 text-center py-4">
                                    Failed to load specialists. Please try again later.
                                </p>
                            ) : staffData?.staff && staffData.staff.length > 0 ? (
                                staffData.staff.map((staff) => (
                                    <div
                                        key={staff.staff_id}
                                        className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-[#375DFB] flex items-center justify-center text-white font-medium text-sm shrink-0">
                                            {staff.full_name
                                                ?.split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                                .substring(0, 2)
                                                .toUpperCase() || "??"}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-[15px] font-medium font-geist text-black">
                                                {staff.full_name || "Unknown"}
                                            </h4>
                                            <p className="text-[13px] text-[#868C98] font-geist">
                                                {staff.email || "No email available"}
                                            </p>
                                            <p className="text-[13px] text-[#375DFB] font-geist mt-0.5">
                                                {staff.rank_cadre || "General Consulting"}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-[#868C98] text-center py-4 font-geist">
                                    No specialists listed for this facility
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* ==================== ACTIVITY OVERVIEW ==================== */}
                <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
                    <button
                        onClick={() => setIsActivityOpen(!isActivityOpen)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                <Activity size={20} className="text-slate-600" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-[18px] font-medium font-geist text-black">Activity Overview</h3>
                                <p className="text-sm text-[#868C98] font-geist font-normal">Read-only system information</p>
                            </div>
                        </div>
                        {isActivityOpen ? (
                            <ChevronUp size={20} className="text-slate-400" />
                        ) : (
                            <ChevronDown size={20} className="text-slate-400" />
                        )}
                    </button>

                    {isActivityOpen && (
                        <div className="p-6 space-y-4">
                            {isLoading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="border-b border-gray-100 pb-2">
                                            <LoadingSkeleton className="h-3 w-24 mb-2" />
                                            <LoadingSkeleton className="h-5 w-32" />
                                        </div>
                                    ))}
                                    <LoadingSkeleton className="h-48 w-full rounded-xl" />
                                </div>
                            ) : isError ? (
                                <p className="text-sm text-red-500">Failed to load activity data</p>
                            ) : (
                                <>
                                    <div className="border-b border-gray-100">
                                        <p className="text-[15px] font-geist font-normal text-[#868C98] mb-1">Local Government Area</p>
                                        <p className="text-[19px] font-geist font-normal text-black mb-2">
                                            {facility?.facility_lga || "Not available"}
                                        </p>
                                    </div>

                                    <div className="border-b border-gray-100">
                                        <p className="text-xs text-slate-500 mb-1">Facility ID</p>
                                        <p className="text-[19px] font-normal text-black mb-2 font-giest">
                                            {facility?.facility_id || "Not available"}
                                        </p>
                                    </div>

                                    <div className="border-b border-gray-100">
                                        <p className="text-[15px] font-geist font-normal text-[#868C98] mb-1">Geo-Coordinates</p>
                                        <p className="text-[19px] font-geist font-normal text-black mb-2">
                                            {facility?.lat && facility?.lon
                                                ? `${facility.lat.toFixed(4)}, ${facility.lon.toFixed(4)}`
                                                : "Not available"}
                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        <div className="w-full h-48 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                                            {getStaticMapUrl() ? (
                                                <img
                                                    src={getStaticMapUrl()!}
                                                    alt="Facility Location Map"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = "none";
                                                        if (e.currentTarget.parentElement) {
                                                            e.currentTarget.parentElement.innerHTML =
                                                                '<div class="w-full h-full flex items-center justify-center text-slate-400"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>';
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400">
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
