// import { cn } from "@/lib/utils";
// import {
//   ChevronRight,
//   Clock,
//   ImageOff,
//   MousePointer2,
//   Users,
// } from "lucide-react";
// import { Facility } from "../types/apiResponse";

// interface FacilityListItemProps {
//   facility: Facility | null;
//   nearUser?: boolean;
//   onViewDetails?: (facility: string) => void;
// }

// function FacilityListItem(props: FacilityListItemProps) {
//   const { onViewDetails, nearUser = false, facility } = props;

//   return (
//     <div className="w-full text-left">
//       {nearUser && (
//         <div className="relative top-1 z-10 flex justify-end pr-2.25">
//           <h6 className="bg-primary flex h-5.5 w-16 items-center justify-center rounded-[6px] text-[11px] text-white">
//             Near you!
//           </h6>
//         </div>
//       )}
//       <div
//         className={cn(
//           "relative z-20 flex gap-x-2 rounded-3xl border border-[#E2E4E9] bg-white p-2",
//           nearUser && "border-primary",
//         )}
//       >
//         {/* image */}
//         <div className="relative size-29.5 overflow-hidden rounded-xl">
//           {/* <Image
//             fill
//             src={"/img/facilities/shammah.jpg"}
//             className="size-full object-cover"
//             alt="facility cover image"
//           /> */}
//           <div className="flex h-full items-center justify-center">
//             <ImageOff />
//           </div>
//         </div>

//         {/* DETAILS */}
//         <div>
//           {/* HEADER */}
//           <div className="space-y-1">
//             <h4 className="text-[15px] font-medium">
//               {facility?.facility_name}
//             </h4>
//             <p className="text-[11px]">{facility?.address}</p>
//           </div>

//           {/* FACILTY INFO */}
//           <div className="text-[11px] text-[#868C98]">
//             <div className="border-b border-[#E2E4E9] pb-2">
//               <h6 className="text-primary">{facility?.facility_category}</h6>
//               <div className="mt-1 flex flex-wrap gap-2.5 *:flex *:items-center *:gap-1">
//                 <p>
//                   <MousePointer2 size={12} /> Distance:{" "}
//                   <b>
//                     {facility?.road_distance_meters
//                       ? `${facility?.road_distance_meters}m`
//                       : "N/A"}
//                   </b>
//                 </p>
//                 <p>
//                   <Users size={12} /> Rating: <b>N/A</b>
//                 </p>
//               </div>
//             </div>
//             {/*  */}
//             <div className="mt-2 flex flex-wrap justify-between *:flex *:items-center *:gap-1">
//               <span>
//                 <Clock size={12} />
//                 {
//                   facility?.working_hours[
//                     new Date()
//                       .toLocaleDateString("en-Us", { weekday: "long" })
//                       .toLowerCase()
//                   ]
//                 }
//                 {/* 07:00am - 6.00pm */}
//               </span>
//               {onViewDetails && (
//                 <button
//                   onClick={() =>
//                     onViewDetails(
//                       facility.facility_id || `facility-${facility.hfr_id}`,
//                     )
//                   }
//                   className="text-primary cursor-pointer"
//                 >
//                   View Details <ChevronRight size={12} />
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default FacilityListItem;
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Clock,
  ImageOff,
  MousePointer2,
  Users,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Facility } from "../types/apiResponse";

interface FacilityListItemProps {
  facility: Facility | null;
  nearUser?: boolean;
  isLoading?: boolean;
  onViewDetails?: (facility: string) => void;
}

function FacilityListItem(props: FacilityListItemProps) {
  const {
    onViewDetails,
    nearUser = false,
    facility,
    isLoading = false,
  } = props;

  // Extract all variables explicitly for maintainability
  const facilityName = facility?.facility_name;
  const facilityAddress = facility?.address;
  const facilityCategory = facility?.facility_category;
  const roadDistance = facility?.road_distance_meters;
  const facilityId = facility?.facility_id || `facility-${facility?.hfr_id}`;

  // Get current day's working hours
  const currentDay = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();
  const workingHours = facility?.working_hours?.[currentDay];

  // Display values
  const distanceText = roadDistance ? `${roadDistance}m` : "N/A";
  const ratingText = "N/A";

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className="w-full text-left">
        <div className="flex gap-x-2 rounded-3xl border border-[#E2E4E9] bg-white p-2">
          {/* Image skeleton */}
          <Skeleton className="size-29.5 rounded-xl" />

          {/* Details skeleton */}
          <div className="space-y-3">
            {/* Header skeleton */}
            <div className="space-y-1.5">
              <Skeleton className="h-[18px] w-3/4" />
              <Skeleton className="h-[14px] w-full" />
            </div>

            {/* Category skeleton */}
            <Skeleton className="h-[14px] w-24" />

            {/* Info items skeleton */}
            <div className="flex gap-2.5">
              <Skeleton className="h-[14px] w-20" />
              <Skeleton className="h-[14px] w-16" />
            </div>

            {/* Bottom section skeleton */}
            <div className="flex justify-between pt-2">
              <Skeleton className="h-[14px] w-28" />
              <Skeleton className="h-[14px] w-20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        {/* Image */}
        <div className="relative size-29.5 shrink-0 overflow-hidden rounded-xl">
          <div className="flex h-full items-center justify-center bg-gray-100">
            <ImageOff className="text-gray-400" />
          </div>
        </div>

        {/* Details */}
        <div className="">
          {/* Header */}
          <div className="space-y-1">
            <h4 className="text-[15px] font-medium">{facilityName}</h4>
            <p className="text-[11px]">{facilityAddress}</p>
          </div>

          {/* Facility Info */}
          <div className="text-[11px] text-[#868C98]">
            <div className="border-b border-[#E2E4E9] pb-2">
              <h6 className="text-primary">{facilityCategory}</h6>
              <div className="mt-1 flex flex-wrap gap-2.5 *:flex *:items-center *:gap-1">
                <p>
                  <MousePointer2 size={12} /> Distance: <b>{distanceText}</b>
                </p>
                <p>
                  <Users size={12} /> Rating: <b>{ratingText}</b>
                </p>
              </div>
            </div>

            {/* Bottom section */}
            <div className="mt-2 flex flex-wrap justify-between *:flex *:items-center *:gap-1">
              <span>
                <Clock size={12} />
                {workingHours || "Hours not available"}
              </span>
              {onViewDetails && (
                <button
                  onClick={() => onViewDetails(facilityId)}
                  className="text-primary cursor-pointer"
                >
                  View Details <ChevronRight size={12} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacilityListItem;
