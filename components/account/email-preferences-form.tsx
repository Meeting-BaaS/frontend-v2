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

// Note: "apiChanges" and "productUpdates" removed — those are handled by the growth playbook system
const emailPreferencesFormSchema = object({
  alertUsageLimits: boolean(),
  alertBotFailures: boolean(),
  alertCalendarSync: boolean(),
});

type EmailPreferencesFormData = output<typeof emailPreferencesFormSchema>;

interface EmailPreferencesFormProps {
  initialPreferences: EmailPreference[];
}

// Alert preferences default to opted-in (true) when no preference exists
const ALERT_PREF_KEYS = [
  "alertUsageLimits",
  "alertBotFailures",
  "alertCalendarSync",
] as const;

export function EmailPreferencesForm({
  initialPreferences,
}: EmailPreferencesFormProps) {
  const getDefaultValue = (emailType: string): boolean => {
    const pref = initialPreferences.find((p) => p.emailType === emailType);
    if (ALERT_PREF_KEYS.includes(emailType as (typeof ALERT_PREF_KEYS)[number]))
      return pref?.subscribed ?? true;
    return pref?.subscribed ?? false;
  };

  const form = useForm<EmailPreferencesFormData>({
    resolver: zodResolver(emailPreferencesFormSchema),
    defaultValues: {
      alertUsageLimits: getDefaultValue("alertUsageLimits"),
      alertBotFailures: getDefaultValue("alertBotFailures"),
      alertCalendarSync: getDefaultValue("alertCalendarSync"),
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
          className="space-y-4 w-full md:!w-1/2 lg:!w-2/5"
        >
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
                      Get notified when you hit the daily bot cap or run out of
                      tokens.
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
