"use client";

import { useState } from "react";
import SlideInModal from "./SlideInModal";
import { Button } from "@/features/admin/components/ui/button";
import {
  Phone,
  Mail,
  Edit,
  MessageSquare,
  FileText,
  MapPinIcon,
  Bed,
  Users,
  Star,
  Calendar,
  X,
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
    total_beds?: number;
    staff_count?: number;
    average_rating?: number;
    total_reviews?: number;
    last_updated?: string;
  } | null;
  onEditFacility?: () => void;
}

type TabType = "overview" | "metrics" | "audit";

export default function FacilityDetailsModal({
  isOpen,
  onClose,
  facility,
  onEditFacility,
}: FacilityDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  if (!facility) return null;

  const bedsFilled = facility.total_beds
    ? Math.floor(facility.total_beds * 0.18)
    : 0;
  const totalBeds = facility.total_beds || 450;
  const staffOnDuty = facility.staff_count || 48;
  const rating = facility.average_rating || 4.2;
  const reviewCount = facility.total_reviews || 0;
  const lastReport = facility.last_updated || "06/01/2026";

  const handleEditFacility = () => {
    onClose();
    onEditFacility?.();
  };

  const handleContact = () => {
    if (facility.contact_info?.phone) {
      window.open(`tel:${facility.contact_info.phone}`);
    }
  };

  const handleOpenMap = () => {
    if (facility.lat && facility.lon) {
      window.open(
        `https://www.google.com/maps?q=${facility.lat},${facility.lon}`,
        "_blank",
      );
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
              HC-1009-A
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
          <Button
            onClick={handleContact}
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs"
            disabled={!facility.contact_info?.phone}
          >
            <MessageSquare size={14} />
            Contact
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5 text-xs">
            <FileText size={14} />
            Request Report
          </Button>
          <Button
            onClick={handleOpenMap}
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs"
            disabled={!facility.lat || !facility.lon}
          >
            <MapPinIcon size={14} />
            Open Map
          </Button>
        </div>

        {/* Tabs */}
        <div className="mx-4 rounded-2xl border bg-[#F6F8FA] px-4 py-2">
          <div className="flex justify-between gap-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`rounded-2xl px-12 py-3 text-sm font-medium transition-all ${
                activeTab === "overview"
                  ? "bg-[#E2E4E9] text-slate-900"
                  : "bg-transparent text-[#868C98] hover:bg-slate-300/50"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("metrics")}
              className={`rounded-2xl px-12 py-3 text-sm font-medium transition-all ${
                activeTab === "metrics"
                  ? "bg-[#E2E4E9] text-slate-900"
                  : "bg-transparent text-[#868C98] hover:bg-slate-300/50"
              }`}
            >
              Metrics
            </button>

            <button
              onClick={() => setActiveTab("audit")}
              className={`rounded-2xl px-12 py-3 text-sm font-medium transition-all ${
                activeTab === "audit"
                  ? "bg-[#E2E4E9] text-slate-900"
                  : "bg-transparent text-[#868C98] hover:bg-slate-300/50"
              }`}
            >
              Audit
            </button>
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
                        Bed Capacity
                      </p>
                    </div>
                    <p className="text-xl font-medium text-slate-900">
                      {bedsFilled}/{totalBeds}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">Beds filled</p>
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
                        Staff on Duty
                      </p>
                    </div>
                    <p className="text-xl font-medium text-slate-900">
                      {staffOnDuty}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Medical Workers
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex flex-row rounded-lg border border-slate-200 bg-white p-4">
                  <div className="mr-6 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 p-2">
                    <Star size={18} className="text-black" />
                  </div>
                  <div className="ml-4">
                    <div className="mb-2 flex items-center gap-2">
                      <p className="text-xs font-medium text-slate-600">
                        Rating
                      </p>
                    </div>
                    <p className="text-xl font-medium text-slate-900">
                      {rating.toFixed(1)}/5.0
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Based on {reviewCount} reviews
                    </p>
                  </div>
                </div>

                {/* Last Report */}
                <div className="flex flex-row rounded-lg border border-slate-200 bg-white p-4">
                  <div className="mr-6 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 p-2">
                    <Calendar size={18} className="text-black" />
                  </div>
                  <div className="ml-4">
                    <div className="mb-2 flex items-center gap-2">
                      <p className="text-xs font-medium text-slate-600">
                        Last Report
                      </p>
                    </div>
                    <p className="text-xl font-medium text-slate-900">
                      {new Date(lastReport).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
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

              {/* Contact Information Section */}
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

          {activeTab === "metrics" && (
            <div className="p-6">
              <div className="flex h-64 items-center justify-center text-slate-500">
                <div className="text-center">
                  <FileText size={48} className="mx-auto mb-3 text-slate-300" />
                  <p className="text-sm font-medium">Metrics Coming Soon</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Performance metrics and analytics will be displayed here
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "audit" && (
            <div className="p-6">
              <div className="flex h-64 items-center justify-center text-slate-500">
                <div className="text-center">
                  <FileText size={48} className="mx-auto mb-3 text-slate-300" />
                  <p className="text-sm font-medium">Audit Logs Coming Soon</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Activity logs and audit trail will be displayed here
                  </p>
                </div>
              </div>
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
