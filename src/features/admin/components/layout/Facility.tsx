"use client";

import React, { useState } from "react";
import { Calendar, ChevronUp, ChevronDown, Activity } from "lucide-react";
import { Button } from "../ui/button";
import { staffDatabase } from '@/features/admin/data/staffData';


export default function Facility() {
    const [isFacilityOverviewOpen, setIsFacilityOverviewOpen] = useState(true);
    const [isOperatingHoursOpen, setIsOperatingHoursOpen] = useState(true);
    const [isSpecialistsOpen, setIsSpecialistsOpen] = useState(true);
    const [isActivityOpen, setIsActivityOpen] = useState(true);

    // Get first 4 staff members to display as specialists
    const specialists = staffDatabase.slice(0, 4).map(staff => ({
        name: staff.name,
        email: `${staff.name.toLowerCase().replace(/\s+/g, '.')}@phalgahq.ng`,
        specialty: staff.rank
    }));

    return (
        <>
            <div className="w-full">
                {/* Header with Edit Profile Button */}
                <div className="flex justify-end mb-6">
                    <Button
                        type="button"
                        variant="default"
                        size="xl"
                        className="text-lg"
                    >
                        <Calendar size={18} />
                        Edit Profile
                    </Button>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Facility Overview Card */}
                    <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
                        {/* Card Header */}
                        <button
                            onClick={() => setIsFacilityOverviewOpen(!isFacilityOverviewOpen)}
                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <Activity size={20} className="text-slate-600" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-base font-bold text-slate-900">Facility Overview</h3>
                                    <p className="text-xs text-slate-500">Basic details about your facility</p>
                                </div>
                            </div>
                            {isFacilityOverviewOpen ? (
                                <ChevronUp size={20} className="text-slate-400" />
                            ) : (
                                <ChevronDown size={20} className="text-slate-400" />
                            )}
                        </button>

                        {/* Card Content */}
                        {isFacilityOverviewOpen && (
                            <div className="px-6 pb-6 pt-2">
                                <h4 className="font-medium text-slate-900 mb-3">Facility Description</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    A comprehensive healthcare facility providing primary and specialized medical services to the Lagos Island community. Our team of dedicated healthcare professionals is committed to delivering quality care with compassion and excellence.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Operating Hours Card */}
                    <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
                        {/* Card Header */}
                        <button
                            onClick={() => setIsOperatingHoursOpen(!isOperatingHoursOpen)}
                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <Activity size={20} className="text-slate-600" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-base font-bold text-slate-900">Operating Hours</h3>
                                    <p className="text-xs text-slate-500">When your facility is open</p>
                                </div>
                            </div>
                            {isOperatingHoursOpen ? (
                                <ChevronUp size={20} className="text-slate-400" />
                            ) : (
                                <ChevronDown size={20} className="text-slate-400" />
                            )}
                        </button>

                        {/* Card Content */}
                        {isOperatingHoursOpen && (
                            <div className="px-6 pb-6 pt-2">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Weekdays */}
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <p className="text-xs text-slate-500 mb-2">Weekdays (Mon-Fri)</p>
                                        <p className="text-xl font-bold text-slate-900">8:00am - 8:00pm</p>
                                    </div>

                                    {/* Weekends */}
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <p className="text-xs text-slate-500 mb-2">Weekends (Sat - Sun)</p>
                                        <p className="text-xl font-bold text-slate-900">9:00am - 5:00pm</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Specialists Availability Card */}
                    <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
                        {/* Card Header */}
                        <button
                            onClick={() => setIsSpecialistsOpen(!isSpecialistsOpen)}
                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <Activity size={20} className="text-slate-600" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-base font-bold text-slate-900">Specialist Availability</h3>
                                    <p className="text-xs text-slate-500">Healthcare professionals at your facility</p>
                                </div>
                            </div>
                            {isSpecialistsOpen ? (
                                <ChevronUp size={20} className="text-slate-400" />
                            ) : (
                                <ChevronDown size={20} className="text-slate-400" />
                            )}
                        </button>

                        {/* Card Content - Specialists List */}
                        {isSpecialistsOpen && (
                            <div className="p-6 space-y-3">
                                {specialists.map((specialist, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                                            {specialist.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-semibold text-slate-900">{specialist.name}</h4>
                                            <p className="text-xs text-slate-500">{specialist.email}</p>
                                            <p className="text-xs text-slate-400 mt-1">{specialist.specialty}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Activity Overview Card */}
                    <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
                        {/* Card Header */}
                        <button
                            onClick={() => setIsActivityOpen(!isActivityOpen)}
                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <Activity size={20} className="text-slate-600" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-base font-bold text-slate-900">Activity Overview</h3>
                                    <p className="text-xs text-slate-500">Read-only system information</p>
                                </div>
                            </div>
                            {isActivityOpen ? (
                                <ChevronUp size={20} className="text-slate-400" />
                            ) : (
                                <ChevronDown size={20} className="text-slate-400" />
                            )}
                        </button>

                        {/* Card Content - Activity Information */}
                        {isActivityOpen && (
                            <div className="p-6 space-y-4">
                                {/* Local Government Area */}
                                <div className="border-b border-gray-100">
                                    <p className=" text-slate-500 mb-1">Local Government Area</p>
                                    <p className="text-base font-medium text-slate-900 mb-2">Obio/Akpor</p>
                                </div>

                                {/* Facility ID */}
                                <div className="border-b border-gray-100">
                                    <p className="text-xs text-slate-500 mb-1">Facility ID</p>
                                    <p className="text-base font-medium text-slate-900 mb-2">CMC-001-2024</p>
                                </div>

                                {/* Geo-Coordinates */}
                                <div className="border-b border-gray-100">
                                    <p className="text-xs text-slate-500 mb-1">Geo-Coordinates</p>
                                    <p className="text-base font-medium text-slate-900 mb-2">6.4541, 3.3947</p>
                                </div>

                                {/* Map */}
                                <div className="mt-4">
                                    <div className="w-full h-48 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                                        <img
                                            src="https://api.mapbox.com/styles/v1/mapbox/light-v10/static/3.3947,6.4541,12,0/600x300@2x?access_token=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example"
                                            alt="Facility Location Map"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-slate-400"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>';
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}