"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { FormControl, FormField } from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

interface PasswordFieldProps {
  loading: boolean;
  name: string;
  placeholder?: string;
  label?: string;
  autoComplete: string;
  showForgotPasswordLink?: boolean;
}

export const PasswordField = ({
  loading,
  name,
  label,
  placeholder,
  autoComplete,
  showForgotPasswordLink = false,
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
          <FieldContent>
            <FormControl>
              <InputGroup>
                <InputGroupInput
                  id={name}
                  type={showPassword ? "text" : "password"}
                  {...field}
                  disabled={loading}
                  placeholder={placeholder}
                  autoComplete={autoComplete}
                  aria-label={label ?? placeholder ?? "Password"}
                  aria-invalid={fieldState.invalid}
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
            {showForgotPasswordLink && (
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
