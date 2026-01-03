import FacilityStatCard from "@/features/home/components/facility-stat-card";
import { Car, MousePointer2, Star } from "lucide-react";

function FacilityRatingsCard() {
  return (
    <div className="mt-6 rounded-[24px] border border-[#E2E4E9] bg-white p-3">
      <div>
        {/* HEADER */}
        <div className="space-y-1">
          <h4 className="text-[19px] font-normal">
            Lagos University Teaching Hospital
          </h4>
        </div>

        {/* FACILTY INFO */}
        <div className="text-[11px] text-[#868C98]">
          <div className="">
            <h6 className="text-primary">Hospital</h6>
            <div className="mt-1 flex flex-wrap gap-2.5 *:flex *:items-center *:gap-1">
              <p>
                <MousePointer2 size={12} /> Distance: <b>0.8km</b>
              </p>
              <p>
                <Star size={12} /> Rating: <b>4.9</b>
              </p>
              <p>
                <Car size={12} /> Drive: <b>8mins</b>
              </p>
            </div>
          </div>
        </div>
        {/* RATING */}
        <div className="mt-2.5 grid grid-cols-3 divide-x divide-[#E2E4E9] text-center">
          {/* TODO MOVE TO SHARED COMPONENTS */}
          <FacilityStatCard attr="Ratings" value={4.9} />
          <FacilityStatCard attr="Dr:Patient" value={"1:34"} />
          <FacilityStatCard attr="Specialists" value={5} />
        </div>
      </div>
    </div>
  );
}

export default FacilityRatingsCard;
