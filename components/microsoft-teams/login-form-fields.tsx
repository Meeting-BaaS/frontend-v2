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
import type { CreateTeamsLoginForm, UpdateTeamsLoginForm } from "@/lib/schemas/teams-logins"

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
  const form = useFormContext<CreateTeamsLoginForm | UpdateTeamsLoginForm>()
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
                  aria-label="Account name"
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
                      workspaceDomain ? `bot1@${workspaceDomain}` : "bot1@contoso.onmicrosoft.com"
                    }
                    aria-label="Microsoft 365 account email"
                    maxLength={254}
                    disabled={loading}
                    className="font-mono"
                  />
                </FormControl>
                <FieldDescription>
                  The Microsoft 365 account the bot signs in as. Any account in this
                  workspace&apos;s tenant works — the bot verifies it at sign-in.
                </FieldDescription>
                <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
              </FieldContent>
            </Field>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="password"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              Password
              {isEdit && <span className="text-muted-foreground font-normal"> (optional)</span>}
            </FieldLabel>
            <FieldContent>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  id={field.name}
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                  placeholder={isEdit ? "Leave blank to keep current" : "••••••••"}
                  aria-label="Microsoft 365 account password"
                  maxLength={1024}
                  disabled={loading}
                />
              </FormControl>
              <FieldDescription>
                Encrypted at rest and never shown again. The account must be exempt from MFA and
                captcha for the bot to sign in unattended.
                {isEdit && " Leave blank to keep the current password."}
              </FieldDescription>
              <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
            </FieldContent>
          </Field>
        )}
      />

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
                    workspaceDomain ? `bots@${workspaceDomain}` : "bots@contoso.onmicrosoft.com"
                  }
                  aria-label="Email group for round-robin pooling"
                  maxLength={254}
                  disabled={loading}
                  className="font-mono"
                />
              </FormControl>
              <FieldDescription>
                Address used to pool accounts for round-robin assignment. Accounts sharing an email
                group form one pool.
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
