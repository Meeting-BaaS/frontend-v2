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
  apiChanges: boolean(),
  productUpdates: boolean(),
  alertBotFailures: boolean(),
  alertCalendarSync: boolean(),
  alertArtifactsReminder: boolean(),
});

type EmailPreferencesFormData = output<typeof emailPreferencesFormSchema>;

interface EmailPreferencesFormProps {
  initialPreferences: EmailPreference[];
}

// Alert preferences default to opted-in (true) when no preference exists
const ALERT_PREF_KEYS = [
  "alertBotFailures",
  "alertCalendarSync",
  "alertArtifactsReminder",
] as const;

export function EmailPreferencesForm({
  initialPreferences,
}: EmailPreferencesFormProps) {
  const getDefaultValue = (emailType: string): boolean => {
    const pref = initialPreferences.find((p) => p.emailType === emailType);
    // Alert preferences default to subscribed (opted-in)
    if (ALERT_PREF_KEYS.includes(emailType as (typeof ALERT_PREF_KEYS)[number]))
      return pref?.subscribed ?? true;
    return pref?.subscribed ?? false;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- trigger redeploy
  const _redeploy = true;
  const form = useForm<EmailPreferencesFormData>({
    resolver: zodResolver(emailPreferencesFormSchema),
    defaultValues: {
      apiChanges: getDefaultValue("apiChanges"),
      productUpdates: getDefaultValue("productUpdates"),
      alertBotFailures: getDefaultValue("alertBotFailures"),
      alertCalendarSync: getDefaultValue("alertCalendarSync"),
      alertArtifactsReminder: getDefaultValue("alertArtifactsReminder"),
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
            emailType: "apiChanges" as const,
            subscribed: data.apiChanges,
          },
          {
            emailType: "productUpdates" as const,
            subscribed: data.productUpdates,
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
            emailType: "alertArtifactsReminder" as const,
            subscribed: data.alertArtifactsReminder,
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
              name="apiChanges"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="email-pref-api-changes">
                      API changes
                    </FieldLabel>
                    <FieldDescription>
                      Receive email notifications about API changes,
                      deprecations, and updates.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                  <Switch
                    id="email-pref-api-changes"
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
              name="productUpdates"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="email-pref-product-updates">
                      Product Updates
                    </FieldLabel>
                    <FieldDescription>
                      Stay informed about new features, improvements, and
                      product announcements.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                  <Switch
                    id="email-pref-product-updates"
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
                      Get notified when bots fail, hit the daily cap, or run out
                      of tokens.
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

            <Controller
              name="alertArtifactsReminder"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="email-pref-alert-artifacts">
                      Artifacts Reminders
                    </FieldLabel>
                    <FieldDescription>
                      Get reminded when bot recordings or transcripts are ready
                      but haven&apos;t been fetched.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                  <Switch
                    id="email-pref-alert-artifacts"
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
