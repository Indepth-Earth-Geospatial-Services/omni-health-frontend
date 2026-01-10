import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import Image from "next/image";
import locationPin from "@assets/img/icons/svg/location-pin.svg";

function LocationCard({ facilityAddress }: { facilityAddress: string }) {
  return (
    <div className="flex h-25 w-full items-center rounded-2xl bg-white px-5 py-4 text-[15px] shadow-[0_16px_40px_-8px_#585C5F29]">
      {/* FROM */}
      <div className="w-full">
        <div className="flex items-center gap-2 border-b border-[#E2E4E9] pb-3 text-[#0095FF]">
          <Image src={locationPin} alt="" className="size-6 animate-pulse" />
          Your Location
        </div>
        {/* TO  */}
        <div className="flex items-center gap-2 pt-3">
          <MapPin size={20} />
          {/* {facilityAddress} */}
          Rumueme Health Post
        </div>
      </div>
    </div>
  );
}

export default LocationCard;
