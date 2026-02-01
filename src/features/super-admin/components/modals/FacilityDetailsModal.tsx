"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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

/**
 * Helper function to count all bed-related equipment in a facility's inventory
 * Filters equipment keys that contain 'bed' or 'beds' (case-insensitive)
 */
const countBeds = (equipment: Record<string, unknown> | undefined): number => {
  if (!equipment) return 0;

  let totalBeds = 0;

  Object.entries(equipment).forEach(([key, value]) => {
    if (key.toLowerCase().includes("bed")) {
      if (Array.isArray(value)) {
        totalBeds += value.length;
      } else if (typeof value === "number") {
        totalBeds += value;
      } else if (value) {
        totalBeds += 1;
      }
    }
  });

  return totalBeds;
};

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
    total_beds?: number;
    staff_count?: number;
    average_rating?: number;
    total_reviews?: number;
    last_updated?: string;
  } | null;
  onEditFacility?: () => void;
}

type TabType = "overview";

export default function FacilityDetailsModal({
  isOpen,
  onClose,
  facility,
  onEditFacility,
}: FacilityDetailsModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Calculate bed capacity from equipment inventory
  const totalBeds = useMemo(() => {
    if (!facility) return 0;
    if (facility.total_beds) return facility.total_beds;
    return countBeds(facility.inventory?.equipment);
  }, [facility]);

  // Get staff count from specialists array or staff_count
  const staffOnDuty = useMemo(() => {
    if (!facility) return 0;
    if (facility.staff_count) return facility.staff_count;
    if (facility.specialists?.length) return facility.specialists.length;
    return 0;
  }, [facility]);

  // Get rating from facility endpoint
  const rating = facility?.average_rating ?? 0;
  const reviewCount = facility?.total_reviews ?? 0;

  // Get last report date from last_updated
  const lastReport = facility?.last_updated || null;

  if (!facility) return null;

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

            {/* <button
              onClick={() => setActiveTab("metrics")}
              className={`rounded-2xl px-12 py-3 text-sm font-medium transition-all ${
                activeTab === "metrics"
                  ? "bg-[#E2E4E9] text-slate-900"
                  : "bg-transparent text-[#868C98] hover:bg-slate-300/50"
              }`}
            >
              Metrics
            </button> */}

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
                        Bed Capacity
                      </p>
                    </div>
                    <p className="text-xl font-medium text-slate-900">
                      {totalBeds}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Total beds available
                    </p>
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
                        Staff Count
                      </p>
                    </div>
                    <p className="text-xl font-medium text-slate-900">
                      {staffOnDuty}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {facility.specialists?.length
                        ? "Specialists"
                        : "Medical staff"}
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
                      {lastReport
                        ? new Date(lastReport).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "N/A"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">Last updated</p>
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

          {/* {activeTab === "metrics" && (
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
          )} */}

          {/* {activeTab === "audit" && (
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
        </div> */}
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
