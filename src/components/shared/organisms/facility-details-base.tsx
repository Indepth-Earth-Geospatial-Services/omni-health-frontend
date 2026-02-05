"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserLocation } from "@/features/user/hooks/use-user-location";
import { useDrawerStore } from "@/features/user/store/drawer-store";
import { useUserStore } from "@/features/user/store/user-store";
import { Facility } from "@/features/user/types";
import {
  formatDate,
  formatRating,
  getFacilityDefaults,
  getWorkingHoursForDisplay,
} from "@/lib/utils";
import compass from "@assets/img/icons/svg/compass-rose.svg";
import {
  ArrowLeft,
  Bed,
  Calendar,
  Calendar as CalendarIcon,
  CircleAlert,
  Clock,
  MapPin,
  Phone,
  Star,
  Stethoscope,
  TrendingUp,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { InfoCard } from "../atoms/info-card";
import { OverviewContent } from "../molecules/overview-content";
import { StatsContent } from "../molecules/stats-content";

interface FacilityDetailsBaseProps {
  facility: Facility;
  onShowDirections?: () => void;
  onClose?: () => void;
  variant?: "drawer" | "page";
}

function FacilityDetailsBase({
  facility,
  onShowDirections,
  onClose,
  variant = "page",
}: FacilityDetailsBaseProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const { requestLocation } = useUserLocation();

  const openRequestAppointment = useDrawerStore(
    (state) => state.openRequestAppointment,
  );

  const openDirections = useDrawerStore((state) => state.openDirections);

  const userLocation = useUserStore((state) => state.userLocation);
  const permissionState = useUserStore((state) => state.permissionState);

  const isLocationReady = !!userLocation;
  const isLocationDenied = permissionState === "denied";

  const facilityData = useMemo(() => getFacilityDefaults(facility), [facility]);

  const facility_name = facilityData.facility_name;
  const facility_category = facilityData.facility_category;
  const facility_lga = facilityData.facility_lga;
  const town = facilityData.town;
  const address = facilityData.address;
  const avg_daily_patients = facilityData.avg_daily_patients;
  const doctor_patient_ratio = facilityData.doctor_patient_ratio;
  const inventory = facilityData.inventory;
  const services_list = facilityData.services_list;
  const specialists = facilityData.specialists;
  const image_urls = facilityData.image_urls;
  const working_hours = facilityData.working_hours;
  const contact_info = facilityData.contact_info;
  const average_rating = facilityData.average_rating;
  const total_reviews = facilityData.total_reviews;
  const last_updated = facilityData.last_updated;
  const hfr_id = facilityData.hfr_id;

  const email = contact_info?.email;
  const phone = contact_info?.phone;

  // Derived data
  const formattedRating = formatRating(average_rating);

  const totalBeds =
    (inventory?.equipment?.inpatient_beds_with_mattress || 0) +
    (inventory?.equipment?.baby_cots || 0) +
    (inventory?.equipment?.delivery_bed || 0) +
    (inventory?.equipment
      ?.work_surface_for_resuscitation_of_newborn_paediatric_resuscitation_bed_with_radiant_warmer ||
      0);

  const formattedLastUpdated = formatDate(last_updated);
  const workingHoursText = getWorkingHoursForDisplay(working_hours);

  // Handler functions
  const handleRequestAppointment = () => {
    openRequestAppointment();
  };

  const handleCallFacility = () => {
    if (phone) {
      window.open(`tel:0${phone}`);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  // Header content
  const headerContent = (
    <div className={variant === "drawer" ? "px-5 pt-4" : "px-5 pt-6"}>
      <div className="mb-4 flex items-center justify-between gap-x-2">
        <div className="flex items-center gap-3">
          {variant === "page" && onClose && (
            <Button
              onClick={onClose}
              className="rounded-full bg-[#E2E4E9]"
              size="icon-sm"
            >
              <ArrowLeft size={20} color="black" />
            </Button>
          )}
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
        </div>
        <div className={`shrink-0 ${variant === "drawer" ? "space-x-3" : ""}`}>
          {/* <Button className="rounded-full bg-[#E2E4E9]" size="icon-sm">
            <Image
              src={exportIcon}
              alt="Export"
              className="size-5 object-cover"
            />
          </Button> */}
          {variant === "drawer" && onClose && (
            <Button
              onClick={onClose}
              className="rounded-full bg-[#E2E4E9]"
              size="icon-sm"
            >
              <X size={20} color="black" />
            </Button>
          )}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        <InfoCard
          title="Rating"
          value={
            <div className="flex items-center gap-1">
              <span>{formattedRating}</span>
            </div>
          }
          icon={<Star className="size-5 text-yellow-500" />}
          color="orange"
          size="sm"
        />
        <InfoCard
          title="Beds"
          value={totalBeds || "0"}
          icon={<Bed className="size-5 text-blue-600" />}
          color="blue"
          size="sm"
        />
        <InfoCard
          title="Specialists"
          value={specialists.length || "0"}
          icon={<Stethoscope className="size-5 text-green-600" />}
          color="green"
          size="sm"
        />
      </div>

      {/* Action Buttons */}
      <div className="mb-3 flex gap-3">
        {isLocationReady && (
          <Button
            onClick={() => {
              if (variant === "page") {
                openDirections();
                router.push(`/user?facility=${facility.hfr_id}`);
              } else {
                onShowDirections?.();
              }
            }}
            size="sm"
            className="bg-primary flex-1 rounded-full text-[13px]"
          >
            <Image
              src={compass}
              alt="Directions"
              className="mr-2 size-4 object-cover"
            />
            Get Directions
          </Button>
        )}

        {!isLocationReady && (
          <Button
            onClick={() => requestLocation()}
            disabled={isLocationDenied}
            size="sm"
            className={`flex-1 rounded-full bg-gray-400 text-[13px]`}
          >
            <Image
              src={compass}
              alt="Directions"
              className="mr-2 size-4 object-cover"
            />
            {isLocationDenied ? "Location Access Denied" : "Enable Location"}
          </Button>
        )}
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

      {isLocationDenied && (
        <div className="my-3 flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 p-2.5 text-red-700">
          <CircleAlert size={14} className="shrink-0" />
          <p className="text-[11px] leading-tight font-medium">
            Location access is blocked. Please enable it in your browser
            settings to get directions.
          </p>
        </div>
      )}

      {/* Meta Info */}
      <div className="flex items-center justify-between text-xs text-gray-500">
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
  );

  // Tabs content
  const tabsContent = (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full flex-1"
    >
      <div
        className={`${variant === "drawer" ? "top-0" : "top-0 z-10"} flex justify-center bg-white ${variant === "drawer" ? "px-5 pt-2" : "px-5 pt-4"}`}
      >
        <TabsList className="m-ax-w-90.5 h-12.25 w-full rounded-full *:rounded-full *:text-[13px] *:text-[#343434]">
          <TabsTrigger value="overview">
            <CircleAlert size={16} />
            Overview
          </TabsTrigger>
          <TabsTrigger value="stats">
            <TrendingUp size={16} />
            Statistics
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="mt-4">
        <TabsContent value="overview">
          <OverviewContent
            image_urls={image_urls}
            avgDailyPatients={avg_daily_patients}
            doctorPatientRatio={doctor_patient_ratio}
            totalBeds={totalBeds}
            serviceList={services_list}
            specialist={specialists}
            phone={phone}
            email={email}
            address={address}
            workingHours={working_hours}
            inventory={inventory}
            hfrId={hfr_id}
            facilityLga={facility_lga}
            town={town}
            facilityCategory={facility_category}
          />
        </TabsContent>
        <TabsContent value="stats">
          <StatsContent
            avgDailyPatients={avg_daily_patients}
            doctorPatientRatio={doctor_patient_ratio}
            formattedRating={formattedRating}
            totalReviews={total_reviews}
          />
        </TabsContent>
      </div>
    </Tabs>
  );

  // Footer button
  const footerButtonContent = (
    <div
      className={`${variant === "drawer" ? "fixed -bottom-10" : "sticky bottom-0"} z-50 flex w-full justify-center bg-white px-5 py-4`}
    >
      <Button
        onClick={handleRequestAppointment}
        size="lg"
        className="bg-primary h-13 grow rounded-full shadow-lg"
      >
        <Calendar size={20} />
        Request Appointment
      </Button>
    </div>
  );

  return (
    <div
      className={`flex ${variant === "drawer" ? "h-full flex-1 flex-col" : "flex h-dvh flex-col bg-white"}`}
    >
      {/* HEADER */}
      {headerContent}

      {/* BODY */}
      <div className="scrollbar-hide mt-2 flex-1 overflow-auto">
        {tabsContent}
      </div>

      {/* FOOTER BUTTON */}
      {/* {footerButtonContent} */}
    </div>
  );
}

export default FacilityDetailsBase;
