import { object, type output } from "zod";
import { emailSchema } from "@/lib/validators/sign-up-schema";

export const ForgotPasswordSchema = object({
  email: emailSchema,
});

export type ForgotPasswordFormData = output<typeof ForgotPasswordSchema>;
