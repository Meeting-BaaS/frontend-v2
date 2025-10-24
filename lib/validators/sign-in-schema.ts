import { object, type output } from "zod";
import { emailSchema, passwordSchema } from "@/lib/validators/sign-up-schema";

export const SignInSchema = object({
  email: emailSchema,
  password: passwordSchema,
});

export type SignInFormData = output<typeof SignInSchema>;
