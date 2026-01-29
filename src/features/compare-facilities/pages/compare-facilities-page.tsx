"use client";

import { ArrowLeft, Plus, X, Hospital } from "lucide-react";
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
import EmptyState from "@/features/compare-facilities/components/emptyState"; // Import EmptyState

function CompareFacilitiesPage() {
  const {
    facilities,
    addFacility,
    removeFacility,
    clearAll,
    isReadyToCompare,
    selectedFacilitiesCount,
  } = useCompareFacilities();

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
    clearAll();
  };

  return (
    <div className="relative min-h-dvh">
      {" "}
      {/* Added relative to allow fixed button */}
      <main className="min-h-dvh overflow-y-auto px-5 pt-5 pb-20">
        {" "}
        {/* Added pb-20 for fixed button */}
        <div className="sticky top-0 z-10 bg-white pt-5 pb-3">
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
        </div>
        {selectedFacilitiesCount === 0 && (
          <EmptyState onAddFacility={() => handleAddFacilityClick(0)} />
        )}
        {selectedFacilitiesCount === 1 && (
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
                  className="flex h-48 cursor-pointer flex-col items-center justify-center border border-[#E2E4E9] bg-[#F8F9FA] text-[#343434]"
                >
                  <div className="mb-2 rounded-full bg-[#E2E4E9] p-3">
                    <Hospital className="h-6 w-6 text-[#343434]" />
                  </div>
                  <p className="font-semibold">Add Facility</p>
                  <p className="text-center text-xs text-[#868C98]">
                    Select a facility to start comparing
                  </p>
                </Card>
              ),
            )}
          </div>
        )}
        {isReadyToCompare && facilityA && facilityB && (
          <ComparisonResults
            facilityA={facilityA}
            facilityB={facilityB}
            removeFacility={removeFacility}
            directionsA={directionsA}
            directionsB={directionsB}
            isLoadingDirections={isLoadingDirections}
            locationError={!!locationError || isErrorDirections}
          />
        )}
        {!isReadyToCompare &&
          selectedFacilitiesCount > 0 && ( // Only show compare button if at least one is selected
            <div className="absolute bottom-5 left-5 right-5">
              <Button disabled={!isReadyToCompare} className="w-full">
                Compare
              </Button>
            </div>
          )}
      </main>
      {selectedFacilitiesCount > 0 && ( // Show reset button if any facility is selected
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-white p-5 border-t border-gray-200 shadow-lg">
          <Button onClick={handleReset} variant="outline" className="w-full">
            Clear All Compared Facilities
          </Button>
        </div>
      )}
      <FacilitySelectionDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        onSelectFacility={handleSelectFacility}
      />
    </div>
  );
}

export default CompareFacilitiesPage;
