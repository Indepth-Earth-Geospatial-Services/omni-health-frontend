import { MapPin } from "lucide-react";

function AddressMarker() {
  return (
    <div className="flex w-45.75 items-center gap-1 rounded-[24px] border-[0.5px] border-white bg-[#FFFFFFA8] shadow-[0_2px_4px_0_#00000026]">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full border-[0.38px] border-[#D3D3D3] bg-white">
        <MapPin size={20} color="#0095FF" />
      </div>

      <div className="flex flex-col flex-wrap">
        <h4 className="text-[13px] font-medium text-[#1A1A1A]">Rumueme Hp </h4>
        <p className="text-[11px] text-[#464646]">
          74 Queen&apos; Drive
          <span className="font-medium">0.8km</span>
        </p>
      </div>
    </div>
  );
}

export default AddressMarker;
