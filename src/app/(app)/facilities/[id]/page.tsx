import FacilityDetailsPage from "@/features/facilities/pages/facility-details-page";

async function Page({ params }) {
  const { id } = await params;
  return <FacilityDetailsPage facilityId={id} />;
}

export default Page;
