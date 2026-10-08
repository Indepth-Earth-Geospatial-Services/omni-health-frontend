"use client";

import FacilityInventoryView from "../inventory/FacilityInventoryView";

interface EquipmentsPageProps {
  facilityId: string;
}

/**
 * The facility admin's inventory: Equipment and Infrastructure tabs over the
 * same chart-and-table view the super admin's By Facility tab uses, fixed to
 * this admin's facility.
 */
export default function EquipmentsPage({ facilityId }: EquipmentsPageProps) {
  return (
    <div className="w-full pb-8">
      <FacilityInventoryView facilityId={facilityId} />
    </div>
  );
}
