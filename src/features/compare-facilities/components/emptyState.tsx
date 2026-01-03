import { Button } from "@/components/ui/button";
import noCompareFacilities from "@assets/img/icons/svg/no-compare-facilities.svg";
import { Plus } from "lucide-react";
import Image from "next/image";

function EmptyState({ onAddFacility }: { onAddFacility: () => void }) {
  return (
    <div className="absolute top-1/2 left-1/2 flex w-full max-w-69 -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
      <Image src={noCompareFacilities} alt="" className="" />

      <div className="mt-4">
        <h3 className="text-[19px]">No Facilities Selected</h3>
        <p className="text-[13px] text-[#868C98]">
          Add facilities to compare their performance metrics, ratings, and
          specialist availability side by side.
        </p>

        <Button
          onClick={onAddFacility}
          className="bg-primary mt-6 rounded-full"
          size="lg"
        >
          <Plus size={20} /> Add a Facility
        </Button>
      </div>
    </div>
  );
}

export default EmptyState;
