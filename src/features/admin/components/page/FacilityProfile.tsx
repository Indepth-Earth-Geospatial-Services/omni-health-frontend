"use client";

import React from "react";
import {
  Calendar,
  Activity,
  Clock,
  Users,
  MapPin,
  Stethoscope,
  Star,
  Mail,
} from "lucide-react";
import { Button } from "../ui/button";
import { useCurrentFacilityId } from "@/features/auth/auth-store";
import { useFacility } from "@/hooks/use-facilities";
import { useCollapsibleSections } from "@/hooks/use-collapsible-sections";
import { CollapsibleSection, LoadingSkeleton } from "../ui/CollapsibleSection";
import EditFacilityProfileModal from "../modals/EditFacilityProfileModal";
import {
  formatTimeRange,
  formatDate,
  formatSpecialistName,
  formatServiceName,
} from "../../utils/formatters";
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
import { MAPBOX_TOKEN } from "@/constants";

// Section configuration
const SECTIONS = [
  { id: "facilityOverview", label: "Facility Overview", defaultOpen: true },
  { id: "operatingHours", label: "Operating Hours", defaultOpen: true },
  { id: "services", label: "Services", defaultOpen: true },
  { id: "specialists", label: "Specialists", defaultOpen: true },
  { id: "activity", label: "Activity", defaultOpen: true },
];

export default function FacilityProfile() {
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const sections = useCollapsibleSections(SECTIONS);

  // Facility data
  const facilityId = useCurrentFacilityId();
  const { data: facilityData, isLoading, isError } = useFacility(facilityId);
  const facility = facilityData?.facility;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex items-center justify-end">
        <Button
          type="button"
          variant="default"
          size="xl"
          className="shrink-0 text-sm sm:text-lg"
          onClick={() => setIsEditModalOpen(true)}
        >
          <Calendar size={18} />
          Edit Profile
        </Button>
      </div>

      <EditFacilityProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        facilityId={facilityId}
        currentData={facility}
      />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Facility Overview */}
        <CollapsibleSection
          title="Facility Overview"
          description="Basic details about your facility"
          icon={<Activity size={20} className="text-slate-600" />}
          isOpen={sections.isOpen("facilityOverview")}
          onToggle={() => sections.toggle("facilityOverview")}
        >
          <FacilityOverviewContent
            facility={facility}
            isLoading={isLoading}
            isError={isError}
          />
        </CollapsibleSection>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Operating Hours */}
          <CollapsibleSection
            title="Operating Hours"
            description="When your facility is open"
            icon={<Clock size={20} className="text-slate-600" />}
            isOpen={sections.isOpen("operatingHours")}
            onToggle={() => sections.toggle("operatingHours")}
          >
            <OperatingHoursContent
              workingHours={facility?.working_hours as Record<string, string> | undefined}
              isLoading={isLoading}
              isError={isError}
            />
          </CollapsibleSection>

          {/* Staff Inventory */}
          {/* <CollapsibleSection
            title="Staff Inventory"
            description="Number of Staff"
            icon={<Users size={20} className="text-slate-600" />}
            isOpen={sections.isOpen("staffInventory")}
            onToggle={() => sections.toggle("staffInventory")}
            maxHeight="360px"
          >
            <StaffInventoryContent />
          </CollapsibleSection> */}

          {/* Services */}
          <CollapsibleSection
            title="Service List"
            description="Medical services offered"
            icon={<Stethoscope size={20} className="text-slate-600" />}
            isOpen={sections.isOpen("services")}
            onToggle={() => sections.toggle("services")}
            maxHeight="600px"
          >
            <ServicesContent
              services={facility?.services_list}
              isLoading={isLoading}
            />
          </CollapsibleSection>
        </div>

        {/* Specialists */}
        <CollapsibleSection
          title="Specialist Availability"
          description="Healthcare professionals at your facility"
          icon={<Users size={20} className="text-slate-600" />}
          isOpen={sections.isOpen("specialists")}
          onToggle={() => sections.toggle("specialists")}
          maxHeight="560px"
        >
          <SpecialistsContent
            specialists={facility?.specialists}
            isLoading={isLoading}
            isError={isError}
          />
        </CollapsibleSection>

        {/* Activity Overview */}
        <CollapsibleSection
          title="Activity Overview"
          description="Read-only system information"
          icon={<Activity size={20} className="text-slate-600" />}
          isOpen={sections.isOpen("activity")}
          onToggle={() => sections.toggle("activity")}
          maxHeight="560px"
        >
          <ActivityContent
            facility={facility}
            isLoading={isLoading}
            isError={isError}
          />
        </CollapsibleSection>
      </div>
    </div>
  );
}

// ============ Sub Components ============

// Facility type for component props
interface FacilityData {
  facility_id?: string;
  facility_name?: string;
  facility_category?: string;
  facility_lga?: string;
  town?: string;
  address?: string;
  lat?: number;
  lon?: number;
  // average_rating?: number;
  // total_reviews?: number;
  last_updated?: string | Date;
  working_hours?: {
    monday?: string;
    saturday?: string;
    [key: string]: string | undefined;
  };
  contact_info?: {
    phone?: string;
    email?: string;
  };
  services_list?: string[];
  specialists?: string[];
}

interface FacilityOverviewContentProps {
  facility: FacilityData | undefined;
  isLoading: boolean;
  isError: boolean;
}

function FacilityOverviewContent({
  facility,
  isLoading,
  isError,
}: FacilityOverviewContentProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 pt-2">
        <LoadingSkeleton className="h-5 w-48" />
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="pt-2 text-sm text-red-500">Failed to load facility data</p>
    );
  }

  return (
    <div className="space-y-4 pt-2">
      <FieldDisplay label="Facility Name" value={facility?.facility_name} />
      <FieldDisplay label="Address" value={facility?.address} />
      <FieldDisplay label="Category" value={facility?.facility_category} />

      <div>
        <label className="font-geist mb-1.5 block text-[19px] font-normal text-black">
          Facility Description
        </label>
        <div className="font-geist min-h-[100px] w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] leading-tight font-normal tracking-[0%] text-[#868C98]">
          A comprehensive healthcare facility providing primary and specialized
          medical services to the{" "}
          {facility?.town || facility?.facility_lga || "local"} community. Our
          team of dedicated healthcare professionals is committed to delivering
          quality care with compassion and excellence.
        </div>
      </div>

      {/* Contact & Performance */}
      <div className="mt-6 border-t border-slate-100 pt-4">
        <h4 className="mb-4 text-[17px] font-medium text-slate-800">
          Contact & Performance
        </h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FieldDisplay
            label="Officer in-Charge / Phone"
            value={facility?.contact_info?.phone}
            small
          />
          <div>
            <label className="mb-1 block text-sm text-slate-500">
              Contact Email
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-[#868C98]">
              <Mail size={16} className="text-slate-400" />
              <span className="truncate">
                {facility?.contact_info?.email || "N/A"}
              </span>
            </div>
          </div>
          {/* <div>
            <label className="mb-1 block text-sm text-slate-500">
              Average Rating
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-[#868C98]">
              <Star size={16} className="fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-slate-700">
                {facility?.average_rating || 0}
              </span>
              <span className="text-xs text-slate-400">
                ({facility?.total_reviews || 0} reviews)
              </span>
            </div>
          </div> */}
          <FieldDisplay
            label="Last Updated"
            value={formatDate(String(facility?.last_updated || ""))}
            small
          />
        </div>
      </div>
    </div>
  );
}

function FieldDisplay({
  label,
  value,
  small,
}: {
  label: string;
  value?: string;
  small?: boolean;
}) {
  if (small) {
    return (
      <div>
        <label className="mb-1 block text-sm text-slate-500">{label}</label>
        <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-[#868C98]">
          {value || "Not available"}
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="font-geist mb-1.5 block text-[19px] font-normal text-black">
        {label}
      </label>
      <div className="font-geist w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] font-normal text-[#868C98]">
        {value || "Not available"}
      </div>
    </div>
  );
}

function OperatingHoursContent({
  workingHours,
  isLoading,
  isError,
}: {
  workingHours: Record<string, string> | undefined;
  isLoading: boolean;
  isError: boolean;
}) {
  if (isLoading) {
    return (
      <div className="space-y-2 pt-4">
        {[1, 2, 3, 4].map((i) => (
          <LoadingSkeleton key={i} className="h-9 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="pt-4 text-sm text-red-500">Failed to load operating hours</p>
    );
  }

  const DAY_ORDER = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
  const entries = workingHours
    ? Object.entries(workingHours).sort(([a], [b]) => {
        const ai = DAY_ORDER.indexOf(a.toLowerCase());
        const bi = DAY_ORDER.indexOf(b.toLowerCase());
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      })
    : [];

  if (entries.length === 0) {
    return (
      <p className="pt-4 text-center text-sm text-slate-400">
        No operating hours set
      </p>
    );
  }

  return (
    <div className="space-y-1.5 pt-4">
      {entries.map(([day, hours]) => {
        const isClosed = !hours || hours.toLowerCase() === "closed";
        return (
          <div
            key={day}
            className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2.5 sm:px-4"
          >
            <span className="truncate text-sm font-medium capitalize text-slate-700">
              {day}
            </span>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap sm:px-2.5 sm:text-xs ${
                isClosed
                  ? "bg-red-50 text-red-500"
                  : "bg-green-50 text-green-600"
              }`}
            >
              {isClosed ? "Closed" : formatTimeRange(hours)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// function StaffInventoryContent() {
//   return (
//     <div className="py-8 text-center">
//       <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
//         <Users size={28} className="text-[#868C98]" />
//       </div>
//       <p className="font-geist mb-1 text-[15px] font-normal text-[#868C98]">
//         Staff inventory data is not available
//       </p>
//       <p className="font-geist text-[13px] font-normal text-[#868C98]/70">
//         Staff category counts will appear here once the data is provided by the
//         backend.
//       </p>
//     </div>
//   );
// }

function ServicesContent({
  services,
  isLoading,
}: {
  services?: string[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2 py-4">
        <LoadingSkeleton className="h-8 w-24 rounded-full" />
        <LoadingSkeleton className="h-8 w-32 rounded-full" />
        <LoadingSkeleton className="h-8 w-20 rounded-full" />
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-slate-400">
        No services listed
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 py-6">
      {services.map((service, idx) => (
        <span
          key={idx}
          className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
        >
          {formatServiceName(service)}
        </span>
      ))}
    </div>
  );
}

function SpecialistsContent({
  specialists,
  isLoading,
  isError,
}: {
  specialists?: string[];
  isLoading: boolean;
  isError: boolean;
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <LoadingSkeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <LoadingSkeleton className="h-4 w-32" />
              <LoadingSkeleton className="h-3 w-40" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="py-4 text-center text-sm text-red-500">
        Failed to load specialists. Please try again later.
      </p>
    );
  }

  if (!specialists || specialists.length === 0) {
    return (
      <p className="font-geist py-4 text-center text-sm text-[#868C98]">
        No specialists listed for this facility
      </p>
    );
  }

  return (
    <div className="max-h-90 space-y-3 overflow-y-auto">
      {specialists.map((specialist, idx) => {
        const formattedName = formatSpecialistName(specialist);
        return (
          <div
            key={idx}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#868C98] text-sm font-medium text-white">
              {formattedName.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
              <div className="min-w-0">
                <h4 className="font-geist truncate text-[15px] font-medium text-black">
                  {formattedName}
                </h4>
                <p className="font-geist truncate text-[13px] text-[#868C98]">
                  Facility Specialist
                </p>
              </div>
              <div className="flex shrink-0 items-center">
                <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-green-700">
                  Available
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ActivityContent({
  facility,
  isLoading,
  isError,
}: {
  facility: FacilityData | undefined;
  isLoading: boolean;
  isError: boolean;
}) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border-b border-gray-100 pb-2">
            <LoadingSkeleton className="mb-2 h-3 w-24" />
            <LoadingSkeleton className="h-5 w-32" />
          </div>
        ))}
        <LoadingSkeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-sm text-red-500">Failed to load activity data</p>;
  }

  return (
    <div className="space-y-4">
      <InfoRow
        label="Local Government Area"
        value={facility?.town || facility?.facility_lga}
      />
      <InfoRow label="Facility ID" value={facility?.facility_id} />
      <InfoRow
        label="Geo-Coordinates"
        value={
          facility?.lat && facility?.lon
            ? `${facility.lat.toFixed(4)}, ${facility.lon.toFixed(4)}`
            : undefined
        }
      />

      <div className="mt-4">
        <div className="h-56 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          {facility?.lat && facility?.lon ? (
            <Map
              initialViewState={{
                longitude: facility.lon,
                latitude: facility.lat,
                zoom: 15,
              }}
              style={{ width: "100%", height: "100%" }}
              mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
              mapboxAccessToken={MAPBOX_TOKEN}
            >
              <NavigationControl position="top-right" />
              <Marker
                longitude={facility.lon}
                latitude={facility.lat}
                anchor="center"
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute h-16 w-16 animate-ping rounded-full bg-teal-400 opacity-20" />
                  <span
                    className="absolute h-9 w-9 animate-ping rounded-full bg-teal-500 opacity-30"
                    style={{ animationDelay: "0.4s" }}
                  />
                  <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 shadow-lg ring-2 ring-white">
                    <MapPin size={14} className="text-white" />
                  </div>
                </div>
              </Marker>
            </Map>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400">
              <MapPin size={32} className="opacity-40" />
              <p className="text-sm">No location data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="border-b border-gray-100">
      <p className="font-geist mb-1 text-[15px] font-normal text-[#868C98]">
        {label}
      </p>
      {/* Facility ID is a UUID with no spaces — it has to be allowed to break
          mid-string or it pushes the whole card wider than the viewport. */}
      <p className="font-geist mb-2 text-[17px] font-normal wrap-break-word text-black sm:text-[19px]">
        {value || "Not available"}
      </p>
    </div>
  );
}
