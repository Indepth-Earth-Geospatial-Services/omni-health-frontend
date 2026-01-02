import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  AppointmentStep4Data,
  appointmentStep4Schema,
} from "../schemas/appointment.schema";
import { AppointmentData, AppointmentStepData } from "../types";

interface AppointmentStep4Prop {
  handleSubmit: (
    formData: AppointmentStepData,
    key: keyof AppointmentData,
  ) => void;
  onBack: () => void;
}

function AppointmentStep4({ handleSubmit, onBack }: AppointmentStep4Prop) {
  const form = useForm<AppointmentStep4Data>({
    resolver: zodResolver(appointmentStep4Schema),
    defaultValues: {
      note: "",
    },
  });
  function onSubmit(data: AppointmentStep4Data) {
    handleSubmit(data, "step4");
  }
  return (
    <div className="mt-4 h-full w-full font-normal">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="gap-3">
          {/* FULL NAME */}
          <Controller
            name="note"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel
                  className="text-[15px] font-normal"
                  htmlFor={field.name}
                >
                  Additional Notes
                </FieldLabel>
                <FieldDescription className="text-xs font-normal text-[#0A0D14]">
                  Describe your symptoms or reason for the visit
                </FieldDescription>

                <Textarea
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  rows={4}
                  className="h-[103px] rounded-xl border border-[#E2E4E9] bg-[#F6F8FA]"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <p className="text-[11px] text-[#D5801E]">
            This is not a diagnostic tool. Please consult a medical professional
            for proper diagnosis.
          </p>
        </FieldGroup>

        <div className="mt-10 flex justify-between gap-3">
          <Button
            onClick={onBack}
            className="h-12 grow rounded-full border border-[#E2E4E9] bg-[#F6F8FA] text-black"
          >
            Back
          </Button>
          <Button type="submit" className="bg-primary h-12 grow rounded-full">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AppointmentStep4;
