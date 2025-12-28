import { cn } from "@/lib/utils";
import { ChevronRight, Clock, MousePointer2, Users } from "lucide-react";
import Image from "next/image";
import { NearestFacilityResponse } from "../types/apiResponse";

interface FacilityListItemProps {
  facility: NearestFacilityResponse | null;
  nearUser: boolean;
  isLoading: boolean;
  error: string;
  onViewDetails: (facility: string) => void;
}

function FacilityListItem(props: FacilityListItemProps) {
  const { onViewDetails, nearUser, facility, isLoading, error } = props;
  if (isLoading || Object.keys(facility || {}).length === null)
    return (
      <div className="flex -scale-50 items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center text-red-700">
        {error}
      </div>
    );
  return (
    <div className="w-full text-left">
      {nearUser && (
        <div className="relative top-1 z-10 flex justify-end pr-2.25">
          <h6 className="bg-primary flex h-5.5 w-16 items-center justify-center rounded-[6px] text-[11px] text-white">
            Near you!
          </h6>
        </div>
      )}
      <div
        className={cn(
          "relative z-20 flex gap-x-2 rounded-3xl border border-[#E2E4E9] bg-white p-2",
          nearUser && "border-primary",
        )}
      >
        {/* image */}
        <div className="relative size-29.5 overflow-hidden rounded-xl">
          <Image
            fill
            src={"/img/facilities/shammah.jpg"}
            className="size-full object-cover"
            alt="facility cover image"
          />
        </div>

        {/* DETAILS */}
        <div>
          {/* HEADER */}
          <div className="space-y-1">
            <h4 className="text-[15px] font-medium">
              {facility?.facility_name}
            </h4>
            <p className="text-[11px]">{facility?.address}</p>
          </div>

          {/* FACILTY INFO */}
          <div className="text-[11px] text-[#868C98]">
            <div className="border-b border-[#E2E4E9] pb-2">
              <h6 className="text-primary">{facility?.facility_category}</h6>
              <div className="mt-1 flex flex-wrap gap-2.5 *:flex *:items-center *:gap-1">
                <p>
                  <MousePointer2 size={12} /> Distance:{" "}
                  <b>{facility?.road_distance_meters}m</b>
                </p>
                <p>
                  <Users size={12} /> Ratio: <b>1:32</b>
                </p>
              </div>
            </div>
            {/*  */}
            <div className="mt-2 flex flex-wrap justify-between *:flex *:items-center *:gap-1">
              <span>
                <Clock size={12} />
                {
                  facility?.working_hours[
                    new Date()
                      .toLocaleDateString("en-Us", { weekday: "long" })
                      .toLowerCase()
                  ]
                }
                {/* 07:00am - 6.00pm */}
              </span>
              <button
                onClick={() => onViewDetails("facility-id")}
                className="text-primary cursor-pointer"
              >
                View Details <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacilityListItem;
