"use client";

import FacilityDetailsBase from "@/components/shared/organisms/facility-details-base";
import { Facility } from "@/types";

interface FacilityDetailsPanelProps {
  facility: Facility;
  onClose: () => void;
}

export function FacilityDetailsPanel({
  facility,
  onClose,
}: FacilityDetailsPanelProps) {
  return (
    <aside className="h-dvh w-[380px] shrink-0 overflow-hidden border-r border-[#E2E4E9] bg-white xl:w-[420px]">
      <FacilityDetailsBase
        facility={facility}
        onClose={onClose}
        variant="page"
      />
    </aside>
  );
}
