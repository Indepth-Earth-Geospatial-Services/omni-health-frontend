"use client";

import { X, Hospital, Search } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarContentNav } from "@/features/user/components/desktop/sidebar-content";
import { Facility } from "@/types/api-response";
import { useUserStore } from "@/features/user/store/user-store";
import { useUserLocation } from "@/features/user/hooks/use-user-location";
import { useCompareFacilities } from "@/features/compare-facilities/hooks/useCompareFacilities";
import { useFacilityDirections } from "@/features/compare-facilities/hooks/useFacilityDirections";
import { ComparisonResults } from "@/features/compare-facilities/components/ComparisonResults";
import { useDebounce } from "@/hooks/use-debounce";
import { useAllFacilities } from "@/hooks/use-facilities";
import { Spinner } from "@/components/ui/spinner";
import EmptyState from "@/features/compare-facilities/components/emptyState";
import { useFacilitySearch } from "@/hooks/use-facility-search";

export function CompareFacilitiesDesktopLayout() {
  useUserLocation();
  const { userLocation, locationError } = useUserStore();

  const {
    facilities,
    addFacility,
    removeFacility,
    clearAll,
    isReadyToCompare,
    selectedFacilitiesCount,
  } = useCompareFacilities();

  const [facilityA, facilityB] = facilities;
  const {
    directionsA,
    directionsB,
    isLoading: isLoadingDirections,
    isError: isErrorDirections,
  } = useFacilityDirections(userLocation, facilityA, facilityB);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleAddFacilityClick = (index: number) => {
    setSelectedIndex(index);
    setSearchOpen(true);
  };

  const handleSelectFacility = (facility: Facility) => {
    if (selectedIndex !== null) {
      addFacility(facility, selectedIndex);
      setSelectedIndex(null);
      setSearchOpen(false);
    }
  };

  const handleReset = () => {
    clearAll();
  };

  return (
    <SidebarProvider
      defaultOpen={false}
      className="!mx-0 h-dvh !max-w-full overflow-hidden"
    >
      <SidebarContentNav />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#E2E4E9] px-5 py-4">
          <SidebarTrigger className="flex size-9 items-center justify-center rounded-full bg-[#E2E4E9] transition-colors hover:bg-gray-200" />
          <div className="flex-1">
            <h1 className="text-[23px] font-medium">Compare Facilities</h1>
            <p className="text-sm text-[#868C98]">
              {isReadyToCompare
                ? "Showing comparison results"
                : "Select two facilities to see a side-by-side comparison."}
            </p>
          </div>
          {selectedFacilitiesCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleReset}>
              <X className="mr-1.5 h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>

        {/* Content */}
        <main className="scrollbar-hide flex-1 overflow-auto px-5 pb-5">
          {selectedFacilitiesCount === 0 && (
            <div className="relative mt-8 flex min-h-[400px] items-center justify-center">
              <EmptyState onAddFacility={() => handleAddFacilityClick(0)} />
            </div>
          )}

          {(selectedFacilitiesCount === 1 || selectedFacilitiesCount === 2) && (
            <div className="mt-8">
              {!isReadyToCompare && (
                <div className="mb-6 flex gap-6">
                  {facilities.map((facility, index) =>
                    facility ? (
                      <Card
                        key={facility.facility_id}
                        className="relative flex-1"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6"
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
                        className="flex flex-1 cursor-pointer flex-col items-center justify-center border border-[#E2E4E9] bg-[#F8F9FA] text-[#343434]"
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
            </div>
          )}
        </main>
      </div>

      {/* Desktop Facility Selection Dialog */}
      <FacilitySelectionDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSelect={handleSelectFacility}
      />
    </SidebarProvider>
  );
}

function FacilitySelectionDialog({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (facility: Facility) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 500, 1);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useAllFacilities();

  const searchFacilityQuery = useFacilitySearch({ name: debouncedSearchTerm });

  const allFacilitiesData =
    data?.pages.flatMap((page) => page.facilities) ?? [];

  const searchFacilitiesData =
    searchFacilityQuery.data?.pages.flatMap((p) => p.facilities) ?? [];

  const facilities =
    debouncedSearchTerm.length > 1 ? searchFacilitiesData : allFacilitiesData;

  const handleSelect = (facility: Facility) => {
    onSelect(facility);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Select a Facility</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by facility name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <ScrollArea className="h-80">
          {(isLoading || searchFacilityQuery.isLoading) && (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          )}
          {(isError || searchFacilityQuery.isError) && (
            <p className="py-8 text-center text-red-500">
              Failed to load facilities.
            </p>
          )}
          {!isLoading &&
            !searchFacilityQuery.isLoading &&
            !searchFacilityQuery.isError &&
            !isError &&
            facilities.length === 0 && (
              <p className="py-8 text-center text-[#868C98]">
                No facilities found.
              </p>
            )}
          {facilities.length > 0 && (
            <ul className="space-y-1">
              {facilities.map((facility) => (
                <li key={facility.facility_id}>
                  <button
                    className="w-full rounded-md p-3 text-left transition-colors hover:bg-[#F8F9FA]"
                    onClick={() => handleSelect(facility)}
                  >
                    <p className="font-semibold">{facility.facility_name}</p>
                    <p className="text-sm text-[#868C98]">{facility.address}</p>
                  </button>
                </li>
              ))}
              {!debouncedSearchTerm && hasNextPage && (
                <li className="py-3 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? "Loading more..." : "Load More"}
                  </Button>
                </li>
              )}
            </ul>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
