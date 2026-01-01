import { Button } from "@/components/ui/button";
import { AppointmentData, AppointmentStepData } from "../types";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import {
  AppointmentStep1Data,
  appointmentStep1Schema,
} from "../schemas/appointment.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

interface AppointmentStep1Prop {
  onNext: (formData: AppointmentStepData, key: keyof AppointmentData) => void;
  initialValues: AppointmentStep1Data;
}

function AppointmentStep4({ onNext, initialValues }: AppointmentStep1Prop) {
  const form = useForm<AppointmentStep1Data>({
    resolver: zodResolver(appointmentStep1Schema),
    defaultValues: initialValues || {
      email: "",
      fullName: "",
      mobileNumber: "",
    },
  });
  function onSubmit(data: AppointmentStep1Data) {
    onNext(data, "step1");
  }
  return (
    <div className="mt-4 h-full w-full font-normal">
      <div className="mb-3 text-[15px]">Your Details</div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="gap-3">
          {/* FULL NAME */}
          <Controller
            name="fullName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel
                  className="text-xs font-normal text-[#0A0D14]"
                  htmlFor={field.name}
                >
                  Your Full Name
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="John Doe"
                  className="h-12 rounded-xl border border-[#E2E4E9] bg-[#F6F8FA]"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/*MOBILE NUMBER */}
          <Controller
            name="mobileNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel
                  className="text-xs font-normal text-[#0A0D14]"
                  htmlFor={field.name}
                >
                  Your Mobile Number
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="+2348149175895"
                  className="h-12 rounded-xl border border-[#E2E4E9] bg-[#F6F8FA]"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* EMAIL */}
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel
                  className="text-xs font-normal text-[#0A0D14]"
                  htmlFor={field.name}
                >
                  Email Address
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="youremail@gmail.com"
                  className="h-12 rounded-xl border border-[#E2E4E9] bg-[#F6F8FA]"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <div className="mt-12 flex w-full justify-center px-5">
          <Button className="bg-primary h-12 grow rounded-full">
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AppointmentStep4;
