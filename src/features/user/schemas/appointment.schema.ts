import z from "zod";
// STEP 1
export const appointmentStep1Schema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name is required")
    .max(50, "Full name cannot exceed 50 characters")
    .transform((val) => val.toLowerCase()),
  email: z.email(),
  mobileNumber: z.string(),
});
export type AppointmentStep1Data = z.infer<typeof appointmentStep1Schema>;

// STEP 2
export const appointmentStep2Schema = z.object({
  facilityId: z.string(),
});
export type AppointmentStep2Data = z.infer<typeof appointmentStep2Schema>;

// STEP 3
export const appointmentStep3Schema = z.object({
  specialist: z.enum(["general practice", "maternal health"]),
  urgencyLevel: z.enum(["routine", "soon", "urgent"]),
});
export type AppointmentStep3Data = z.infer<typeof appointmentStep3Schema>;

// STEP 4
export const appointmentStep4Schema = z.object({
  note: z.string().max(200, "Notes cannot exceed 200 characters").optional(),
});
export type AppointmentStep4Data = z.infer<typeof appointmentStep4Schema>;
