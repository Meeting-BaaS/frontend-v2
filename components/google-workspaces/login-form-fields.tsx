"use client"

import { useFormContext } from "react-hook-form"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field"
import { FormControl, FormField } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { CreateMeetLoginForm, UpdateMeetLoginForm } from "@/lib/schemas/meet-logins"

interface LoginFormFieldsProps {
  loading: boolean
  mode?: "create" | "edit"
  workspaceDomain?: string
}

export function LoginFormFields({
  loading,
  mode = "create",
  workspaceDomain
}: LoginFormFieldsProps) {
  const form = useFormContext<CreateMeetLoginForm | UpdateMeetLoginForm>()
  const isEdit = mode === "edit"

  return (
    <FieldGroup>
      <FormField
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              Name{isEdit && <span className="text-muted-foreground font-normal"> (optional)</span>}
            </FieldLabel>
            <FieldContent>
              <FormControl>
                <Input
                  {...field}
                  id={field.name}
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                  placeholder={isEdit ? "Leave blank to keep current" : "Bot 1"}
                  aria-label="Login name"
                  maxLength={100}
                  disabled={loading}
                />
              </FormControl>
              <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
            </FieldContent>
          </Field>
        )}
      />

      {!isEdit && (
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <FieldContent>
                <FormControl>
                  <Input
                    {...field}
                    id={field.name}
                    type="email"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                    placeholder={
                      workspaceDomain ? `bot1@${workspaceDomain}` : "bot1@bots.customer.com"
                    }
                    aria-label="Workspace user email"
                    maxLength={254}
                    disabled={loading}
                    className="font-mono"
                  />
                </FormControl>
                <FieldDescription>
                  {workspaceDomain
                    ? `Domain must match (or be a subdomain of) ${workspaceDomain}.`
                    : "Domain must match the parent workspace's domain."}
                </FieldDescription>
                <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
              </FieldContent>
            </Field>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="email_group"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              Email Group <span className="text-muted-foreground font-normal">(optional)</span>
            </FieldLabel>
            <FieldContent>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  id={field.name}
                  type="email"
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                  placeholder={
                    workspaceDomain ? `bots@${workspaceDomain}` : "bots@bots.customer.com"
                  }
                  aria-label="Email group for round-robin pooling"
                  maxLength={254}
                  disabled={loading}
                  className="font-mono"
                />
              </FormControl>
              <FieldDescription>
                Google Group address used for round-robin pooling. Put this on calendar invites so
                the bot lands in Meet&apos;s verified queue.
                {isEdit && " Leave blank to clear."}
              </FieldDescription>
              <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
            </FieldContent>
          </Field>
        )}
      />
    </FieldGroup>
  )
}
