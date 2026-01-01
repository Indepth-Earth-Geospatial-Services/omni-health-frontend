// import { Button } from "@/components/ui/button";
// import { AppointmentData, AppointmentStepData } from "../types";
// import { Input } from "@/components/ui/input";
// import { Controller, useForm } from "react-hook-form";
// import {
//   AppointmentStep1Data,
//   appointmentStep1Schema,
// } from "../schemas/appointment.schema";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Field,
//   FieldError,
//   FieldGroup,
//   FieldLabel,
// } from "@/components/ui/field";

// interface AppointmentStep1Prop {
//   onNext: (formData: AppointmentStepData, key: keyof AppointmentData) => void;
//   initialValues: AppointmentStep1Data;
// }

// function AppointmentStep3({ onNext, initialValues }: AppointmentStep1Prop) {
//   const form = useForm<AppointmentStep1Data>({
//     resolver: zodResolver(appointmentStep1Schema),
//     defaultValues: initialValues || {
//       email: "",
//       fullName: "",
//       mobileNumber: "",
//     },
//   });
//   function onSubmit(data: AppointmentStep1Data) {
//     onNext(data, "step1");
//   }
//   return (
//     <div className="mt-4 h-full w-full font-normal">
//       <div className="mb-3 text-[15px]">Your Details</div>
//       <form onSubmit={form.handleSubmit(onSubmit)}>
//         <FieldGroup className="gap-3">
//           {/* FULL NAME */}
//           <Controller
//             name="fullName"
//             control={form.control}
//             render={({ field, fieldState }) => (
//               <Field>
//                 <FieldLabel
//                   className="text-xs font-normal text-[#0A0D14]"
//                   htmlFor={field.name}
//                 >
//                   Your Full Name
//                 </FieldLabel>
//                 <Input
//                   {...field}
//                   id={field.name}
//                   aria-invalid={fieldState.invalid}
//                   placeholder="John Doe"
//                   className="h-12 rounded-xl border border-[#E2E4E9] bg-[#F6F8FA]"
//                 />
//                 {fieldState.invalid && (
//                   <FieldError errors={[fieldState.error]} />
//                 )}
//               </Field>
//             )}
//           />

//           {/*MOBILE NUMBER */}
//           <Controller
//             name="mobileNumber"
//             control={form.control}
//             render={({ field, fieldState }) => (
//               <Field>
//                 <FieldLabel
//                   className="text-xs font-normal text-[#0A0D14]"
//                   htmlFor={field.name}
//                 >
//                   Your Mobile Number
//                 </FieldLabel>
//                 <Input
//                   {...field}
//                   id={field.name}
//                   aria-invalid={fieldState.invalid}
//                   placeholder="+2348149175895"
//                   className="h-12 rounded-xl border border-[#E2E4E9] bg-[#F6F8FA]"
//                 />
//                 {fieldState.invalid && (
//                   <FieldError errors={[fieldState.error]} />
//                 )}
//               </Field>
//             )}
//           />

//           {/* EMAIL */}
//           <Controller
//             name="email"
//             control={form.control}
//             render={({ field, fieldState }) => (
//               <Field>
//                 <FieldLabel
//                   className="text-xs font-normal text-[#0A0D14]"
//                   htmlFor={field.name}
//                 >
//                   Email Address
//                 </FieldLabel>
//                 <Input
//                   {...field}
//                   id={field.name}
//                   aria-invalid={fieldState.invalid}
//                   placeholder="youremail@gmail.com"
//                   className="h-12 rounded-xl border border-[#E2E4E9] bg-[#F6F8FA]"
//                 />
//                 {fieldState.invalid && (
//                   <FieldError errors={[fieldState.error]} />
//                 )}
//               </Field>
//             )}
//           />
//         </FieldGroup>

//         <div className="mt-12 flex w-full justify-center px-5">
//           <Button className="bg-primary h-12 grow rounded-full">
//             Continue
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default AppointmentStep3;
"use client";
import { Button } from "@/components/ui/button";
import { AppointmentData, AppointmentStepData } from "../types";
import { Controller, useForm } from "react-hook-form";
import {
  AppointmentStep3Data,
  appointmentStep3Schema,
} from "../schemas/appointment.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft } from "lucide-react";

interface AppointmentStep3Prop {
  onNext: (formData: AppointmentStepData, key: keyof AppointmentData) => void;
  onBack: () => void;
  initialValues?: AppointmentStep3Data;
}

function AppointmentStep3({
  onNext,
  onBack,
  initialValues,
}: AppointmentStep3Prop) {
  const form = useForm<AppointmentStep3Data>({
    resolver: zodResolver(appointmentStep3Schema),
    defaultValues: initialValues || {
      specialist: undefined,
      urgencyLevel: undefined,
    },
  });

  function onSubmit(data: AppointmentStep3Data) {
    onNext(data, "step3");
  }

  const specialistOptions = [
    {
      value: "general practice",
      title: "General Practice",
      description:
        "For routine check-ups, common illnesses, and general health concerns",
    },
    {
      value: "maternal health",
      title: "Maternal Health",
      description:
        "For pregnancy care, postnatal check-ups, and women's health",
    },
  ];

  const urgencyOptions = [
    {
      value: "routine",
      title: "Routine",
      description: "Regular check-up or Follow up",
    },
    {
      value: "soon",
      title: "Soon",
      description: "Within the next few days",
    },
    {
      value: "urgent",
      title: "Urgent",
      description: "Requires immediate attention",
    },
  ];

  return (
    <div className="mt-4 h-full w-full font-normal">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* SPECIALIST SELECTION */}
        <FieldGroup>
          <FieldSet>
            <FieldLabel
              htmlFor="specialist"
              className="text-[15px] font-normal"
            >
              Select Specialist
            </FieldLabel>

            <Controller
              name="specialist"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="space-y-3"
                    id="specialist"
                  >
                    {specialistOptions.map((option) => (
                      <FieldLabel
                        htmlFor={`specialist-${option.value}`}
                        key={option.value}
                        className="cursor-pointer"
                      >
                        <Field
                          orientation="horizontal"
                          className="items-start rounded-xl border border-[#E2E4E9] p-4 transition-colors hover:border-[#51A199] hover:bg-[#F6F8FA]"
                        >
                          <FieldContent className="flex-1">
                            <FieldTitle className="text-[15px] font-normal text-[#868C98]">
                              {option.title}
                            </FieldTitle>
                            {/* <FieldDescription className="mt-1 text-xs text-[#666]">
                              {option.description}
                            </FieldDescription> */}
                          </FieldContent>
                          <RadioGroupItem
                            value={option.value}
                            id={`specialist-${option.value}`}
                            className="mt-1"
                          />
                        </Field>
                      </FieldLabel>
                    ))}
                  </RadioGroup>
                  {fieldState.error && (
                    <p className="mt-2 text-xs text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </FieldSet>
        </FieldGroup>

        {/* URGENCY LEVEL SELECTION */}
        <FieldGroup>
          <FieldSet>
            <FieldLabel htmlFor="urgencyLevel" className="text-sm font-normal">
              Urgency Level
            </FieldLabel>
            {/* <FieldDescription className="text-xs text-[#666]">
              How soon do you need to be seen?
            </FieldDescription> */}
            <Controller
              name="urgencyLevel"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="space-y-3"
                    id="urgencyLevel"
                  >
                    {urgencyOptions.map((option) => (
                      <FieldLabel
                        htmlFor={`urgency-${option.value}`}
                        key={option.value}
                        className="cursor-pointer"
                      >
                        <Field
                          orientation="horizontal"
                          className="items-start rounded-xl border border-[#E2E4E9] p-4 transition-colors hover:border-[#51A199] hover:bg-[#F6F8FA]"
                        >
                          <FieldContent className="flex-1">
                            <FieldTitle className="text-[15px] font-normal text-[#525866]">
                              {option.title}
                            </FieldTitle>
                            <FieldDescription className="mt-1 text-[11px] text-[#868C98]">
                              {option.description}
                            </FieldDescription>
                          </FieldContent>
                          <RadioGroupItem
                            value={option.value}
                            id={`urgency-${option.value}`}
                            className="mt-1"
                          />
                        </Field>
                      </FieldLabel>
                    ))}
                  </RadioGroup>
                  {fieldState.error && (
                    <p className="mt-2 text-xs text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </FieldSet>
        </FieldGroup>

        <div className="sticky flex gap-3">
          <Button
            type="button"
            onClick={onBack}
            className="h-12 grow rounded-full border border-[#E2E4E9] bg-[#F6F8FA] text-black"
          >
            Back
          </Button>
          <Button type="submit" className="bg-primary h-12 grow rounded-full">
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AppointmentStep3;
