import { Button } from "@/components/ui/button";
import { MapIcon, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import FacilityListItem from "../../../../components/shared/molecules/facility-list-item";

// --- Empty State Component ---
export const NoFacilitiesView = ({ hasLocation }: { hasLocation: boolean }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-gray-100">
        <MapPin size={24} className="text-gray-400" />
      </div>

      {hasLocation ? (
        <>
          <h4 className="mb-1 text-[15px] font-medium text-gray-700">
            No facilities found nearby
          </h4>
          <p className="mb-4 text-[13px] text-gray-500">
            There are no medical facilities in your area. Try browsing all
            facilities.
          </p>
          <Button
            onClick={() => router.push("/facilities")}
            className="bg-primary hover:bg-primary/90 rounded-full"
          >
            Browse All Facilities
          </Button>
        </>
      ) : (
        <>
          <h4 className="mb-1 text-[15px] font-medium text-gray-700">
            Location access needed
          </h4>
          <p className="mb-4 text-[13px] text-gray-500">
            Enable location access to see facilities near you.
          </p>
          <div className="flex w-full max-w-xs flex-col gap-2">
            <Button
              onClick={() => router.push("/facilities")}
              className="bg-primary hover:bg-primary/90 rounded-full"
            >
              <MapPin size={16} /> Browse All Facilities
            </Button>
            <Button
              onClick={() => router.push("/explore-facilities")}
              className="bg-primary hover:bg-primary/90 rounded-full"
            >
              <MapIcon size={16} /> Explore on Map
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="rounded-full border-gray-300"
            >
              Enable Location Access
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

// --- Loading Skeleton ---
export const LoadingView = () => (
  <>
    {[1, 2, 3].map((i) => (
      <FacilityListItem key={i} facility={null} isLoading={true} />
    ))}
  </>
);

// --- Load More Indicator ---
export const LoadMoreTrigger = ({
  innerRef,
  isFetching,
  hasMore,
  hasItems,
}: {
  innerRef: any;
  isFetching: boolean;
  hasMore: boolean;
  hasItems: boolean;
}) => (
  <div ref={innerRef} className="flex h-5 items-center justify-center">
    {isFetching && <div className="text-gray-500">Loading more...</div>}
    {!hasMore && hasItems && (
      <div className="text-gray-500">No more facilities</div>
    )}
  </div>
);
