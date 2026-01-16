import { Button } from "@/components/ui/button";
import { useFacility } from "../../../hooks/useFacilities";
import { AppointmentStep2Data } from "../schemas/appointment.schema";
import { useFacilityStore } from "../store/facility-store";
import { AppointmentData, AppointmentStepData } from "../types";
import FacilityListItem from "./facility-list-item";

interface AppointmentStep2Prop {
  onNext: (formData: AppointmentStepData, key: keyof AppointmentData) => void;
  onBack: () => void;
}

function AppointmentStep2({ onNext, onBack }: AppointmentStep2Prop) {
  const facilityId = useFacilityStore((state) => state.selectedFacility);

  const {
    isLoading,
    error,
    data: facilityDetailsData,
  } = useFacility(facilityId);
  const facilityDetails = facilityDetailsData.facility;
  function handleContinue() {
    onNext({ facilityId: facilityDetails.facility_id }, "step2");
  }
  return (
    <div className="mt-4 h-full w-full font-normal">
      <div className="mb-3 text-[15px]">Confirm Facility</div>

      <FacilityListItem facility={facilityDetails} />

      <div className="mt-3 text-[11px] text-[#868C98]">
        This facility will receive your appointment request and contact you to
        confirm availability.
      </div>

      <div className="mt-10 flex justify-between gap-3 pb-3">
        <Button
          onClick={onBack}
          className="h-12 grow rounded-full border border-[#E2E4E9] bg-[#F6F8FA] text-black"
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          className="bg-primary h-12 grow rounded-full"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

export default AppointmentStep2;
