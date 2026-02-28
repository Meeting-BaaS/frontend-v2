"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Plus, SendHorizontal, X } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field"
import { Form, FormControl, FormField } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  type CreateAlertRuleStep2Data,
  createAlertRuleStep2Schema
} from "@/lib/schemas/alerts"

interface FormFieldsStep2Props {
  loading: boolean
  defaultValues?: Partial<CreateAlertRuleStep2Data>
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
  const [emailInput, setEmailInput] = useState("")

  const form = useForm<CreateAlertRuleStep2Data>({
    resolver: zodResolver(createAlertRuleStep2Schema),
    defaultValues: {
      emailRecipients: [],
      callbackUrl: "",
      callbackSecret: "",
      cooldownMinutes: 15,
      ...defaultValues
    }
  })

  const addEmail = () => {
    const email = emailInput.trim()
    if (!email) return

    const currentRecipients: string[] = form.getValues("emailRecipients") || []
    if (currentRecipients.includes(email)) {
      setEmailInput("")
      return
    }
    if (currentRecipients.length >= 10) return

    form.setValue("emailRecipients", [...currentRecipients, email])
    setEmailInput("")
  }

  const removeEmail = (email: string) => {
    const currentRecipients: string[] = form.getValues("emailRecipients") || []
    form.setValue(
      "emailRecipients",
      currentRecipients.filter((r) => r !== email)
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FieldGroup>
          <FormField
            control={form.control}
            name="emailRecipients"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Email Recipients (optional)</FieldLabel>
                <FieldContent>
                  <div className="flex gap-2">
                    <Input
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="user@example.com"
                      type="email"
                      disabled={loading}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addEmail()
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addEmail}
                      disabled={loading}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {field.value && field.value.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {field.value.map((email: string) => (
                        <Badge key={email} variant="secondary" className="flex items-center gap-1">
                          {email}
                          <button
                            type="button"
                            onClick={() => removeEmail(email)}
                            className="hover:text-destructive"
                            disabled={loading}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
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
                <FieldLabel htmlFor={field.name}>Callback Secret (optional)</FieldLabel>
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
                <FieldLabel htmlFor={field.name}>Cooldown (minutes)</FieldLabel>
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
