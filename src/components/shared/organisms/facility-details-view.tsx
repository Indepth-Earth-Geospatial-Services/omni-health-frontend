"use client";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { Facility } from "@/types";
import { useState } from "react";
import FacilityDetailsBase from "./facility-details-base";

interface FacilityDetailsSheetProps {
  facility: Facility | null;
  onClose: () => void;
}

export function FacilityDetailsView({
  facility,
  onClose,
}: FacilityDetailsSheetProps) {
  const isDesktop = useIsDesktop();
  const [snap, setSnap] = useState<string | number | null>(0.9);
  const [lastFacility, setLastFacility] = useState<Facility | null>(null);
  const [prevFacility, setPrevFacility] = useState<Facility | null>(facility);

  if (facility !== prevFacility) {
    setPrevFacility(facility);
    if (facility) {
      setLastFacility(facility);
    }
  }

  const open = !!facility;
  const facilityToRender = facility || lastFacility;

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
        <SheetContent
          side="right"
          aria-describedby={undefined}
          className="w-[380px] gap-0 overflow-hidden p-0 sm:max-w-[420px] [&>button]:hidden"
        >
          <SheetTitle className="sr-only">Facility Details</SheetTitle>
          {facilityToRender && (
            <FacilityDetailsBase
              facility={facilityToRender}
              onClose={onClose}
            />
          )}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer
      open={open}
      onOpenChange={(o) => !o && onClose()}
      snapPoints={[0.5, 0.9, 1.1]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
    >
      <DrawerContent className="flex h-dvh">
        <DrawerTitle className="sr-only">Facility Details</DrawerTitle>
        {facilityToRender && (
          <FacilityDetailsBase facility={facilityToRender} onClose={onClose} />
        )}
      </DrawerContent>
    </Drawer>
  );
}
