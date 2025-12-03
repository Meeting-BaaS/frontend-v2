"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PasswordField } from "@/components/auth/password-field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/hooks/use-user";
import { authClient } from "@/lib/auth-client";
import { genericError } from "@/lib/errors";
import type { ChangePasswordFormData } from "@/lib/schemas/account";
import { changePasswordFormSchema } from "@/lib/schemas/account";

interface ChangePasswordFormProps {
  hasCredentialAccount: boolean;
}

export function ChangePasswordForm({
  hasCredentialAccount,
}: ChangePasswordFormProps) {
  const { user } = useUser();
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      revokeOtherSessions: false,
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    if (isChangingPassword) return;

    try {
      setIsChangingPassword(true);

      const { error } = await authClient.changePassword({
        newPassword: data.newPassword,
        currentPassword: data.currentPassword,
        revokeOtherSessions: data.revokeOtherSessions,
      });

      if (error) {
        toast.error(error.message || genericError);
        return;
      }

      // Reset form on success
      form.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        revokeOtherSessions: false,
      });

      toast.success("Password changed successfully");
    } catch (error) {
      console.error("Error changing password", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!hasCredentialAccount) {
    return null;
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full md:!w-1/2 lg:!w-2/5"
        >
          {/* Hidden email input for browser autofill detection */}
          <Input
            type="email"
            value={user.email}
            autoComplete="email"
            className="hidden"
            readOnly
          />
          <PasswordField
            loading={isChangingPassword}
            name="currentPassword"
            label="Current Password"
            autoComplete="current-password"
          />
          <PasswordField
            loading={isChangingPassword}
            name="newPassword"
            label="New Password"
            autoComplete="new-password"
          />
          <PasswordField
            loading={isChangingPassword}
            name="confirmPassword"
            label="Confirm New Password"
            autoComplete="new-password"
          />
          <FieldGroup>
            <FormField
              control={form.control}
              name="revokeOtherSessions"
              render={({ field, fieldState }) => (
                <FieldGroup data-slot="checkbox-group">
                  <Field
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                  >
                    <Checkbox
                      id="revokeOtherSessions"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isChangingPassword}
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldLabel htmlFor="revokeOtherSessions">
                      Log out of all other sessions
                    </FieldLabel>
                  </Field>
                  {fieldState.invalid && (
                    <FieldError
                      className="text-start"
                      errors={fieldState.error ? [fieldState.error] : undefined}
                    />
                  )}
                </FieldGroup>
              )}
            />
          </FieldGroup>
          <Button
            type="submit"
            size="sm"
            disabled={isChangingPassword}
            className="w-full sm:w-fit"
          >
            {isChangingPassword ? (
              <>
                <Spinner /> Changing password...
              </>
            ) : (
              "Change Password"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
