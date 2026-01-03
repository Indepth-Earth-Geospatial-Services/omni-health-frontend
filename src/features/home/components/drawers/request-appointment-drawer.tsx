"use client";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { X } from "lucide-react";
import { useState } from "react";
import { useFacility } from "../../hooks/useFacilities";
import { AppointmentData, AppointmentStepData } from "../../types";
import AppointmentStep1 from "../appointment-step-1";
import AppointmentStep2 from "../appointment-step-2";
import AppointmentStep3 from "../appointment-step-3";
import AppointmentStep4 from "../appointment-step-4";
import AppointmentStep5 from "../appointment-step-5";
import { StepProgressBar } from "../step-progress-bar";

interface FacilityDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  facilityId: string | null;
}

function RequestAppointmentDrawer({
  isOpen,
  onClose,
  facilityId,
}: FacilityDetailsProps) {
  const [requestAppointmentFormData, setRequestAppointmentFormData] =
    useState<AppointmentData>();
  const [currentStep, setCurrentStep] = useState(1);
  const [snap, setSnap] = useState<string | number | null>(0.9);

  const {
    isLoading,
    data: facilityDetails,
    error,
    refetch,
  } = useFacility(facilityId);

  function handlePreviousStep() {
    setCurrentStep((prev) => {
      if (prev > 1) return prev - 1;
      return prev;
    });
  }

  function handleNextStep(
    formData: AppointmentStepData,
    step: keyof AppointmentData,
  ) {
    setRequestAppointmentFormData((prev) => ({ ...prev, [step]: formData }));
    setCurrentStep((prev) => {
      if (prev === 4) return 4;
      return prev + 1;
    });
  }

  function onSubmit(
    formData: AppointmentStepData,
    step: keyof AppointmentData,
  ) {
    setCurrentStep(5);
    setRequestAppointmentFormData((prev) => ({ ...prev, [step]: formData }));
    const formEntries = { ...requestAppointmentFormData, [step]: formData };
    console.log(formEntries);

    // TODO REPLACE WITH ACTUAL AJAX CALL
  }

  return (
    <Drawer
      open={isOpen}
      onOpenChange={onClose}
      snapPoints={[0.4, 0.7, 0.9]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      modal={false}
    >
      <DrawerContent className="flex h-full">
        {isLoading && (
          <div className="flex h-full items-center justify-center">
            <div className="loader"></div>
          </div>
        )}
        {error && (
          <div className="flex h-full items-center justify-center p-5 text-center">
            <div>
              <p className="text-red-500">{error.message}</p>
              <Button onClick={() => refetch()} className="mt-4">
                Retry
              </Button>
            </div>
          </div>
        )}
        {facilityDetails && (
          <div className="flex h-full flex-1 flex-col pt-3">
            {/* HEADER */}
            <div className="px-5">
              <div className="mb-4 flex justify-between gap-x-2">
                <h2 className="flex flex-col text-[19px] font-medium">
                  <span>Request Appointment</span>
                  <span className="text-[13px] font-normal text-[#868C98]">
                    {facilityDetails.facility_name}
                  </span>
                </h2>
                <div className="shrink-0">
                  <Button
                    onClick={onClose}
                    className="rounded-full bg-[#E2E4E9]"
                    size="icon-sm"
                  >
                    <X size={20} color="black" />
                  </Button>
                </div>
              </div>
              {currentStep < 5 && (
                <StepProgressBar currentStep={currentStep} maxStep={4} />
              )}
            </div>

            {/* BODY */}
            <div
              key={`step-${currentStep}`}
              className="relative mt-4 grid w-full overflow-y-auto px-5 pb-3"
            >
              {currentStep === 1 && (
                <AppointmentStep1
                  initialValues={requestAppointmentFormData?.step1}
                  onNext={handleNextStep}
                />
              )}
              {currentStep === 2 && (
                <AppointmentStep2
                  onBack={handlePreviousStep}
                  onNext={handleNextStep}
                />
              )}
              {currentStep === 3 && (
                <AppointmentStep3
                  onBack={handlePreviousStep}
                  onNext={handleNextStep}
                  initialValues={requestAppointmentFormData?.step3}
                />
              )}
              {currentStep === 4 && (
                <AppointmentStep4
                  handleSubmit={onSubmit}
                  onBack={handlePreviousStep}
                />
              )}

              {currentStep === 5 && <AppointmentStep5 />}
              <div className="h-20"></div>
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}

export default RequestAppointmentDrawer;
