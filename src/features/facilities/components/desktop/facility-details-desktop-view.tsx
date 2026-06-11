"use client";

import { useMemo } from "react";
import { Facility } from "@/types";
import {
  formatDate,
  formatRating,
  getFacilityDefaults,
  getToday,
} from "@/lib/utils";
import compass from "@assets/img/icons/svg/compass-rose.svg";
import {
  ArrowLeft,
  Bed,
  Calendar,
  Mail,
  MapPin,
  Phone,
  Star,
  Stethoscope,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const days = [
  { key: "monday", label: "Mon" },
  { key: "tuesday", label: "Tue" },
  { key: "wednesday", label: "Wed" },
  { key: "thursday", label: "Thu" },
  { key: "friday", label: "Fri" },
  { key: "saturday", label: "Sat" },
  { key: "sunday", label: "Sun" },
] as const;

const todayKey = getToday();

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3 text-sm font-semibold text-gray-900">{children}</h3>;
}

interface FacilityDetailsDesktopViewProps {
  facility: Facility;
  onClose: () => void;
}

export function FacilityDetailsDesktopView({
  facility,
  onClose,
}: FacilityDetailsDesktopViewProps) {
  const facilityData = useMemo(() => getFacilityDefaults(facility), [facility]);

  const {
    facility_name,
    facility_category,
    facility_lga,
    town,
    address,
    avg_daily_patients,
    doctor_patient_ratio,
    inventory,
    services_list,
    specialists,
    image_urls,
    working_hours,
    contact_info,
    average_rating,
    total_reviews,
    last_updated,
    hfr_id,
  } = facilityData;

  const email = contact_info?.email || "";
  const phone = contact_info?.phone || "";
  const formattedRating = formatRating(average_rating);

  const formattedLastUpdated = formatDate(last_updated);

  const totalBeds =
    (inventory?.equipment?.inpatient_beds_with_mattress || 0) +
    (inventory?.equipment?.baby_cots || 0) +
    (inventory?.equipment?.delivery_bed || 0) +
    (inventory?.equipment?.work_surface_for_resuscitation_of_newborn_paediatric_resuscitation_bed_with_radiant_warmer || 0);

  const eq = inventory?.equipment || {};
  const equipmentItems = [
    { label: "Inpatient Beds", value: eq.inpatient_beds_with_mattress || 0, icon: <Bed className="h-4 w-4" /> },
    { label: "Delivery Beds", value: eq.delivery_bed || 0, icon: <Bed className="h-4 w-4" /> },
    { label: "Baby Cots", value: eq.baby_cots || 0, icon: <Bed className="h-4 w-4" /> },
    { label: "Resuscitation Beds", value: eq.work_surface_for_resuscitation_of_newborn_paediatric_resuscitation_bed_with_radiant_warmer || 0, icon: <Bed className="h-4 w-4" /> },
    { label: "Stethoscopes", value: eq.stethoscope_littman || 0, icon: <Stethoscope className="h-4 w-4" /> },
    { label: "Sphygmomanometers", value: eq.sphygmomanometer || 0, icon: <Stethoscope className="h-4 w-4" /> },
    { label: "Refrigerators", value: (eq.refrigerator_100_120l_capacity || 0) + (eq.refrigerator_medium_60l || 0) + (eq.solar_direct_drive_sdd_refrigerator || 0), icon: <Stethoscope className="h-4 w-4" /> },
  ].filter((item) => item.value !== undefined);

  const additionalInfo = [
    { label: "HFR ID", value: hfr_id },
    { label: "LGA", value: facility_lga },
    { label: "Town", value: town },
    { label: "Category", value: facility_category },
  ].filter((info) => info.value);

  const hasImages = image_urls && image_urls.length > 0;

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center gap-3">
            <Button
              onClick={onClose}
              className="shrink-0 rounded-full bg-[#E2E4E9]"
              size="icon-sm"
            >
              <ArrowLeft size={20} color="black" />
            </Button>
            <h1 className="truncate text-xl font-bold">{facility_name}</h1>
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
            {facility_category && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                {facility_category}
              </span>
            )}
            {(town || facility_lga) && (
              <span className="flex items-center gap-1">
                <MapPin size={13} />
                {town && facility_lga ? `${town}, ${facility_lga}` : town || facility_lga}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Star size={13} className="text-yellow-500" />
              {formattedRating}
              {total_reviews !== undefined && (
                <span className="text-gray-400">({total_reviews})</span>
              )}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-y-1">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="font-medium text-gray-700">Beds:</span>
                {totalBeds || "0"}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="font-medium text-gray-700">Specialists:</span>
                {specialists.length || "0"}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={12} />
                <span className="font-medium text-gray-700">Updated:</span>
                {formattedLastUpdated}
              </span>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                size="sm"
                className="bg-primary rounded-full text-[13px]"
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lon}&travelmode=driving`,
                    "_blank",
                  )
                }
              >
                <Image src={compass} alt="" className="mr-1.5 size-3.5 object-cover" />
                Directions
              </Button>
              {phone && (
                <Button
                  onClick={() => window.open(`tel:0${phone}`)}
                  size="sm"
                  variant="outline"
                  className="rounded-full border border-gray-300 text-[13px]"
                >
                  <Phone size={14} className="mr-1.5" />
                  Call
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="scrollbar-hide flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl space-y-5 px-6 py-6">
          {/* Image Gallery */}
          {hasImages && (
            <div className="grid grid-cols-4 gap-3 overflow-hidden rounded-xl">
              {image_urls.slice(0, 4).map((url, i) => (
                <div key={i} className="relative aspect-[4/3]">
                  <Image src={url} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Row: Services | Working Hours | Contact */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* Services */}
            {services_list.length > 0 && (
              <Card>
                <CardTitle>Services</CardTitle>
                <div className="flex flex-wrap gap-1.5">
                  {services_list.map((s, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Working Hours */}
            {working_hours && Object.keys(working_hours).length > 0 && (
              <Card>
                <CardTitle>Working Hours</CardTitle>
                <div className="space-y-1">
                  {days.map((day) => {
                    const hours = working_hours[day.key];
                    const isToday = todayKey === day.key;
                    return (
                      <div
                        key={day.key}
                        className={`flex items-center justify-between rounded px-2 py-1 text-xs ${
                          isToday ? "bg-blue-50 font-medium text-blue-800" : "text-gray-600"
                        }`}
                      >
                        <span>{day.label}</span>
                        <span className={!hours || hours === "Closed" ? "text-red-500" : ""}>
                          {hours || "—"}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {working_hours.emergency === "24/7" && (
                  <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                    24/7 Emergency Services
                  </div>
                )}
              </Card>
            )}

            {/* Contact */}
            {phone || email || address ? (
              <Card>
                <CardTitle>Contact</CardTitle>
                <div className="space-y-2.5 text-xs">
                  {phone && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone size={14} className="shrink-0 text-gray-400" />
                      <span>0{phone}</span>
                    </div>
                  )}
                  {email && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail size={14} className="shrink-0 text-gray-400" />
                      <span className="truncate">{email}</span>
                    </div>
                  )}
                  {address && (
                    <div className="flex items-start gap-2 text-gray-700">
                      <MapPin size={14} className="mt-0.5 shrink-0 text-gray-400" />
                      <span>{address}</span>
                    </div>
                  )}
                </div>
              </Card>
            ) : null}
          </div>

          {/* Stats row */}
          <Card>
            <CardTitle>Statistics</CardTitle>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatBox label="Avg Daily Patients" value={avg_daily_patients != null ? String(avg_daily_patients) : "N/A"} color="blue" />
              <StatBox label="Doctor Ratio" value={doctor_patient_ratio != null ? `1:${doctor_patient_ratio}` : "N/A"} color="green" />
              <StatBox label="Total Beds" value={String(totalBeds)} color="purple" />
              <StatBox label="Baby Cots" value={inventory?.infrastructure?.baby_cots != null ? String(inventory.infrastructure.baby_cots) : "N/A"} color="orange" />
            </div>
          </Card>

          {/* Specialists */}
          {specialists.length > 0 && (
            <Card>
              <CardTitle>Available Specialists</CardTitle>
              <div className="flex flex-wrap gap-1.5">
                {specialists.map((s, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Medical Equipment */}
          {equipmentItems.length > 0 && (
            <Card>
              <CardTitle>Medical Equipment</CardTitle>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {equipmentItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5"
                  >
                    <span className="text-xs font-medium text-gray-700">{item.label}</span>
                    <span className="text-sm font-bold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Additional Info */}
          {additionalInfo.length > 0 && (
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
              {additionalInfo.map((info, i) => (
                <span key={i}>
                  <span className="font-medium text-gray-700">{info.label}:</span> {info.value}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const statColors = {
  blue: "bg-blue-50 text-blue-800 border-blue-200",
  green: "bg-green-50 text-green-800 border-green-200",
  purple: "bg-purple-50 text-purple-800 border-purple-200",
  orange: "bg-orange-50 text-orange-800 border-orange-200",
};

function StatBox({ label, value, color = "blue" }: { label: string; value: string; color?: keyof typeof statColors }) {
  return (
    <div className={`rounded-lg border p-3 text-center ${statColors[color]}`}>
      <p className="text-xs opacity-75">{label}</p>
      <p className="mt-0.5 text-lg font-bold">{value}</p>
    </div>
  );
}
