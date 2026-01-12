"use client";
import FacilityListItem from "@/features/user/components/facility-list-item";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { FilterComponent } from "../shared/filter-component";

function FacilitiesPage() {
  function handleFilter(filter) {
    console.log(filter);
  }
  return (
    <main className="h-dvh p-5">
      <div className="mb-3 flex items-start gap-3">
        <Link href="/user">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-[23px] font-medium"> Facilities</h1>
        </div>
      </div>

      {/* <SearchBar filter={true} /> */}
      <FilterComponent onApplyFilters={handleFilter} />

      <div className="mt-4">{/* <FacilityListItem /> */}</div>
    </main>
  );
}

export default FacilitiesPage;
