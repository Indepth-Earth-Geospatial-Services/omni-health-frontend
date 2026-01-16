import z from "zod";

export const feedbackSchema = z.object({
  name: z
    .string()
    .min(2, "Please enter your name")
    .max(50, "Name is too long")
    .transform((val) => val.toLowerCase()),
  email: z.email(),
  message: z
    .string()
    .min(10, "Message should be at least 10 characters")
    .max(500, "Message cannot exceed 500 characters")
    .transform((val) => val.toLowerCase()),
  messageType: z.enum(["general feedback", "emergency"]),
});

export type FeedbackData = z.infer<typeof feedbackSchema>;
