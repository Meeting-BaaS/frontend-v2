"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight } from "lucide-react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Form, FormControl, FormField } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  ALERT_TYPE_LABELS,
  type CreateAlertRuleStep1Data,
  createAlertRuleStep1Schema,
  OPERATOR_LABELS
} from "@/lib/schemas/alerts"

interface FormFieldsStep1Props {
  loading: boolean
  defaultValues?: Partial<CreateAlertRuleStep1Data>
  allowedAlertTypes: string[]
  onNext: (data: CreateAlertRuleStep1Data) => void
}

export function FormFieldsStep1({ loading, defaultValues, allowedAlertTypes, onNext }: FormFieldsStep1Props) {
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
                        {Object.entries(ALERT_TYPE_LABELS)
                          .filter(([key]) => allowedAlertTypes.includes(key))
                          .map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                              {label}
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
            name="operator"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-2 md:col-span-1">
                <FieldLabel htmlFor={field.name}>Operator</FieldLabel>
                <FieldContent>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange} disabled={loading}>
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
                <FieldLabel htmlFor={field.name}>Threshold Value</FieldLabel>
                <FieldContent>
                  <FormControl>
                    <Input
                      {...field}
                      id={field.name}
                      type="number"
                      min={0}
                      aria-invalid={fieldState.invalid}
                      placeholder="0"
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
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit">
            <ArrowRight /> Next
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
