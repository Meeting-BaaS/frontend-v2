"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Info, Plus, SendHorizontal, X } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import { PasswordField } from "@/components/auth/password-field"
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  type CreateAlertRuleStep2Data,
  createAlertRuleStep2Schema,
  MAX_ALERT_EMAIL_RECIPIENTS
} from "@/lib/schemas/alerts"

interface FormFieldsStep2Props {
  loading: boolean
  defaultValues?: {
    emailRecipients?: string[]
    callbackUrl?: string
    callbackSecret?: string
    cooldownMinutes?: number
  }
  isOperational?: boolean
  submitLabel: string
  loadingLabel: string
  onBack: () => void
  onSubmit: (data: CreateAlertRuleStep2Data) => void
}

export function FormFieldsStep2({
  loading,
  defaultValues,
  isOperational,
  submitLabel,
  loadingLabel,
  onBack,
  onSubmit
}: FormFieldsStep2Props) {
  const form = useForm({
    resolver: zodResolver(createAlertRuleStep2Schema),
    defaultValues: {
      emailRecipients: (defaultValues?.emailRecipients ?? []).map((e) => ({ value: e })),
      callbackUrl: defaultValues?.callbackUrl ?? "",
      callbackSecret: defaultValues?.callbackSecret ?? "",
      cooldownMinutes: defaultValues?.cooldownMinutes ?? 15
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "emailRecipients"
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="min-h-0 overflow-y-auto max-h-[min(50vh,28rem)] -mx-6 px-6">
          <FieldGroup className="grid grid-cols-2 gap-4">
            <Field className="col-span-2">
              <FieldLabel>Email Recipients (optional)</FieldLabel>
              <FieldContent className="space-y-2">
                {fields.map((item, index) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name={`emailRecipients.${index}.value`}
                    render={({ field, fieldState }) => (
                      <div>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="user@example.com"
                              autoComplete="off"
                              disabled={loading}
                              data-invalid={fieldState.invalid}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => remove(index)}
                            disabled={loading}
                            aria-label="Remove email"
                          >
                            <X />
                          </Button>
                        </div>
                        <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                      </div>
                    )}
                  />
                ))}
                {fields.length < MAX_ALERT_EMAIL_RECIPIENTS && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ value: "" })}
                    disabled={loading}
                  >
                    <Plus /> Add Recipient
                  </Button>
                )}
                {form.formState.errors.emailRecipients?.root && (
                  <FieldError errors={[form.formState.errors.emailRecipients.root]} />
                )}
              </FieldContent>
            </Field>

            <FormField
              control={form.control}
              name="callbackUrl"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="col-span-2">
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

            <PasswordField
              loading={loading}
              containerClassName="col-span-2"
              name="callbackSecret"
              label={
                <FieldLabel htmlFor="callbackSecret">
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
                          header with this value so your backend can verify the request is
                          authentic.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FieldLabel>
              }
              ariaLabel="Callback Secret (optional)"
              placeholder="Optional signing secret"
              autoComplete="off"
              showForgotPasswordLink={false}
            />

            <FormField
              control={form.control}
              name="cooldownMinutes"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="col-span-2">
                  <FieldLabel htmlFor={field.name}>
                    {isOperational ? "Cooldown / Accumulation Window" : "Cooldown"}{" "}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm max-w-xs">
                            {isOperational
                              ? "Events are counted within this window. After the alert fires, it enters cooldown - further events are suppressed and counted for the next notification."
                              : "After an alert fires, it will be suppressed for this duration. Suppressed alerts are counted and included in the next notification."}
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
        </div>

        <DialogFooter className="shrink-0">
          <Button type="button" variant="outline" onClick={onBack} disabled={loading}>
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
