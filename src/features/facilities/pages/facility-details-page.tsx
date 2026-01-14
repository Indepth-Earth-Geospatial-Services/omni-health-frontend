// import FacilityDetails from "@/features/facilities/components/facility-details";

// function FacilityDetailsPage({ facilityId }: { facilityId: string }) {
//   return <FacilityDetails facilityId={facilityId} />;
// }

// export default FacilityDetailsPage;

"use client";
import FacilityDetailsBase from "@/components/shared/organisms/facility-details-base";
import { useRouter } from "next/navigation";

interface FacilityDetailsPageProps {
  facilityId: string;
  onShowDirections?: () => void;
}

function FacilityDetailsPage({
  facilityId,
  onShowDirections,
}: FacilityDetailsPageProps) {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <FacilityDetailsBase
      facilityId={facilityId}
      onShowDirections={onShowDirections}
      onClose={handleGoBack}
      variant="page"
    />
  );
}

export default FacilityDetailsPage;
