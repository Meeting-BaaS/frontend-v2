import isStrongPassword from "validator/lib/isStrongPassword";
import { boolean, object, type output, string } from "zod";

export const emailSchema = string()
  .trim()
  .min(1, "Please enter email")
  .email("Please enter a valid email")
  .max(255, "Email is too long");

export const passwordSchema = string()
  .trim()
  .min(1, "Please enter password")
  .max(100, "Password is too long")
  .refine(
    (value) => {
      return isStrongPassword(value, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      });
    },
    {
      message:
        "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol.",
    },
  );

export const SignUpSchema = object({
  name: string()
    .trim()
    .min(1, "Please enter name")
    .max(100, "Name is too long"),
  email: emailSchema,
  password: passwordSchema,
  termsOfUse: boolean().refine(
    (val) => val === true,
    "Please agree to the terms of use",
  ),
  privacyPolicy: boolean().refine(
    (val) => val === true,
    "Please consent to the privacy policy",
  ),
});

export type SignUpFormData = output<typeof SignUpSchema>;
