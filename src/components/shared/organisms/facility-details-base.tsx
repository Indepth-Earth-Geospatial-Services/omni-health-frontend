// "use client";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import FacilityStats from "@/features/user/components/facility-stats";
// import Overview from "@/features/user/components/overview";
// import { useDrawerStore } from "@/features/user/store/drawer-store";

// import { useFacility } from "@/hooks/useFacilities";
// import compass from "@assets/img/icons/svg/compass-rose.svg";
// import exportIcon from "@assets/img/icons/svg/Export.svg";
// import {
//   Calendar,
//   Car,
//   CircleAlert,
//   MousePointer2,
//   Phone,
//   Star,
//   X,
//   ArrowLeft,
// } from "lucide-react";
// import Image from "next/image";

// interface FacilityDetailsBaseProps {
//   facilityId: string;
//   onShowDirections?: () => void;
//   onClose?: () => void;
//   variant?: "drawer" | "page";
//   isLoading?: boolean;
//   error?: Error | null;
//   refetch?: () => void;
// }

// function FacilityDetailsBase({
//   facilityId,
//   onShowDirections,
//   onClose,
//   variant = "page",
//   // If props are passed, use them; otherwise use the hook
//   isLoading: externalIsLoading,
//   error: externalError,
//   refetch: externalRefetch,
// }: FacilityDetailsBaseProps) {
//   const openRequestAppointment = useDrawerStore(
//     (state) => state.openRequestAppointment,
//   );

//   // Use internal hook if no external props provided
//   const {
//     isLoading: internalIsLoading,
//     data: facilityDetailsData,
//     error: internalError,
//     refetch: internalRefetch,
//   } = useFacility(facilityId);

//   // Use external props if provided, otherwise use internal hook results
//   const isLoading =
//     externalIsLoading !== undefined ? externalIsLoading : internalIsLoading;
//   const error = externalError !== undefined ? externalError : internalError;
//   const refetch = externalRefetch || internalRefetch;

//   const facilityDetails = facilityDetailsData?.facility;

//   // Variables for the component
//   const facilityName = facilityDetails?.facility_name || "";
//   const facilityCategory = facilityDetails?.facility_category || "";
//   const averageRating = facilityDetails?.average_rating || "N/A";
//   const phoneNumber = facilityDetails?.contact_info?.phone || "";

//   const isDataAvailable = Object.values(facilityDetails || {}).length !== 0;
//   const isError = !!error;
//   const shouldShowContent = !isLoading && !isError && isDataAvailable;

//   // Handler functions
//   const handleRequestAppointment = () => {
//     openRequestAppointment();
//   };

//   const handleCallFacility = () => {
//     if (phoneNumber) {
//       window.open(`tel:0${phoneNumber}`);
//     }
//   };

//   // Loading state content
//   const loadingContent = (
//     <div
//       className={`flex ${variant === "drawer" ? "h-full items-center" : "h-screen items-center"} justify-center`}
//     >
//       <div className="loader"></div>
//     </div>
//   );

//   // Error state content
//   const errorContent = (
//     <div
//       className={`flex ${variant === "drawer" ? "h-full items-center" : "h-screen items-center"} justify-center p-5 text-center`}
//     >
//       <div>
//         <p className="text-red-500">{error?.message || "An error occurred"}</p>
//         <Button onClick={() => refetch()} className="mt-4">
//           Retry
//         </Button>
//         {variant === "page" && onClose && (
//           <Button onClick={onClose} variant="outline" className="mt-4 ml-4">
//             <ArrowLeft size={16} className="mr-2" />
//             Go Back
//           </Button>
//         )}
//       </div>
//     </div>
//   );

//   // Header section content
//   const headerContent = (
//     <div className={variant === "drawer" ? "px-5" : "px-5 pt-6"}>
//       <div className="flex items-center justify-between gap-x-2">
//         <div className="flex items-center gap-3">
//           {variant === "page" && onClose && (
//             <Button
//               onClick={onClose}
//               className="rounded-full bg-[#E2E4E9]"
//               size="icon-sm"
//             >
//               <ArrowLeft size={20} color="black" />
//             </Button>
//           )}
//           <h2 className="text-[19px] font-normal">{facilityName}</h2>
//         </div>
//         <div className={`shrink-0 ${variant === "drawer" ? "space-x-3" : ""}`}>
//           <Button className="rounded-full bg-[#E2E4E9]" size="icon-sm">
//             <Image src={exportIcon} alt="" className="size-5 object-cover" />
//           </Button>
//           {variant === "drawer" && onClose && (
//             <Button
//               onClick={onClose}
//               className="rounded-full bg-[#E2E4E9]"
//               size="icon-sm"
//             >
//               <X size={20} color="black" />
//             </Button>
//           )}
//         </div>
//       </div>

//       <div
//         className={`text-[11px] font-normal text-[#868C98] ${variant === "page" ? "mt-4" : ""}`}
//       >
//         <h6 className="text-primary">{facilityCategory}</h6>
//         <div className="mt-1 flex flex-wrap gap-2.5 *:flex *:items-center *:gap-1">
//           <p>
//             <MousePointer2 size={12} /> Distance: <b>N/A</b>
//           </p>
//           <p>
//             <Star size={12} /> Rating: <b>{averageRating}</b>
//           </p>
//           <p>
//             <Car size={12} /> Drive: <b>N/A</b>
//           </p>
//         </div>
//       </div>

//       <div className="mt-3 space-x-3">
//         <Button
//           onClick={onShowDirections}
//           size="sm"
//           className="bg-primary rounded-full text-[11px]"
//         >
//           <Image src={compass} alt="" className="size-3.5 object-cover" />
//           Directions
//         </Button>
//         <Button
//           size="sm"
//           variant="outline"
//           className="rounded-full border border-[#868C98] text-[11px] text-[#868C98]"
//           onClick={handleCallFacility}
//         >
//           <Phone size={14} /> Call
//         </Button>
//       </div>
//     </div>
//   );

//   // Tabs content
//   const tabsContent = (
//     <Tabs defaultValue="overview" className="w-full flex-1">
//       <div
//         className={`sticky ${variant === "drawer" ? "top-0" : "top-0 z-10"} flex justify-center bg-white ${variant === "drawer" ? "px-5" : "px-5 pt-4"}`}
//       >
//         <TabsList className="h-12.25 w-full max-w-90.5 rounded-full *:rounded-full *:text-[13px] *:text-[#343434]">
//           <TabsTrigger value="overview">
//             <CircleAlert size={16} />
//             Overview
//           </TabsTrigger>
//           <TabsTrigger value="stats">
//             <CircleAlert size={16} />
//             Stats
//           </TabsTrigger>
//         </TabsList>
//       </div>

//       <div className="mt-6">
//         <TabsContent value="overview">
//           <Overview facility={facilityDetails} />
//         </TabsContent>
//         <TabsContent className="mx-5" value="stats">
//           <FacilityStats />
//         </TabsContent>
//       </div>
//     </Tabs>
//   );

//   // Footer button content
//   const footerButtonContent = (
//     <div
//       className={`${variant === "drawer" ? "fixed -bottom-10" : "sticky bottom-0"} z-50 flex w-full justify-center bg-white px-5 py-4`}
//     >
//       <Button
//         onClick={handleRequestAppointment}
//         size="lg"
//         className="bg-primary h-13 grow rounded-full"
//       >
//         <Calendar size={20} />
//         Request Appointment
//       </Button>
//     </div>
//   );

//   return (
//     <>
//       {isLoading && loadingContent}
//       {isError && errorContent}

//       {shouldShowContent && (
//         <div
//           className={`flex ${variant === "drawer" ? "h-full flex-1 flex-col pt-3" : "flex h-dvh flex-col bg-white pb-4"}`}
//         >
//           {/* HEADER */}
//           {headerContent}

//           {/* BODY */}
//           <div className="scrollbar-hide mt-4 flex-1 overflow-auto">
//             {tabsContent}
//             <div className="h-15"></div>
//           </div>

//           {/* FOOTER BUTTON - Uncomment if needed */}
//           {/* {footerButtonContent} */}
//         </div>
//       )}
//     </>
//   );
// }

"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDrawerStore } from "@/features/user/store/drawer-store";
import { Facility } from "@/features/user/types";
import { useFacility } from "@/hooks/use-facilities";
import {
  formatDate,
  formatRating,
  getWorkingHoursForDisplay,
  isEmptyValue,
} from "@/lib/utils";
import compass from "@assets/img/icons/svg/compass-rose.svg";
import exportIcon from "@assets/img/icons/svg/Export.svg";
import {
  ArrowLeft,
  Bed,
  Calendar,
  Calendar as CalendarIcon,
  CircleAlert,
  Clock,
  Home,
  MapPin,
  Phone,
  Star,
  Stethoscope,
  TrendingUp,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { InfoCard } from "../atoms/info-card";
import { OverviewContent } from "../molecules/overview-content";
import { StatsContent } from "../molecules/stats-content";
import { useUserLocation } from "@/features/user/hooks/use-user-location";
import { useUserStore } from "@/features/user/store/user-store";

interface FacilityDetailsBaseProps {
  facility: Facility;
  onShowDirections?: () => void;
  onClose?: () => void;
  variant?: "drawer" | "page";
  isLoading?: boolean;
  error?: Error | null;
  refetch?: () => void;
}

function FacilityDetailsBase({
  facility,
  onShowDirections,
  onClose,
  variant = "page",
  isLoading: externalIsLoading,
  error: externalError,
  refetch: externalRefetch,
}: FacilityDetailsBaseProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();
  const openRequestAppointment = useDrawerStore(
    (state) => state.openRequestAppointment,
  );
  const openDirections = useDrawerStore((state) => state.openDirections);

  const userLocation = useUserStore((state) => state.userLocation);
  const { permissionState, requestLocation } = useUserLocation();
  const isLocationReady = !!userLocation;
  const isLocationDenied = permissionState === "denied";
  console.log("FROM FACILITY DETAILS BASE", userLocation);

  // Use internal hook if no external props provided
  // const {
  //   isLoading: internalIsLoading,
  //   data: internalFacilityData,
  //   error: internalError,
  //   refetch: internalRefetch,
  // } = useFacility(facilityId);

  // Use external props if provided, otherwise use internal hook results
  // const isLoading =
  //   externalIsLoading !== undefined ? externalIsLoading : internalIsLoading;
  // const error = externalError !== undefined ? externalError : internalError;
  // const refetch = externalRefetch || internalRefetch;

  // Use external data if provided, otherwise use data from hook
  // const facilityData: Facility =
  //   externalFacilityData || internalFacilityData?.facility || {};
  const facilityData = facility;
  // Extract data with defaults
  const {
    facility_name = "Unknown Facility",
    facility_category = "Healthcare Facility",
    facility_lga = "",
    town = "",
    address = "",
    avg_daily_patients = 0,
    doctor_patient_ratio = 0,
    inventory,
    services_list = [],
    specialists = [],
    image_urls = [],
    working_hours,
    contact_info = {},
    average_rating = 0,
    total_reviews = 0,
    last_updated = "",
    hfr_id = "",
  } = facilityData;

  const { email = "", phone = "" } = contact_info;

  // Derived data
  const formattedRating = formatRating(average_rating);
  const totalBeds =
    (inventory?.infrastructure.inpatient_beds || 0) +
    (inventory?.infrastructure.baby_cots || 0) +
    (inventory?.infrastructure.delivery_beds || 0) +
    (inventory?.infrastructure.resuscitation_beds || 0);
  const formattedLastUpdated = formatDate(last_updated as string);
  const workingHoursText = getWorkingHoursForDisplay(working_hours);
  const hasEmergency = working_hours?.emergency === "24/7";

  const isDataAvailable = !isEmptyValue(facilityData);
  // const isError = !!error;
  // const shouldShowContent = !isLoading && !isError && isDataAvailable;

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

  // Loading state
  // const loadingContent = (
  //   <div className="flex h-full items-center justify-center p-5">
  //     <div className="space-y-4 text-center">
  //       <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
  //       <p className="text-gray-600">Loading facility details...</p>
  //     </div>
  //   </div>
  // );

  // Error state
  // const errorContent = (
  //   <div className="flex h-full items-center justify-center p-5 text-center">
  //     <div className="space-y-4">
  //       <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
  //         <X className="h-6 w-6 text-red-500" />
  //       </div>
  //       <h3 className="text-lg font-semibold text-gray-900">
  //         Unable to load facility details
  //       </h3>
  //       <p className="text-gray-600">
  //         {error?.message || "Please try again later"}
  //       </p>
  //       <div className="space-x-3">
  //         <Button onClick={() => refetch?.()} className="mt-2">
  //           Try Again
  //         </Button>
  //         {variant === "page" && onClose && (
  //           <Button onClick={onClose} variant="outline" className="mt-2">
  //             <ArrowLeft className="mr-2 h-4 w-4" />
  //             Go Back
  //           </Button>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );

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
            // isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="stats">
          <StatsContent
            avgDailyPatients={avg_daily_patients}
            doctorPatientRatio={doctor_patient_ratio}
            formattedRating={formattedRating}
            totalReviews={total_reviews}
            // isLoading={isLoading}
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
    <>
      {/* {isLoading && loadingContent}
      {isError && errorContent} */}

      {/* {shouldShowContent && ( */}
      {true && (
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
      )}
    </>
  );
}

export default FacilityDetailsBase;
