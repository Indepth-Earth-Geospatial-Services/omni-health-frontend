import Link from "next/link";
import SearchBar from "../shared/search-bar";
import { Input } from "../ui/input";
import { ArrowLeft } from "lucide-react";
import FacilityListItem from "@/features/home/components/facility-list-item";

function FacilitiesPage() {
  return (
    <main className="h-dvh p-5">
      <div className="mb-3 flex items-start gap-3">
        <Link href="/">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-[23px] font-medium"> Facilities</h1>
        </div>
      </div>

      <SearchBar filter={true} />

      <div className="mt-4">
        <FacilityListItem />
      </div>
    </main>
  );
}

export default FacilitiesPage;
