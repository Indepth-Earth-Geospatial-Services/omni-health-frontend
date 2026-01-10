import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import Image from "next/image";

function FacilityFilterCard({ addFacility }: { addFacility: () => void }) {
  return (
    <div className="mt-5">
      <div className="flex h-9 items-center gap-2 rounded-full border border-[#E2E4E9] p-2">
        <div className="relative size-5 overflow-hidden rounded-full">
          <Image
            src={"/img/facilities/shammah.jpg"}
            alt="facilty cover image"
            fill
          />
        </div>
        <p className="flex gap-2">
          Lagos University Teaching Hospital{" "}
          <button>
            <X size={16} />
          </button>
        </p>
      </div>

      <Button
        onClick={addFacility}
        className="bg-primary mt-4 rounded-full"
        size="lg"
      >
        <Plus size={20} /> Add a Facility
      </Button>
    </div>
  );
}

export default FacilityFilterCard;
