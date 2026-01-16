import coverImage from "@assets/img/facilities/shammah.jpg";
import Image from "next/image";

function FacilityListItem({ nearYou }: { nearYou: boolean }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="relative size-8 overflow-hidden rounded-full">
          <Image
            src={coverImage}
            fill
            alt="facility cover image"
            className="object-cover"
          />
        </div>

        <div>
          <h3 className="text-[15px]">Port Harcourt Teaching Hospital</h3>
          <p className="flex gap-x-2 text-[11px] text-[#868C98]">
            {nearYou && (
              <>
                <span className="text-primary">Near you</span>
                <span>
                  <b>•</b>
                </span>
              </>
            )}{" "}
            <span>Port Harcourt 0.21km</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default FacilityListItem;
