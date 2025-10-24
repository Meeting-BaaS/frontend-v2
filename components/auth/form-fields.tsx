"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useFormContext } from "react-hook-form";
import { PasswordField } from "@/components/auth/password-field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { itemVariant } from "@/lib/animations/auth-forms";
import {
  PRIVACY_POLICY_URL,
  TERMS_AND_CONDITIONS_URL,
} from "@/lib/external-urls";
import { cn } from "@/lib/utils";

export type FormType =
  | "sign-in"
  | "sign-up"
  | "forgot-password"
  | "reset-password";

interface FormFieldsProps {
  loading: boolean;
  formType: FormType;
}

export const FormFields = ({ loading, formType }: FormFieldsProps) => {
  const form = useFormContext();
  return (
    <>
      <motion.div
        className="flex flex-col gap-3 text-left"
        variants={itemVariant}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <FieldGroup>
          {formType === "sign-up" && (
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldContent>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={loading}
                        placeholder="Name"
                        autoComplete="name"
                        aria-label="Name"
                      />
                    </FormControl>
                    <FieldError
                      errors={fieldState.error ? [fieldState.error] : undefined}
                    />
                  </FieldContent>
                </Field>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field className={cn(formType === "reset-password" && "hidden")}>
                <FieldContent>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      value={field.value || ""} // Undefined for reset password form
                      disabled={loading}
                      placeholder="Email"
                      autoComplete="email"
                      aria-label="Email"
                    />
                  </FormControl>
                  <FieldError
                    errors={fieldState.error ? [fieldState.error] : undefined}
                  />
                </FieldContent>
              </Field>
            )}
          />
          {["sign-in", "sign-up", "reset-password"].includes(formType) && (
            <PasswordField
              loading={loading}
              formType={formType}
              name="password"
            />
          )}
          {formType === "reset-password" && (
            <PasswordField
              loading={loading}
              formType={formType}
              name="confirmPassword"
            />
          )}
        </FieldGroup>
      </motion.div>
      {formType === "sign-up" && (
        <motion.div
          className="flex flex-col gap-3"
          variants={itemVariant}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <FieldGroup>
            <FormField
              control={form.control}
              name="termsOfUse"
              render={({ field, fieldState }) => (
                <FieldGroup data-slot="checkbox-group">
                  <Field
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                  >
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                      className="border-foreground"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldLabel className="flex-wrap gap-1">
                      I agree
                      <Button
                        variant="link"
                        asChild
                        className="h-auto p-0 text-inherit underline transition-none hover:text-primary"
                      >
                        <Link
                          href={TERMS_AND_CONDITIONS_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          to the terms of use of Meeting BaaS
                        </Link>
                      </Button>
                    </FieldLabel>
                  </Field>
                  {fieldState.invalid && (
                    <FieldError
                      className="text-start"
                      errors={[fieldState.error]}
                    />
                  )}
                </FieldGroup>
              )}
            />
            <FormField
              control={form.control}
              name="privacyPolicy"
              render={({ field, fieldState }) => (
                <FieldGroup data-slot="checkbox-group">
                  <Field
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                  >
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                      className="border-foreground"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldLabel className="flex-wrap gap-1">
                      I consent
                      <Button
                        variant="link"
                        asChild
                        className="h-auto p-0 text-inherit underline transition-none hover:text-primary"
                      >
                        <Link
                          href={PRIVACY_POLICY_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          to the privacy policy of Meeting BaaS
                        </Link>
                      </Button>
                    </FieldLabel>
                  </Field>
                  {fieldState.invalid && (
                    <FieldError
                      className="text-start"
                      errors={[fieldState.error]}
                    />
                  )}
                </FieldGroup>
              )}
            />
          </FieldGroup>
        </motion.div>
      )}
    </>
  );
};
