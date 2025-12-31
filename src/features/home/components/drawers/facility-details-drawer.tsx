"use client";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { useFacility } from "../../hooks/useFacilities";
import { DrawerState } from "../../pages/homepage";
import FacilityStats from "../facility-stats";
import Overview from "../overview";

interface FacilityDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  facilityId: string | null;
  onShowDirections: () => void;
}

function FacilityDetailsDrawer({
  isOpen,
  onClose,
  facilityId,
  onShowDirections,
}: FacilityDetailsProps) {
  const [snap, setSnap] = useState<string | number | null>(1.1);
  const {
    isLoading,
    data: facilityDetails,
    error,
    refetch,
  } = useFacility(facilityId);
  return (
    <Drawer
      open={isOpen}
      onOpenChange={onClose}
      snapPoints={[0.3, 0.4, 0.8, 1.1, 1.2]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      modal={false}
    >
      <DrawerContent className="flex h-full">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="loader"></div>
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center p-5 text-center">
            <div>
              <p className="text-red-500">{error.message}</p>
              <Button onClick={() => refetch()} className="mt-4">
                Retry
              </Button>
            </div>
          </div>
        ) : facilityDetails ? (
          <div className="flex h-full flex-1 flex-col">
            {/* HEADER */}
            <div className="px-5">
              <div className="flex justify-between gap-x-2">
                <h2 className="text-[19px] font-normal">
                  {facilityDetails.facility_name}
                </h2>
                <div className="shrink-0 space-x-3">
                  <Button className="rounded-full bg-[#E2E4E9]" size="icon-sm">
                    <Image
                      src={exportIcon}
                      alt=""
                      className="size-5 object-cover"
                    />
                  </Button>
                  <Button
                    onClick={onClose}
                    className="rounded-full bg-[#E2E4E9]"
                    size="icon-sm"
                  >
                    <X size={20} color="black" />
                  </Button>
                </div>
              </div>

              <div className="text-[11px] font-normal text-[#868C98]">
                <h6 className="text-primary">
                  {facilityDetails.facility_category}
                </h6>
                <div className="mt-1 flex flex-wrap gap-2.5 *:flex *:items-center *:gap-1">
                  <p>
                    <MousePointer2 size={12} /> Distance:{" "}
                    <b>
                      {/* (facilityDetails?.road_distance_meters / 1000).toFixed(
                        1,
                      ) */}
                      {"N/A"}
                    </b>
                  </p>
                  <p>
                    <Star size={12} /> Rating:{" "}
                    <b>{facilityDetails?.average_rating}</b>
                  </p>
                  <p>
                    <Car size={12} /> Drive:{" "}
                    {/* {facilityDetails?.travel_time_minutes}mins */}
                    <b>N/A</b>
                  </p>
                </div>
              </div>

              <div className="mt-3 space-x-3">
                <Button
                  onClick={onShowDirections}
                  size="sm"
                  className="bg-primary rounded-full text-[11px]"
                >
                  <Image
                    src={compass}
                    alt=""
                    className="size-3.5 object-cover"
                  />
                  Directions
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full border border-[#868C98] text-[11px] text-[#868C98]"
                  onClick={() =>
                    window.open(`tel:${facilityDetails.contact_info.phone}`)
                  }
                >
                  <Phone size={14} /> Call
                </Button>
              </div>
            </div>

            {/* BODY */}
            <div className="scrollbar-hide mt-6 grid overflow-auto">
              <Tabs defaultValue="overview" className="w-full flex-1">
                <div className="sticky top-0 flex justify-center bg-white px-5">
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
              <div className="h-15"></div>
            </div>

            <div className="fixed -bottom-10 z-50 flex w-full justify-center px-5">
              <Button size="lg" className="bg-primary h-13 grow rounded-full">
                <Calendar size={20} />
                Request Appointment
              </Button>
            </div>
          </div>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
}

export default FacilityDetailsDrawer;
