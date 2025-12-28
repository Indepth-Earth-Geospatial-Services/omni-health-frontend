"use client";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { MapPin, Star } from "lucide-react";
import { useState } from "react";
import FacilityListItem from "./facility-list-item";
import { NearestFacilityResponse } from "../types/apiResponse";

type Filters = "Distance" | "Ratings";

interface ResultsDrawerProps {
  isOpen: boolean;
  isLoading: boolean;
  error: string;
  facility: NearestFacilityResponse | null;
  onClose: () => void;
  onViewDetails: (facilityId: string) => void;
}
const filters = [
  { name: "Distance", icon: <MapPin size={14} /> },
  { name: "Ratings", icon: <Star size={14} /> },
] as const;

function ResultsDrawer({
  isOpen,
  facility,
  isLoading,
  error,
  onClose,
  onViewDetails,
}: ResultsDrawerProps) {
  const [activeFilter, setActiveFilter] = useState<Filters>("Distance");
  const [snap, setSnap] = useState<number | string | null>(0.8);
  return (
    <Drawer
      open={isOpen}
      onOpenChange={onClose}
      snapPoints={[0.3, 0.4, 0.8, 1.1, 1.2]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      dismissible={false}
      modal={false}
    >
      <DrawerContent className="flex h-full">
        <div className="flex h-full flex-1 flex-col p-5">
          <div className="space-y-2">
            {/* HEADER */}
            <h1 className="text-[23px] font-normal">Medical Facilities</h1>
            {/* FILTERS */}
            <div className="space-x-4">
              {filters.map((filter) => (
                <Button
                  onClick={() => setActiveFilter(filter.name)}
                  key={filter.name}
                  className={cn(
                    "cursor-pointer rounded-full text-[11px]",
                    activeFilter === filter.name
                      ? "bg-[#51A199] hover:bg-[#51A199]"
                      : "border border-black bg-transparent text-black hover:bg-gray-50",
                  )}
                  size="sm"
                >
                  {filter.icon}
                  {filter.name}
                </Button>
              ))}
            </div>
          </div>
          {/* BODY */}
          <div className="scrollbar-hide mt-4 grid gap-y-3 overflow-y-auto">
            {/* NEAREST FACILITY */}

            <FacilityListItem
              facility={facility}
              isLoading={isLoading}
              error={error}
              nearUser={true}
              onViewDetails={onViewDetails}
            />

            {/* FACILITIES IN LGA */}
            <FacilityListItem
              facility={facility}
              isLoading={isLoading}
              error={error}
              onViewDetails={() => onViewDetails("facilty-1")}
            />
            <FacilityListItem
              facility={facility}
              isLoading={isLoading}
              error={error}
              onViewDetails={() => onViewDetails("facilty-1")}
            />
            {/* HACK: TO MAKE ALL ITEMS SHOW PROPERLY */}
            <div className="h-40"></div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default ResultsDrawer;
