"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useAllFacilities } from "@/hooks/useFacilities";
import { Facility } from "@/types/api-response";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface FacilitySelectionDrawerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSelectFacility: (facility: Facility) => void;
}

export function FacilitySelectionDrawer({
  isOpen,
  onOpenChange,
  onSelectFacility,
}: FacilitySelectionDrawerProps) {
  const [snap, setSnap] = useState<string | number | null>(0.9);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500, 2);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useAllFacilities({ name: debouncedSearchTerm });

  const handleSelect = (facility: Facility) => {
    onSelectFacility(facility);
    onOpenChange(false);
  };

  const facilities = data?.pages.flatMap((page) => page.facilities) ?? [];

  return (
    <Drawer
      open={isOpen}
      onOpenChange={onOpenChange}
      snapPoints={[0.4, 0.9]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      modal={true}
    >
      <DrawerContent className="h-[90dvh]">
        <div className="mx-auto my-3 h-1.5 w-12 rounded-full bg-[#E2E4E9]" />
        <DrawerHeader>
          <DrawerTitle>Select a Facility</DrawerTitle>
          <div className="p-4">
            <Input
              placeholder="Search by facility name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </DrawerHeader>
        <div className="flex-1 overflow-auto px-4">
          {isLoading && <Spinner className="mx-auto" />}
          {isError && (
            <p className="text-center text-red-500">
              Failed to load facilities.
            </p>
          )}
          {!isLoading && !isError && facilities.length === 0 && (
            <p className="text-center text-[#868C98]">No facilities found.</p>
          )}
          {facilities.length > 0 && (
            <ScrollArea className="relative h-full">
              <ul className="space-y-2">
                {facilities.map((facility) => (
                  <li key={facility.facility_id}>
                    <button
                      className="w-full rounded-md p-4 text-left hover:bg-[#F8F9FA]"
                      onClick={() => handleSelect(facility)}
                    >
                      <p className="font-semibold">{facility.facility_name}</p>
                      <p className="text-sm text-[#868C98]">
                        {facility.address}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
              {hasNextPage && (
                <div className="py-4 text-center">
                  <Button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? "Loading more..." : "Load More"}
                  </Button>
                </div>
              )}
              <div className="h-15"></div>
            </ScrollArea>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
