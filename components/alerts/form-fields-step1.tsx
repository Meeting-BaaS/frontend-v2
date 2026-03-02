"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  ALERT_TYPE_LABELS,
  type CreateAlertRuleStep1Data,
  createAlertRuleStep1Schema,
  getAlertCategory,
  OPERATIONAL_ALERT_TYPES,
  OPERATOR_LABELS,
  STRIPE_ALERT_TYPES
} from "@/lib/schemas/alerts"

interface FormFieldsStep1Props {
  loading: boolean
  defaultValues?: Partial<CreateAlertRuleStep1Data>
  allowedAlertTypes: string[]
  onNext: (data: CreateAlertRuleStep1Data) => void
}

export function FormFieldsStep1({
  loading,
  defaultValues,
  allowedAlertTypes,
  onNext
}: FormFieldsStep1Props) {
  const form = useForm<CreateAlertRuleStep1Data>({
    resolver: zodResolver(createAlertRuleStep1Schema),
    defaultValues: {
      name: "",
      alertType: undefined,
      operator: undefined,
      value: 0,
      ...defaultValues
    }
  })

  const watchedAlertType = form.watch("alertType")
  const isOperational = watchedAlertType
    ? getAlertCategory(watchedAlertType) === "operational"
    : false

  // When switching to an operational type, lock operator to gte and enforce min value
  useEffect(() => {
    if (isOperational) {
      // Trigger validation on operator to clear any existing errors
      // This is necessary because the operator is locked to gte for operational alerts
      form.setValue("operator", "gte", { shouldValidate: true })
      const currentValue = form.getValues("value")
      if (currentValue < 1) {
        form.setValue("value", 1, { shouldValidate: true })
      }
    }
  }, [isOperational, form])

  const thresholdTypes = STRIPE_ALERT_TYPES.filter((t) => allowedAlertTypes.includes(t))
  const operationalTypes = OPERATIONAL_ALERT_TYPES.filter((t) => allowedAlertTypes.includes(t))

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6" noValidate>
        <FieldGroup className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-2">
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <FieldContent>
                  <FormControl>
                    <Input
                      {...field}
                      id={field.name}
                      autoComplete="off"
                      aria-invalid={fieldState.invalid}
                      placeholder="My Alert Rule"
                      maxLength={255}
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
            name="alertType"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-2 md:col-span-1">
                <FieldLabel htmlFor={field.name}>Metric</FieldLabel>
                <FieldContent>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange} disabled={loading}>
                      <SelectTrigger className="w-full" id={field.name}>
                        <SelectValue placeholder="Select metric..." />
                      </SelectTrigger>
                      <SelectContent>
                        {thresholdTypes.length > 0 && (
                          <SelectGroup>
                            <SelectLabel>Threshold</SelectLabel>
                            {thresholdTypes.map((key) => (
                              <SelectItem key={key} value={key}>
                                {ALERT_TYPE_LABELS[key]}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        )}
                        {thresholdTypes.length > 0 && operationalTypes.length > 0 && (
                          <SelectSeparator />
                        )}
                        {operationalTypes.length > 0 && (
                          <SelectGroup>
                            <SelectLabel>Operational</SelectLabel>
                            {operationalTypes.map((key) => (
                              <SelectItem key={key} value={key}>
                                {ALERT_TYPE_LABELS[key]}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                </FieldContent>
              </Field>
            )}
          />

          <FormField
            control={form.control}
            name="operator"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-2 md:col-span-1">
                <FieldLabel htmlFor={field.name}>Operator</FieldLabel>
                <FieldContent>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={loading || isOperational}
                    >
                      <SelectTrigger className="w-full" id={field.name}>
                        <SelectValue placeholder="Select operator..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(OPERATOR_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label} (
                            {key === "gte" ? "greater than or equal" : "less than or equal"})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                </FieldContent>
              </Field>
            )}
          />

          <FormField
            control={form.control}
            name="value"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-2">
                <FieldLabel htmlFor={field.name}>
                  {isOperational ? "Occurrence Threshold" : "Threshold Value"}
                </FieldLabel>
                <FieldContent>
                  <FormControl>
                    <Input
                      {...field}
                      id={field.name}
                      type="number"
                      min={isOperational ? 1 : 0}
                      aria-invalid={fieldState.invalid}
                      placeholder={isOperational ? "1" : "0"}
                      disabled={loading}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  {isOperational && (
                    <FieldDescription>
                      Alert when this event occurs &gt;= N times within the cooldown window.
                    </FieldDescription>
                  )}
                  <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                </FieldContent>
              </Field>
            )}
          />
        </FieldGroup>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={loading}>
            <ArrowRight /> Next
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
