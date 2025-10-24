"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import type { FormType } from "@/components/auth/form-fields";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldError } from "@/components/ui/field";
import { FormControl, FormField } from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

interface PasswordFieldProps {
  loading: boolean;
  formType: FormType;
  name: "password" | "confirmPassword";
}

export const PasswordField = ({
  loading,
  formType,
  name,
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const form = useFormContext();
  const label = name === "password" ? "Password" : "Confirm password";
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <Field>
          <FieldContent>
            <FormControl>
              <InputGroup>
                <InputGroupInput
                  type={showPassword ? "text" : "password"}
                  {...field}
                  disabled={loading}
                  placeholder={label}
                  autoComplete={
                    formType === "sign-up" ? "new-password" : "current-password"
                  }
                  aria-label={label}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </FormControl>
            <FieldError
              errors={fieldState.error ? [fieldState.error] : undefined}
            />
            {formType === "sign-in" && name === "password" && (
              <div className="flex justify-end mt-3">
                <Button
                  variant="link"
                  disabled={loading}
                  asChild
                  className="h-auto p-0"
                >
                  <Link href="/forgot-password">Forgot your password?</Link>
                </Button>
              </div>
            )}
          </FieldContent>
        </Field>
      )}
    />
  );
};
