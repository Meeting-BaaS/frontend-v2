"use client"

import { ExternalLink, Info } from "lucide-react"
import Link from "next/link"
import { useFormContext, useWatch } from "react-hook-form"
import { PasswordField } from "@/components/auth/password-field"
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
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ZOOM_OBF_TOKEN_BLOG_URL } from "@/lib/external-urls"
import type { CreateZoomCredentialForm, UpdateZoomCredentialForm } from "@/lib/schemas/credentials"

interface FormFieldsProps {
  loading: boolean
  mode?: "create" | "edit"
}

export function FormFields({ loading, mode = "create" }: FormFieldsProps) {
  const form = useFormContext<CreateZoomCredentialForm | UpdateZoomCredentialForm>()
  const includeUserAuth = useWatch({
    control: form.control,
    name: "include_user_auth" as keyof CreateZoomCredentialForm
  })

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
                  placeholder={isEdit ? "Leave blank to keep current" : "My Zoom Credential"}
                  aria-label="Credential name"
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
        name="client_id"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name} className="flex items-center gap-2">
              Client ID
              {isEdit && <span className="text-muted-foreground font-normal"> (optional)</span>}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">
                      The Client ID from your Zoom OAuth App or Server-to-Server App.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FieldLabel>
            <FieldContent>
              <FormControl>
                <Input
                  {...field}
                  id={field.name}
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                  placeholder={isEdit ? "Leave blank to keep current" : "Enter your Zoom Client ID"}
                  aria-label="Zoom Client ID"
                  disabled={loading}
                />
              </FormControl>
              <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
            </FieldContent>
          </Field>
        )}
      />

      <PasswordField
        name="client_secret"
        loading={loading}
        placeholder={isEdit ? "Leave blank to keep current" : "Enter your Zoom Client Secret"}
        ariaLabel="Zoom Client Secret"
        autoComplete="off"
        label={
          <FieldLabel htmlFor="client_secret" className="flex items-center gap-2">
            Client Secret
            {isEdit && <span className="text-muted-foreground font-normal"> (optional)</span>}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">
                    The Client Secret from your Zoom OAuth App or Server-to-Server App.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FieldLabel>
        }
      />

      {/* Only show include_user_auth toggle in create mode */}
      {!isEdit && (
        <FormField
          control={form.control}
          name="include_user_auth"
          render={({ field }) => (
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor={field.name} className="flex items-center gap-2">
                  Include User Authorization
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">
                          Enable this to authorize a specific Zoom user. This requires an OAuth
                          authorization code obtained after the user grants permission.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FieldLabel>
                <FormControl>
                  <Switch
                    id={field.name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={loading}
                    aria-label="Include user authorization"
                  />
                </FormControl>
              </div>
              <FieldDescription>
                Required for on-behalf-of (OBF) token support in Zoom meetings.{" "}
                <Link
                  href={ZOOM_OBF_TOKEN_BLOG_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  Learn more <ExternalLink className="h-3 w-3" />
                </Link>
              </FieldDescription>
            </Field>
          )}
        />
      )}

      {/* Show auth fields in create mode when toggled, or always in edit mode */}
      {((!isEdit && includeUserAuth) || isEdit) && (
        <>
          <FormField
            control={form.control}
            name="authorization_code"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Authorization Code
                  {isEdit && <span className="text-muted-foreground font-normal"> (optional)</span>}
                </FieldLabel>
                <FieldContent>
                  <FormControl>
                    <Input
                      {...field}
                      id={field.name}
                      autoComplete="off"
                      aria-invalid={fieldState.invalid}
                      placeholder={
                        isEdit
                          ? "Leave blank to keep current tokens"
                          : "Enter the OAuth authorization code"
                      }
                      aria-label="OAuth authorization code"
                      disabled={loading}
                    />
                  </FormControl>
                  <FieldDescription>
                    {isEdit
                      ? "Provide a new authorization code to refresh OAuth tokens."
                      : "The authorization code received after user grants permission."}
                  </FieldDescription>
                  <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                </FieldContent>
              </Field>
            )}
          />

          <FormField
            control={form.control}
            name="redirect_uri"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Redirect URI
                  {isEdit && <span className="text-muted-foreground font-normal"> (optional)</span>}
                </FieldLabel>
                <FieldContent>
                  <FormControl>
                    <Input
                      {...field}
                      id={field.name}
                      type="url"
                      autoComplete="off"
                      aria-invalid={fieldState.invalid}
                      placeholder="https://your-app.com/oauth/callback"
                      aria-label="OAuth redirect URI"
                      disabled={loading}
                    />
                  </FormControl>
                  <FieldDescription>
                    {isEdit
                      ? "Required when providing a new authorization code."
                      : "The redirect URI configured in your Zoom OAuth App."}
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
