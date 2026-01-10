import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import CompareFacility from "@/features/compare-facilities/components/facility-filter-card";
import FacilityFilterCard from "@/features/compare-facilities/components/facility-filter-card";
import FacilityRatingsCard from "@/features/compare-facilities/components/faciltiy-ratings-card";
import SearchFacilityDropdown from "@/features/compare-facilities/components/search-facility-dropdown";
import EmptyState from "@/features/compare-facilities/components/emptyState";

function CompareFacilitiesPage() {
  return (
    <main className="relative h-dvh px-5 pt-5">
      <div className="flex items-start gap-3">
        <Link href="/">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-[23px] font-medium">Compare Facilities</h1>
          <p className="text-[13px] text-[#868C98]">
            Select up to 4 facilities
          </p>
        </div>
      </div>
      {/* <EmptyState /> */}
      {/* <SearchFacilityDropdown /> */}
      {/* <FacilityFilterCard /> */}
      {/* <FacilityRatingsCard /> */}
    </main>
  );
}

export default CompareFacilitiesPage;
