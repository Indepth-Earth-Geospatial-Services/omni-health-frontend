"use client";
import FacilityDetailsBase from "@/components/shared/organisms/facility-details-base";
import { useFacilityStore } from "@/features/user/store/facility-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface FacilityDetailsPageProps {
  onShowDirections?: () => void;
}

function FacilityDetailsPage({ onShowDirections }: FacilityDetailsPageProps) {
  const router = useRouter();
  const facility = useFacilityStore((state) => state.selectedFacility);

  const handleGoBack = () => {
    router.back();
  };
  useEffect(() => {
    // If no facility is selected, go back to the previous page
    if (Object.values(facility || {}).length === 0) {
      router.push("/facilities");
    }
  }, [facility, router]);

  // Show nothing while redirecting
  if (!facility?.facility_id) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-500">Redirecting...</div>
      </div>
    );
  }

  return (
    <FacilityDetailsBase
      facility={facility}
      onShowDirections={onShowDirections}
      onClose={handleGoBack}
      variant="page"
    />
  );
}

export default FacilityDetailsPage;
