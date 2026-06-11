"use client";

import FacilityDetailsBase from "@/components/shared/organisms/facility-details-base";
import { Facility } from "@/types";

interface FacilityDetailsPanelProps {
  facility: Facility;
  onClose: () => void;
  onShowDirections?: () => void;
}

export function FacilityDetailsPanel({
  facility,
  onClose,
  onShowDirections,
}: FacilityDetailsPanelProps) {
  return (
    <aside className="h-dvh w-[380px] shrink-0 overflow-hidden border-r border-[#E2E4E9] bg-white xl:w-[420px]">
      <FacilityDetailsBase
        facility={facility}
        onClose={onClose}
        onShowDirections={onShowDirections}
        variant="drawer"
      />
    </aside>
  );
}
