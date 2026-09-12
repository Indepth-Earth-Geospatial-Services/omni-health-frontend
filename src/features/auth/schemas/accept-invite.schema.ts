import { z } from "zod";

/**
 * The API only enforces a minimum of 8 characters. The complexity rule matches
 * the one the registration form used, so invited admins end up with passwords
 * no weaker than self-registered accounts had.
 */
export const acceptInviteSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type AcceptInviteFormData = z.infer<typeof acceptInviteSchema>;
