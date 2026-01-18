"use client";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useFacility } from "../../../hooks/useFacilities";
import { useDrawerStore } from "../store/drawer-store";
import { useFacilityStore } from "../store/facility-store";
import { useState } from "react";
import { toast } from "sonner";

function AppointmentStep5() {
  const [copied, setCopied] = useState(false);
  const facility = useFacilityStore((state) => state.selectedFacility);

  const {
    data: facilityDetailsData,
    isLoading,
    error,
  } = useFacility(facility.facility_id);
  const facilityDetails = facilityDetailsData.facility;
  const openDetails = useDrawerStore((state) => state.openDetails);

  const handleCopy = async () => {
    // FIXME REPLACE WITH THE RIGHT COPY TEXT
    try {
      await navigator.clipboard.writeText("REQ MJKATY90");
      toast.success("Copied to clipboard");
      setCopied(true);
    } catch {
      toast.error("Failed to copy");
    } finally {
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <div className="mt-10">
      <div className="mx-auto flex w-full max-w-53.5 flex-col items-center text-center">
        <div className="mb-2 flex size-16 items-center justify-center rounded-full border border-[#51A199] bg-[#E0FFFC]">
          <Check size={24} color="#51A199" />
        </div>

        <h4 className="text-[19px] font-medium">Request Submitted!</h4>
        <p className="text-[13px] text-[#868C98]">
          Your specialist appointment request has been sent to{" "}
          {facilityDetails.facility_name}
        </p>
      </div>

      {/* BOOKING DETAILS */}
      <div className="mt-20 space-y-1 rounded-3xl border border-[#E2E4E9] bg-[#F6F8FA] p-3">
        <h5 className="text-[15px] text-[#868C98]">Booking ID</h5>

        <button
          onClick={handleCopy}
          className="flex items-center gap-3 text-[19px] text-[#0A0D14]"
        >
          REQ MJKATY90{" "}
          {copied ? (
            <Check size={24} color="#51A199" />
          ) : (
            <Copy size={24} color="#868C98" />
          )}
        </button>

        <p className="text-[15px] text-[#868C98]">
          Expected response within 24-48 hours
        </p>
      </div>

      <div className="mt-[31px] flex">
        <Button
          onClick={openDetails}
          className="bg-primary h-12 grow rounded-full"
        >
          Done
        </Button>
      </div>
    </div>
  );
}

export default AppointmentStep5;
