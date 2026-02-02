import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useUserStore } from "@/features/user/store/user-store";
import { useDistanceCalculation } from "@/hooks/use-distance-calculation";
import { cn, getFacilityDefaults } from "@/lib/utils";
import { ChevronRight, Clock } from "lucide-react";
import { Facility } from "../../../types/api-response";
import { GalleryImage } from "../atoms/gallery-image";
import { memo } from "react";

interface FacilityListItemProps {
  facility: Facility | null;
  nearUser?: boolean;
  isLoading?: boolean;
  onViewDetails?: (facility: Facility) => void;
}

function FacilityListItem(props: FacilityListItemProps) {
  const {
    onViewDetails,
    nearUser = false,
    facility,
    isLoading = false,
  } = props;
  const userLocation = useUserStore((state) => state.userLocation);

  const facilityData = getFacilityDefaults(facility);

  const facilityName = facilityData?.facility_name;
  const facilityAddress = facilityData?.address;
  const facilityCategory = facilityData?.facility_category;
  const roadDistance = facilityData?.road_distance_meters / 1000;
  const facilityId = facilityData?.facility_id;
  const facilityLat = facilityData?.lat;
  const facilityLon = facilityData?.lon;
  const imageUrl = facilityData?.image_urls?.[0] || null;

  const { formattedDistance, isLoading: isLoadingDistance } =
    useDistanceCalculation({
      facilityId,
      facilityLocation: { latitude: facilityLat, longitude: facilityLon },
      userLocation,
    });
  // Get current day's working hours
  const currentDay = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();
  const workingHours = facility?.working_hours?.[currentDay];

  const displayDistance = facility?.road_distance_meters
    ? `${roadDistance.toFixed(1)}km`
    : formattedDistance;

  const distanceText = displayDistance;
  const lgaText = facility?.facility_lga;

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
              <Skeleton className="50%w-20 h-[14px]" />
              <Skeleton className="h-[14px] w-16" />
            </div>
            {/* Bottom section skeleton */}
            <div className="flex justify-between pt-2">
              <Skeleton className="50%w-28 h-[14px]" />
              <Skeleton className="h-[14px] w-20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full cursor-pointer text-left"
      onClick={() => (onViewDetails ? onViewDetails(facility!) : null)}
    >
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
          <GalleryImage url={imageUrl} />
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
                <p>{lgaText}</p>
                <p>
                  Distance:{" "}
                  <b>{isLoadingDistance ? <Spinner /> : distanceText}</b>
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
                  // onClick={() => onViewDetails(facility!)}
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

export default memo(FacilityListItem);
