"use client"

import { useFormContext, useWatch } from "react-hook-form"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import type { CreateMeetWorkspaceForm } from "@/lib/schemas/meet-workspaces"

interface CreateWorkspaceFormFieldsProps {
  loading: boolean
}

export function CreateWorkspaceFormFields({ loading }: CreateWorkspaceFormFieldsProps) {
  const form = useFormContext<CreateMeetWorkspaceForm>()
  const generateKeypair = useWatch({ control: form.control, name: "generate_keypair" })

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
                  placeholder="Production Workspace"
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
                  placeholder="bots.customer.com"
                  aria-label="Workspace domain"
                  maxLength={253}
                  disabled={loading}
                />
              </FormControl>
              <FieldDescription>
                The Google Workspace domain (or subdomain) where the Legacy SSO profile is
                configured.
              </FieldDescription>
              <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
            </FieldContent>
          </Field>
        )}
      />

      <FormField
        control={form.control}
        name="generate_keypair"
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor={field.name}>Keypair</FieldLabel>
            <FieldContent>
              <FormControl>
                <RadioGroup
                  value={field.value ? "generate" : "byo"}
                  onValueChange={(value) => field.onChange(value === "generate")}
                  disabled={loading}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="generate" id="generate-keypair" />
                    <FieldLabel htmlFor="generate-keypair" className="font-normal cursor-pointer">
                      Generate a self-signed keypair (recommended)
                    </FieldLabel>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="byo" id="byo-keypair" />
                    <FieldLabel htmlFor="byo-keypair" className="font-normal cursor-pointer">
                      Bring your own certificate and private key
                    </FieldLabel>
                  </div>
                </RadioGroup>
              </FormControl>
              <FieldDescription>
                The certificate will be returned after creation so you can upload it to Google Admin
                Console.
              </FieldDescription>
            </FieldContent>
          </Field>
        )}
      />

      {!generateKeypair && (
        <>
          <FormField
            control={form.control}
            name="cert_pem"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Certificate (PEM)</FieldLabel>
                <FieldContent>
                  <FormControl>
                    <Textarea
                      {...field}
                      id={field.name}
                      rows={6}
                      aria-invalid={fieldState.invalid}
                      placeholder="-----BEGIN CERTIFICATE-----..."
                      aria-label="Certificate PEM"
                      disabled={loading}
                      className="font-mono text-xs"
                    />
                  </FormControl>
                  <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                </FieldContent>
              </Field>
            )}
          />

          <FormField
            control={form.control}
            name="private_key_pem"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Private Key (PEM)</FieldLabel>
                <FieldContent>
                  <FormControl>
                    <Textarea
                      {...field}
                      id={field.name}
                      rows={6}
                      aria-invalid={fieldState.invalid}
                      placeholder="-----BEGIN PRIVATE KEY-----..."
                      aria-label="Private key PEM"
                      disabled={loading}
                      className="font-mono text-xs"
                    />
                  </FormControl>
                  <FieldDescription>
                    Never echoed back in any response. Stored encrypted at rest.
                  </FieldDescription>
                  <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                </FieldContent>
              </Field>
            )}
          />
        </>
      )}
    </FieldGroup>
  )
}
