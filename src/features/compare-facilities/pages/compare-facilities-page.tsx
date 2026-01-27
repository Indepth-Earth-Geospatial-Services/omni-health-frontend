"use client";

import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCompareFacilities } from "@/features/compare-facilities/hooks/useCompareFacilities";
import { FacilitySelectionDrawer } from "@/features/compare-facilities/components/FacilitySelectionDrawer";
import { Facility } from "@/types/api-response";
import { ComparisonResults } from "@/features/compare-facilities/components/ComparisonResults";
import { useUserLocation } from "@/features/user/hooks/useUserLocation";
import { useUserStore } from "@/features/user/store/user-store";
import { useFacilityDirections } from "../hooks/useFacilityDirections";

function CompareFacilitiesPage() {
  const { facilities, addFacility, removeFacility, isReadyToCompare } =
    useCompareFacilities();

  // Location and Directions Hooks
  useUserLocation(); // Initialize location fetching
  const { userLocation, locationError } = useUserStore();
  const [facilityA, facilityB] = facilities;
  const {
    directionsA,
    directionsB,
    isLoading: isLoadingDirections,
    isError: isErrorDirections,
  } = useFacilityDirections(userLocation, facilityA, facilityB);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleAddFacilityClick = (index: number) => {
    setSelectedIndex(index);
    setIsDrawerOpen(true);
  };

  const handleSelectFacility = (facility: Facility) => {
    if (selectedIndex !== null) {
      addFacility(facility, selectedIndex);
      setSelectedIndex(null);
    }
  };

  const handleReset = () => {
    removeFacility(0);
    removeFacility(1);
  };

  return (
    <>
      <main className="relative min-h-dvh px-5 pt-5">
        <div className="flex items-start gap-3">
          {isReadyToCompare ? (
            <Button variant="ghost" size="icon" onClick={handleReset}>
              <ArrowLeft size={24} />
            </Button>
          ) : (
            <Link href="/user">
              <ArrowLeft size={24} />
            </Link>
          )}
          <div>
            <h1 className="text-[23px] font-medium">Compare Facilities</h1>
            <p className="text-[13px] text-[#868C98]">
              {isReadyToCompare
                ? "Showing comparison results"
                : "Select two facilities to see a side-by-side comparison."}
            </p>
          </div>
        </div>

        {isReadyToCompare && facilityA && facilityB ? (
          <ComparisonResults
            facilityA={facilityA}
            facilityB={facilityB}
            removeFacility={removeFacility}
            directionsA={directionsA}
            directionsB={directionsB}
            isLoadingDirections={isLoadingDirections}
            locationError={!!locationError || isErrorDirections}
          />
        ) : (
          <div className="mt-8 grid grid-cols-2 items-stretch gap-4">
            {facilities.map((facility, index) =>
              facility ? (
                <Card key={facility.facility_id} className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-6 w-6"
                    onClick={() => removeFacility(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <CardHeader>
                    <CardTitle
                      className="truncate text-lg"
                      title={facility.facility_name}
                    >
                      {facility.facility_name}
                    </CardTitle>
                    <CardDescription>{facility.address}</CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                <Card
                  key={index}
                  onClick={() => handleAddFacilityClick(index)}
                  className="flex h-48 cursor-pointer items-center justify-center border-2 border-dashed bg-gray-50/50"
                >
                  <Button variant="outline" className="pointer-events-none">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Facility
                  </Button>
                </Card>
              )
            )}
          </div>
        )}

        {!isReadyToCompare && (
          <div className="absolute bottom-5 left-5 right-5">
            <Button disabled={!isReadyToCompare} className="w-full">
              Compare
            </Button>
          </div>
        )}
      </main>

      <FacilitySelectionDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        onSelectFacility={handleSelectFacility}
      />
    </>
  );
}

export default CompareFacilitiesPage;
