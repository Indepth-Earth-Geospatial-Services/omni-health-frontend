import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import FacilityListItem from "./facility-list-item";

function SearchFacilityDropdown() {
  return (
    <div className="absolute top-1/2 left-1/2 flex h-75 w-full max-w-82.5 -translate-x-1/2 -translate-y-1/2 flex-col rounded-[36px] bg-white p-3 shadow-[0_16px_40px_-8px_#585C5F29]">
      <div className="relative w-full">
        <Input
          className="h-12 rounded-full border border-[#E2E4E9] pl-12 placeholder:text-[15px] placeholder:text-[#868C98]"
          placeholder="Search for Facilities"
        />
        <div className="absolute top-1/2 left-4 -translate-y-1/2">
          <Search color="#868C98" size={24} />
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-y-3">
        <FacilityListItem nearYou={true} />
        <FacilityListItem nearYou={false} />
        <FacilityListItem nearYou={false} />
      </div>
    </div>
  );
}

export default SearchFacilityDropdown;
