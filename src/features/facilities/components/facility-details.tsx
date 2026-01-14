"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FacilityStats from "@/features/user/components/facility-stats";
import Overview from "@/features/user/components/overview";
import { useDrawerStore } from "@/features/user/store/drawer-store";
import { useFacility } from "@/hooks/useFacilities";
import compass from "@assets/img/icons/svg/compass-rose.svg";
import exportIcon from "@assets/img/icons/svg/Export.svg";
import {
  Calendar,
  Car,
  CircleAlert,
  MousePointer2,
  Phone,
  Star,
  X,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";

import { useRouter } from "next/navigation";

interface FacilityDetailsPageProps {
  facilityId: string;
  onShowDirections?: () => void;
}

function FacilityDetails({
  facilityId,
  onShowDirections,
}: FacilityDetailsPageProps) {
  const router = useRouter();
  const openRequestAppointment = useDrawerStore(
    (state) => state.openRequestAppointment,
  );

  const {
    isLoading,
    data: facilityDetailsData,
    error,
    refetch,
  } = useFacility(facilityId);

  const facilityDetails = facilityDetailsData?.facility;

  // Variables for the component
  const facilityName = facilityDetails?.facility_name || "";
  const facilityCategory = facilityDetails?.facility_category || "";
  const averageRating = facilityDetails?.average_rating || "N/A";
  const phoneNumber = facilityDetails?.contact_info?.phone || "";

  const isDataAvailable = Object.values(facilityDetails || {}).length !== 0;
  const isError = !!error;
  const shouldShowContent = !isLoading && !isError && isDataAvailable;

  // Handler functions
  const handleRequestAppointment = () => {
    openRequestAppointment();
  };

  const handleCallFacility = () => {
    if (phoneNumber) {
      window.open(`tel:0${phoneNumber}`);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  // Loading state content
  const loadingContent = (
    <div className="flex h-screen items-center justify-center">
      <div className="loader"></div>
    </div>
  );

  // Error state content
  const errorContent = (
    <div className="flex h-screen items-center justify-center p-5 text-center">
      <div>
        <p className="text-red-500">{error?.message || "An error occurred"}</p>
        <Button onClick={() => refetch()} className="mt-4">
          Retry
        </Button>
        <Button onClick={handleGoBack} variant="outline" className="mt-4 ml-4">
          <ArrowLeft size={16} className="mr-2" />
          Go Back
        </Button>
      </div>
    </div>
  );

  // Header section content
  const headerContent = (
    <div className="px-5 pt-6">
      <div className="flex items-center justify-between gap-x-2">
        <div className="flex items-center gap-3">
          <Button
            onClick={handleGoBack}
            className="rounded-full bg-[#E2E4E9]"
            size="icon-sm"
          >
            <ArrowLeft size={20} color="black" />
          </Button>
          <h2 className="text-[19px] font-normal">{facilityName}</h2>
        </div>
        <div className="shrink-0">
          <Button className="rounded-full bg-[#E2E4E9]" size="icon-sm">
            <Image src={exportIcon} alt="" className="size-5 object-cover" />
          </Button>
        </div>
      </div>

      <div className="mt-4 text-[11px] font-normal text-[#868C98]">
        <h6 className="text-primary">{facilityCategory}</h6>
        <div className="mt-1 flex flex-wrap gap-2.5 *:flex *:items-center *:gap-1">
          <p>
            <MousePointer2 size={12} /> Distance: <b>N/A</b>
          </p>
          <p>
            <Star size={12} /> Rating: <b>{averageRating}</b>
          </p>
          <p>
            <Car size={12} /> Drive: <b>N/A</b>
          </p>
        </div>
      </div>

      <div className="mt-3 space-x-3">
        <Button
          onClick={onShowDirections}
          size="sm"
          className="bg-primary rounded-full text-[11px]"
        >
          <Image src={compass} alt="" className="size-3.5 object-cover" />
          Directions
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="rounded-full border border-[#868C98] text-[11px] text-[#868C98]"
          onClick={handleCallFacility}
        >
          <Phone size={14} /> Call
        </Button>
      </div>
    </div>
  );

  // Tabs content
  const tabsContent = (
    <Tabs defaultValue="overview" className="w-full flex-1">
      <div className="sticky top-0 z-10 flex justify-center bg-white px-5 pt-4">
        <TabsList className="h-12.25 w-full max-w-90.5 rounded-full *:rounded-full *:text-[13px] *:text-[#343434]">
          <TabsTrigger value="overview">
            <CircleAlert size={16} />
            Overview
          </TabsTrigger>
          <TabsTrigger value="stats">
            <CircleAlert size={16} />
            Stats
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="mt-6">
        <TabsContent value="overview">
          <Overview facility={facilityDetails} />
        </TabsContent>
        <TabsContent className="mx-5" value="stats">
          <FacilityStats />
        </TabsContent>
      </div>
    </Tabs>
  );

  // Footer button content
  const footerButtonContent = (
    <div className="sticky bottom-0 z-50 flex w-full justify-center bg-white px-5 py-4">
      <Button
        onClick={handleRequestAppointment}
        size="lg"
        className="bg-primary h-13 grow rounded-full"
      >
        <Calendar size={20} />
        Request Appointment
      </Button>
    </div>
  );

  return (
    <div className="flex h-dvh flex-col bg-white pb-4">
      {isLoading && loadingContent}
      {isError && errorContent}

      {shouldShowContent && (
        <>
          {/* HEADER */}
          {headerContent}

          {/* BODY */}
          <div className="scrollbar-hide mt-4 flex-1 overflow-auto">
            {tabsContent}
          </div>

          {/* FOOTER BUTTON - Uncomment if needed */}
          {/* {footerButtonContent} */}
        </>
      )}
    </div>
  );
}

export default FacilityDetails;
