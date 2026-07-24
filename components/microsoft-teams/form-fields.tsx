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
import type { CreateTeamsWorkspaceForm } from "@/lib/schemas/teams-workspaces"

interface CreateTeamsWorkspaceFormFieldsProps {
  loading: boolean
}

export function CreateTeamsWorkspaceFormFields({ loading }: CreateTeamsWorkspaceFormFieldsProps) {
  const form = useFormContext<CreateTeamsWorkspaceForm>()

  return (
    <FieldGroup>
      <FormField
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Name</FieldLabel>
            <FieldContent>
              <FormControl>
                <Input
                  {...field}
                  id={field.name}
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                  placeholder="Contoso Production Tenant"
                  aria-label="Workspace name"
                  maxLength={100}
                  disabled={loading}
                />
              </FormControl>
              <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
            </FieldContent>
          </Field>
        )}
      />

      <FormField
        control={form.control}
        name="domain"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Domain</FieldLabel>
            <FieldContent>
              <FormControl>
                <Input
                  {...field}
                  id={field.name}
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                  placeholder="contoso.onmicrosoft.com"
                  aria-label="Microsoft 365 tenant domain"
                  maxLength={253}
                  disabled={loading}
                  className="font-mono"
                />
              </FormControl>
              <FieldDescription>
                The Microsoft 365 tenant&apos;s primary domain (e.g. contoso.onmicrosoft.com).
                Identifies the tenant this workspace represents.
              </FieldDescription>
              <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
            </FieldContent>
          </Field>
        )}
      />
    </FieldGroup>
  )
}
