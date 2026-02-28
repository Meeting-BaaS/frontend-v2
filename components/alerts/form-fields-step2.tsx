"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Info, SendHorizontal } from "lucide-react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field"
import { Form, FormControl, FormField } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import {
  type CreateAlertRuleStep2Data,
  createAlertRuleStep2Schema
} from "@/lib/schemas/alerts"

interface FormFieldsStep2Props {
  loading: boolean
  defaultValues?: {
    emailRecipients?: string[] | string
    callbackUrl?: string
    callbackSecret?: string
    cooldownMinutes?: number
  }
  submitLabel: string
  loadingLabel: string
  onBack: () => void
  onSubmit: (data: CreateAlertRuleStep2Data) => void
}

export function FormFieldsStep2({
  loading,
  defaultValues,
  submitLabel,
  loadingLabel,
  onBack,
  onSubmit
}: FormFieldsStep2Props) {
  // Convert array default to semicolon-separated string for the input
  const emailDefault = Array.isArray(defaultValues?.emailRecipients)
    ? defaultValues.emailRecipients.join("; ")
    : defaultValues?.emailRecipients ?? ""

  const form = useForm({
    resolver: zodResolver(createAlertRuleStep2Schema),
    defaultValues: {
      emailRecipients: emailDefault,
      callbackUrl: defaultValues?.callbackUrl ?? "",
      callbackSecret: defaultValues?.callbackSecret ?? "",
      cooldownMinutes: defaultValues?.cooldownMinutes ?? 15
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FieldGroup>
          <FormField
            control={form.control}
            name="emailRecipients"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email Recipients (optional)</FieldLabel>
                <FieldContent>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value as string}
                      id={field.name}
                      autoComplete="off"
                      placeholder="user@example.com; another@example.com"
                      disabled={loading}
                    />
                  </FormControl>
                  <FieldDescription>
                    Separate multiple emails with a semicolon. Maximum 10 recipients.
                  </FieldDescription>
                  <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                </FieldContent>
              </Field>
            )}
          />

          <FormField
            control={form.control}
            name="callbackUrl"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Callback URL (optional)</FieldLabel>
                <FieldContent>
                  <FormControl>
                    <Input
                      {...field}
                      id={field.name}
                      type="url"
                      placeholder="https://example.com/alert-webhook"
                      maxLength={2048}
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
            name="callbackSecret"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Callback Secret (optional){" "}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm max-w-xs">
                          When set, alert callback requests will include an{" "}
                          <code className="text-xs bg-muted px-1 rounded">x-mb-alert-secret</code>{" "}
                          header with this value so your backend can verify the request is authentic.
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
                      type="password"
                      placeholder="Optional signing secret"
                      maxLength={256}
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
            name="cooldownMinutes"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Cooldown{" "}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm max-w-xs">
                          After an alert fires, it will be suppressed for this duration.
                          Suppressed alerts are counted and included in the next notification.
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
                      type="number"
                      min={1}
                      max={1440}
                      placeholder="15"
                      disabled={loading}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FieldDescription>
                    Minimum 1 minute, maximum 1440 minutes (24 hours). Defaults to 15 minutes.
                  </FieldDescription>
                  <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                </FieldContent>
              </Field>
            )}
          />
        </FieldGroup>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={loading}
          >
            <ArrowLeft /> Back
          </Button>
          <Button type="submit" disabled={loading} aria-busy={loading}>
            {loading ? (
              <>
                <Spinner /> {loadingLabel}
              </>
            ) : (
              <>
                <SendHorizontal /> {submitLabel}
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
