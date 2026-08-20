"use client";
import { Button } from "@/components/ui/button";
import { useUserLocation } from "@/features/user/hooks/use-user-location";
import { useUserStore } from "@/features/user/store/user-store";
import { Facility } from "@/features/user/types";
import {
  formatDate,
  getFacilityDefaults,
  getWorkingHoursForDisplay,
} from "@/lib/utils";
import compass from "@assets/img/icons/svg/compass-rose.svg";
import {
  Calendar as CalendarIcon,
  CircleAlert,
  Clock,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { ContactSection } from "../molecules/contact-section";
import { ImageGallery } from "../molecules/image-gallery";
import { ServicesSection } from "../molecules/service-section";
import { WorkingHoursSection } from "../molecules/working-hours-section";

interface FacilityDetailsBaseProps {
  facility: Facility;
  onShowDirections?: () => void;
  onClose?: () => void;
}

function FacilityDetailsBase({
  facility,
  onShowDirections,
  onClose,
}: FacilityDetailsBaseProps) {
  const { requestLocation } = useUserLocation();

  const userLocation = useUserStore((state) => state.userLocation);
  const permissionState = useUserStore((state) => state.permissionState);

  const hasDirectionsFlow = !!onShowDirections;
  const isLocationReady = !!userLocation;
  const isLocationDenied = permissionState === "denied";

  const facilityData = useMemo(() => getFacilityDefaults(facility), [facility]);

  const {
    facility_name,
    facility_category,
    facility_lga,
    town,
    address,
    services_list,
    image_urls,
    working_hours,
    contact_info,
    last_updated,
  } = facilityData;

  const email = contact_info?.email || "";
  const phone = contact_info?.phone || "";

  const formattedLastUpdated = formatDate(last_updated);
  const workingHoursText = getWorkingHoursForDisplay(working_hours);

  const handleCallFacility = () => {
    if (phone) {
      window.open(`tel:0${phone}`);
    }
  };

  const handleExternalDirections = () => {
    const destination =
      facility.lat && facility.lon
        ? `${facility.lat},${facility.lon}`
        : encodeURIComponent(facility_name);
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`,
      "_blank",
    );
  };

  const handleDirectionsClick = () => {
    if (!hasDirectionsFlow) {
      handleExternalDirections();
    } else if (isLocationReady) {
      onShowDirections?.();
    } else {
      requestLocation();
    }
  };

  const isDirectionsEnabled = !(
    hasDirectionsFlow &&
    !isLocationReady &&
    isLocationDenied
  );

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-white">
      {/* HEADER */}
      <div className="px-5 pt-4">
        <div className="mb-4 flex items-center justify-between gap-x-2">
          <div className="w-full flex-1">
            <h2 className="text-[22px] font-bold">{facility_name}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              {facility_category && (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                  {facility_category}
                </span>
              )}
              {(town || facility_lga) && (
                <>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin size={12} />
                    {town && facility_lga
                      ? `${town}, ${facility_lga}`
                      : town || facility_lga}
                  </span>
                </>
              )}
            </div>
          </div>
          {onClose && (
            <Button
              onClick={onClose}
              className="shrink-0 rounded-full bg-[#E2E4E9]"
              size="icon-sm"
            >
              <X size={20} color="black" />
            </Button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mb-3 flex gap-3">
          <Button
            onClick={handleDirectionsClick}
            disabled={!isDirectionsEnabled}
            size="sm"
            className={`flex-1 rounded-full text-[13px] ${
              hasDirectionsFlow && !isLocationReady
                ? "bg-gray-400"
                : "bg-primary"
            }`}
          >
            <Image
              src={compass}
              alt="Directions"
              className="mr-2 size-4 object-cover"
            />
            {!hasDirectionsFlow || isLocationReady
              ? "Get Directions"
              : isLocationDenied
                ? "Location Access Denied"
                : "Enable Location"}
          </Button>
          {phone && (
            <Button
              size="sm"
              variant="outline"
              className="rounded-full border border-gray-300 text-[13px]"
              onClick={handleCallFacility}
            >
              <Phone size={16} className="mr-2" />
              Call
            </Button>
          )}
        </div>

        {hasDirectionsFlow && isLocationDenied && (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 p-2.5 text-red-700">
            <CircleAlert size={14} className="shrink-0" />
            <p className="text-[11px] leading-tight font-medium">
              Location access is blocked. Please enable it in your browser
              settings to get directions.
            </p>
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <CalendarIcon size={12} />
            Updated: {formattedLastUpdated}
          </span>
          {workingHoursText !== "N/A" && (
            <span className="flex items-center gap-1">
              <Clock size={12} />
              Open: {workingHoursText}
            </span>
          )}
        </div>
      </div>

      {/* BODY */}
      <div className="scrollbar-hide mt-4 h-auto flex-1 overflow-auto">
        <div className="px-5 pb-8">
          <ImageGallery image_urls={image_urls} />
          <ServicesSection services_list={services_list} />
          <ContactSection phone={phone} email={email} address={address} />
          <WorkingHoursSection working_hours={working_hours} />
        </div>
      </div>
    </div>
  );
}

export default FacilityDetailsBase;
