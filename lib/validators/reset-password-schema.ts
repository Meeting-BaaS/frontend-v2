import { object, type output } from "zod";
import { passwordSchema } from "@/lib/validators/sign-up-schema";

export const ResetPasswordSchema = object({
  password: passwordSchema,
  confirmPassword: passwordSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

export type ResetPasswordFormData = output<typeof ResetPasswordSchema>;
