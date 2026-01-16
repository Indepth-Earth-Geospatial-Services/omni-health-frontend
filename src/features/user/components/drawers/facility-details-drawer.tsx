"use client";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { useState } from "react";
import { useFacilityStore } from "../../store/facility-store";
import FacilityDetailsBase from "@/components/shared/organisms/facility-details-base";

interface FacilityDetailsDrawerProps {
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
}: FacilityDetailsDrawerProps) {
  const [snap, setSnap] = useState<string | number | null>(1.2);
  const autoFacilityID = useFacilityStore((s) => s.selectedFacility);

  const idToUse = facilityId || autoFacilityID;

  if (!idToUse) {
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
          facilityId={idToUse}
          onShowDirections={onShowDirections}
          onClose={onClose}
          variant="drawer"
        />
      </DrawerContent>
    </Drawer>
  );
}

export default FacilityDetailsDrawer;
