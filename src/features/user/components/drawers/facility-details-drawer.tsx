"use client";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { useState } from "react";
import { useFacilityStore } from "../../store/facility-store";
import FacilityDetailsBase from "@/components/shared/organisms/facility-details-base";
import { Facility } from "../../types";

interface FacilityDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  facility: Facility | null;
  onShowDirections: () => void;
}

function FacilityDetailsDrawer({
  isOpen,
  onClose,
  facility,
  onShowDirections,
}: FacilityDetailsDrawerProps) {
  const [snap, setSnap] = useState<string | number | null>(1.1);
  const autoFacility = useFacilityStore((s) => s.selectedFacility);

  const facilityToUse = facility || autoFacility;

  if (Object.values(facilityToUse).length === 0 || facilityToUse === null) {
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
          <DrawerTitle className="sr-only">Facility Details</DrawerTitle>
          <div className="flex h-full items-center justify-center">
            <p>No facility selected</p>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Drawer
      open={isOpen}
      onOpenChange={onClose}
      snapPoints={[0.3, 0.4, 0.8, 1.1, 1.2]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      modal={false}
    >
      <DrawerContent className="flex h-dvh">
        <DrawerTitle className="sr-only">Facility Details</DrawerTitle>
        <FacilityDetailsBase
          facility={facilityToUse}
          onShowDirections={onShowDirections}
          onClose={onClose}
          variant="drawer"
        />
      </DrawerContent>
    </Drawer>
  );
}

export default FacilityDetailsDrawer;
