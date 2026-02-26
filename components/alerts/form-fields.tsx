"use client";

import { useFormContext } from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  THRESHOLD_RESOURCES,
  THRESHOLD_RESOURCE_LABELS,
  THRESHOLD_OPERATORS,
  THRESHOLD_OPERATOR_FULL_LABELS,
  ALERT_EVENT_TYPES,
  ALERT_EVENT_TYPE_LABELS,
} from "@/lib/schemas/alerts";
import { useConfiguration } from "@/hooks/use-configuration";

interface FormFieldsProps {
  loading: boolean;
  isEditing?: boolean;
  hideTypeField?: boolean;
}

export function FormFields({ loading, isEditing, hideTypeField }: FormFieldsProps) {
  const form = useFormContext();
  const watchedType = form.watch("type");
  const { configuration } = useConfiguration();
  const isSelfHosted = configuration?.selfHosted ?? false;
  const isStripeEnabled = configuration?.features?.stripe ?? false;

  return (
    <FieldGroup>
      {/* Name */}
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
                  placeholder="My Alert Rule"
                  maxLength={255}
                  disabled={loading}
                />
              </FormControl>
              <FieldError
                errors={fieldState.error ? [fieldState.error] : undefined}
              />
            </FieldContent>
          </Field>
        )}
      />

      {/* Type (hidden in step 2 of create wizard, disabled when editing) */}
      {!hideTypeField && (
        <FormField
          control={form.control}
          name="type"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Alert Type</FieldLabel>
              <FieldContent>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={loading || isEditing}
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {!isSelfHosted && isStripeEnabled && (
                        <SelectItem value="threshold">
                          Threshold (usage monitoring)
                        </SelectItem>
                      )}
                      <SelectItem value="event">
                        Event (bot failures, errors)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FieldError
                  errors={fieldState.error ? [fieldState.error] : undefined}
                />
              </FieldContent>
            </Field>
          )}
        />
      )}

      {/* Threshold-specific fields */}
      {watchedType === "threshold" && (
        <>
          <FormField
            control={form.control}
            name="resource"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Resource</FieldLabel>
                <FieldContent>
                  <FormControl>
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      disabled={loading}
                    >
                      <SelectTrigger id={field.name}>
                        <SelectValue placeholder="Select resource..." />
                      </SelectTrigger>
                      <SelectContent>
                        {THRESHOLD_RESOURCES.map((resource) => (
                          <SelectItem key={resource} value={resource}>
                            {THRESHOLD_RESOURCE_LABELS[resource]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FieldError
                    errors={fieldState.error ? [fieldState.error] : undefined}
                  />
                </FieldContent>
              </Field>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="operator"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Operator</FieldLabel>
                  <FieldContent>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={loading}
                      >
                        <SelectTrigger id={field.name}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {THRESHOLD_OPERATORS.map((op) => (
                            <SelectItem key={op} value={op}>
                              {THRESHOLD_OPERATOR_FULL_LABELS[op]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FieldError
                      errors={fieldState.error ? [fieldState.error] : undefined}
                    />
                  </FieldContent>
                </Field>
              )}
            />

            <FormField
              control={form.control}
              name="threshold"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Threshold</FieldLabel>
                  <FieldContent>
                    <FormControl>
                      <Input
                        {...field}
                        id={field.name}
                        type="number"
                        min={0}
                        placeholder="60"
                        aria-invalid={fieldState.invalid}
                        disabled={loading}
                      />
                    </FormControl>
                    <FieldError
                      errors={fieldState.error ? [fieldState.error] : undefined}
                    />
                  </FieldContent>
                </Field>
              )}
            />
          </div>
        </>
      )}

      {/* Event-specific fields */}
      {watchedType === "event" && (
        <FormField
          control={form.control}
          name="eventType"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Event Type</FieldLabel>
              <FieldContent>
                <FormControl>
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    disabled={loading}
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder="Select event type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {ALERT_EVENT_TYPES.map((eventType) => (
                        <SelectItem key={eventType} value={eventType}>
                          {ALERT_EVENT_TYPE_LABELS[eventType]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FieldError
                  errors={fieldState.error ? [fieldState.error] : undefined}
                />
              </FieldContent>
            </Field>
          )}
        />
      )}

      {/* Delivery channels */}
      <div className="space-y-3 pt-2">
        <p className="text-sm font-medium">Delivery Channels</p>

        <FormField
          control={form.control}
          name="emailAddresses"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Email addresses (comma-separated)
              </FieldLabel>
              <FieldContent>
                <FormControl>
                  <Input
                    {...field}
                    id={field.name}
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                    placeholder="alerts@example.com, team@example.com"
                    disabled={loading}
                  />
                </FormControl>
                <FieldError
                  errors={fieldState.error ? [fieldState.error] : undefined}
                />
              </FieldContent>
            </Field>
          )}
        />

        <FormField
          control={form.control}
          name="webhookUrl"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Webhook URL (optional)
              </FieldLabel>
              <FieldContent>
                <FormControl>
                  <Input
                    {...field}
                    id={field.name}
                    type="url"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                    placeholder="https://example.com/webhook"
                    maxLength={2048}
                    disabled={loading}
                  />
                </FormControl>
                <FieldError
                  errors={fieldState.error ? [fieldState.error] : undefined}
                />
              </FieldContent>
            </Field>
          )}
        />

        <FormField
          control={form.control}
          name="webhookSecret"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Webhook secret (optional)
              </FieldLabel>
              <FieldContent>
                <FormControl>
                  <Input
                    {...field}
                    id={field.name}
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                    placeholder="Optional shared secret"
                    maxLength={256}
                    disabled={loading}
                  />
                </FormControl>
                <FieldError
                  errors={fieldState.error ? [fieldState.error] : undefined}
                />
              </FieldContent>
            </Field>
          )}
        />
      </div>

      {/* Cooldown */}
      <FormField
        control={form.control}
        name="cooldownMinutes"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              Cooldown (minutes)
            </FieldLabel>
            <FieldContent>
              <FormControl>
                <Input
                  {...field}
                  id={field.name}
                  type="number"
                  min={1}
                  max={1440}
                  placeholder="60"
                  aria-invalid={fieldState.invalid}
                  disabled={loading}
                />
              </FormControl>
              <p className="text-xs text-muted-foreground mt-1">
                Minimum time between alerts for this rule (1 min to 24 hours)
              </p>
              <FieldError
                errors={fieldState.error ? [fieldState.error] : undefined}
              />
            </FieldContent>
          </Field>
        )}
      />
    </FieldGroup>
  );
}
