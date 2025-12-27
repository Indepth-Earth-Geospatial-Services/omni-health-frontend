"use client";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { MapPin, Star } from "lucide-react";
import { useState } from "react";
import FacilityListItem from "./facility-list-item";

type Filters = "Distance" | "Ratings";

const filters = [
  { name: "Distance", icon: <MapPin size={14} /> },
  { name: "Ratings", icon: <Star size={14} /> },
] as const;
function ResultsDrawer() {
  const [activeFilter, setActiveFilter] = useState<Filters>("Distance");
  const [snap, setSnap] = useState<number | string | null>(0.8);
  return (
    <Drawer
      open={true}
      // onOpenChange={setState}
      // defaultOpen={true}
      snapPoints={[0.8, 1.1, 1.2]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
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
          <div className="mt-4 grid gap-y-3 overflow-y-auto">
            <FacilityListItem />
            <FacilityListItem />
            <FacilityListItem />
            <FacilityListItem />
            <FacilityListItem />
            <FacilityListItem />
            <FacilityListItem />
            <FacilityListItem />
            {/* HACK: TO MAKE ALL ITEMS SHOW PROPERLY */}
            <div className="h-40"></div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default ResultsDrawer;
