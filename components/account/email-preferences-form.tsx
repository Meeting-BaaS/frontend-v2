"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { boolean, object, type output } from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { axiosPostInstance } from "@/lib/api-client";
import { UPDATE_EMAIL_PREFERENCES } from "@/lib/api-routes";
import { genericError } from "@/lib/errors";
import type { EmailPreference } from "@/lib/schemas/account";
import { updateEmailPreferencesResponseSchema } from "@/lib/schemas/account";

const emailPreferencesFormSchema = object({
  // Critical alerts (default: on)
  alertUsageLimits: boolean(),
  alertBotFailures: boolean(),
  alertCalendarSync: boolean(),
  // Threshold warnings — per resource, per threshold (default: off)
  alertWarningDailyCap80: boolean(),
  alertWarningDailyCap90: boolean(),
  alertWarningTokens80: boolean(),
  alertWarningTokens90: boolean(),
  alertWarningCalendarLimit80: boolean(),
});

type EmailPreferencesFormData = output<typeof emailPreferencesFormSchema>;

interface EmailPreferencesFormProps {
  initialPreferences: EmailPreference[];
}

// Critical alert preferences default to opted-in (true) when no preference exists
const CRITICAL_ALERT_KEYS = [
  "alertUsageLimits",
  "alertBotFailures",
  "alertCalendarSync",
] as const;

export function EmailPreferencesForm({
  initialPreferences,
}: EmailPreferencesFormProps) {
  const getDefaultValue = (emailType: string): boolean => {
    const pref = initialPreferences.find((p) => p.emailType === emailType);
    if (pref) return pref.subscribed;
    // Critical alerts default to ON, warning thresholds default to OFF
    if (
      CRITICAL_ALERT_KEYS.includes(
        emailType as (typeof CRITICAL_ALERT_KEYS)[number],
      )
    )
      return true;
    return false;
  };

  const form = useForm<EmailPreferencesFormData>({
    resolver: zodResolver(emailPreferencesFormSchema),
    defaultValues: {
      alertUsageLimits: getDefaultValue("alertUsageLimits"),
      alertBotFailures: getDefaultValue("alertBotFailures"),
      alertCalendarSync: getDefaultValue("alertCalendarSync"),
      alertWarningDailyCap80: getDefaultValue("alertWarningDailyCap80"),
      alertWarningDailyCap90: getDefaultValue("alertWarningDailyCap90"),
      alertWarningTokens80: getDefaultValue("alertWarningTokens80"),
      alertWarningTokens90: getDefaultValue("alertWarningTokens90"),
      alertWarningCalendarLimit80: getDefaultValue(
        "alertWarningCalendarLimit80",
      ),
    },
  });

  const [isUpdating, setIsUpdating] = useState(false);

  const {
    formState: { isDirty },
  } = form;

  const onSubmit = async (data: EmailPreferencesFormData) => {
    if (isUpdating || !isDirty) return;

    try {
      setIsUpdating(true);

      const apiData = {
        preferences: [
          {
            emailType: "alertUsageLimits" as const,
            subscribed: data.alertUsageLimits,
          },
          {
            emailType: "alertBotFailures" as const,
            subscribed: data.alertBotFailures,
          },
          {
            emailType: "alertCalendarSync" as const,
            subscribed: data.alertCalendarSync,
          },
          {
            emailType: "alertWarningDailyCap80" as const,
            subscribed: data.alertWarningDailyCap80,
          },
          {
            emailType: "alertWarningDailyCap90" as const,
            subscribed: data.alertWarningDailyCap90,
          },
          {
            emailType: "alertWarningTokens80" as const,
            subscribed: data.alertWarningTokens80,
          },
          {
            emailType: "alertWarningTokens90" as const,
            subscribed: data.alertWarningTokens90,
          },
          {
            emailType: "alertWarningCalendarLimit80" as const,
            subscribed: data.alertWarningCalendarLimit80,
          },
        ],
      };

      const response = await axiosPostInstance(
        UPDATE_EMAIL_PREFERENCES,
        apiData,
        updateEmailPreferencesResponseSchema,
      );

      if (!response || !response.success) {
        toast.error(genericError);
        return;
      }

      toast.success("Email preferences updated successfully");
    } catch (error) {
      console.error("Error updating email preferences", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full md:!w-1/2 lg:!w-2/5"
        >
          {/* Critical Alerts */}
          <FieldGroup>
            <Controller
              name="alertUsageLimits"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="email-pref-alert-usage-limits">
                      Usage Limit Alerts
                    </FieldLabel>
                    <FieldDescription>
                      Get notified when the daily bot cap is reached or you run
                      out of tokens (critical alerts).
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                  <Switch
                    id="email-pref-alert-usage-limits"
                    name={field.name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isUpdating}
                    aria-invalid={fieldState.invalid}
                  />
                </Field>
              )}
            />

            <Controller
              name="alertBotFailures"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="email-pref-alert-bot-failures">
                      Bot Failure Alerts
                    </FieldLabel>
                    <FieldDescription>
                      Get notified when a bot fails to join or complete a
                      meeting.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                  <Switch
                    id="email-pref-alert-bot-failures"
                    name={field.name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isUpdating}
                    aria-invalid={fieldState.invalid}
                  />
                </Field>
              )}
            />

            <Controller
              name="alertCalendarSync"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="email-pref-alert-calendar-sync">
                      Calendar Sync Alerts
                    </FieldLabel>
                    <FieldDescription>
                      Get notified when a calendar connection fails or needs
                      reconnecting.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                  <Switch
                    id="email-pref-alert-calendar-sync"
                    name={field.name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isUpdating}
                    aria-invalid={fieldState.invalid}
                  />
                </Field>
              )}
            />
          </FieldGroup>

          {/* Usage Warning Thresholds */}
          <div className="space-y-4 border-t pt-4">
            <div>
              <h3 className="text-sm font-medium">
                Usage Warning Thresholds
              </h3>
              <p className="text-sm text-muted-foreground">
                Get early warnings before hitting your limits. Choose which
                resources and thresholds matter to you.
              </p>
            </div>

            {/* Daily Bot Cap */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Daily Bot Cap
              </p>
              <FieldGroup>
                <Controller
                  name="alertWarningDailyCap80"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <FieldContent>
                        <FieldLabel htmlFor="email-pref-warning-daily-cap-80">
                          Warn at 80%
                        </FieldLabel>
                        <FieldDescription>
                          Notified when 80% of your daily bot cap is used.
                        </FieldDescription>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </FieldContent>
                      <Switch
                        id="email-pref-warning-daily-cap-80"
                        name={field.name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isUpdating}
                        aria-invalid={fieldState.invalid}
                      />
                    </Field>
                  )}
                />

                <Controller
                  name="alertWarningDailyCap90"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <FieldContent>
                        <FieldLabel htmlFor="email-pref-warning-daily-cap-90">
                          Warn at 90%
                        </FieldLabel>
                        <FieldDescription>
                          Notified when 90% of your daily bot cap is used.
                        </FieldDescription>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </FieldContent>
                      <Switch
                        id="email-pref-warning-daily-cap-90"
                        name={field.name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isUpdating}
                        aria-invalid={fieldState.invalid}
                      />
                    </Field>
                  )}
                />
              </FieldGroup>
            </div>

            {/* Token Balance */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Token Balance
              </p>
              <FieldGroup>
                <Controller
                  name="alertWarningTokens80"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <FieldContent>
                        <FieldLabel htmlFor="email-pref-warning-tokens-80">
                          Warn at 80%
                        </FieldLabel>
                        <FieldDescription>
                          Notified when 80% of your token balance is used.
                        </FieldDescription>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </FieldContent>
                      <Switch
                        id="email-pref-warning-tokens-80"
                        name={field.name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isUpdating}
                        aria-invalid={fieldState.invalid}
                      />
                    </Field>
                  )}
                />

                <Controller
                  name="alertWarningTokens90"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <FieldContent>
                        <FieldLabel htmlFor="email-pref-warning-tokens-90">
                          Warn at 90%
                        </FieldLabel>
                        <FieldDescription>
                          Notified when 90% of your token balance is used.
                        </FieldDescription>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </FieldContent>
                      <Switch
                        id="email-pref-warning-tokens-90"
                        name={field.name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isUpdating}
                        aria-invalid={fieldState.invalid}
                      />
                    </Field>
                  )}
                />
              </FieldGroup>
            </div>

            {/* Calendar Connections */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Calendar Connections
              </p>
              <FieldGroup>
                <Controller
                  name="alertWarningCalendarLimit80"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <FieldContent>
                        <FieldLabel htmlFor="email-pref-warning-calendar-limit-80">
                          Warn at 80%
                        </FieldLabel>
                        <FieldDescription>
                          Notified when 80% of your calendar connection limit is
                          used.
                        </FieldDescription>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </FieldContent>
                      <Switch
                        id="email-pref-warning-calendar-limit-80"
                        name={field.name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isUpdating}
                        aria-invalid={fieldState.invalid}
                      />
                    </Field>
                  )}
                />
              </FieldGroup>
            </div>
          </div>

          <Button
            variant="primary"
            type="submit"
            size="sm"
            disabled={isUpdating || !isDirty}
            className="w-full sm:w-fit"
          >
            {isUpdating ? (
              <>
                <Spinner /> Updating...
              </>
            ) : (
              "Update Preferences"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
