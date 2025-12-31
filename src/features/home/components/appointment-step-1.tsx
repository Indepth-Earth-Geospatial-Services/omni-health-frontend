import { Button } from "@/components/ui/button";
import { AppointmentData, AppointmentStepData } from "../types";

function AppointmentStep1({
  onNext,
}: {
  onNext: (formData: AppointmentStepData, key: keyof AppointmentData) => void;
}) {
  return (
    <div>
      <div>STEP 1</div>
      {/* FOOTER */}
      <div className="flex w-full justify-center px-5">
        <Button className="bg-primary h-12 grow rounded-full">Continue</Button>
      </div>
    </div>
  );
}

export default AppointmentStep1;
