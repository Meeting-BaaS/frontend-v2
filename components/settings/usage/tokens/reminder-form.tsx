"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ControllerRenderProps } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { axiosPatchInstance } from "@/lib/api-client";
import { UPDATE_REMINDER_SETTINGS } from "@/lib/api-routes";
import { genericError } from "@/lib/errors";
import type { UsageStats } from "@/lib/schemas/settings";
import {
  type UpdateReminderSettings,
  updateReminderSettingsSchema,
} from "@/lib/schemas/settings";
import { cn } from "@/lib/utils";

interface ReminderFormProps {
  usageStats: UsageStats;
  userEmail: string;
  onClose: () => void;
}

export function ReminderForm({
  usageStats,
  userEmail,
  onClose,
}: ReminderFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<UpdateReminderSettings>({
    resolver: zodResolver(updateReminderSettingsSchema),
    defaultValues: {
      enabled: usageStats.plan.reminderEnabled ?? false,
      threshold: usageStats.plan.reminderThreshold ?? 0,
      email: usageStats.plan.reminderEmail ?? userEmail,
    },
  });

  const {
    reset,
    watch,
    formState: { isDirty },
  } = form;
  const enabled = watch("enabled");

  useEffect(() => {
    if (!enabled) {
      reset({ enabled: false });
    }
  }, [enabled, reset]);

  const disabledFieldClasses = cn(
    "transition-opacity",
    enabled
      ? "opacity-100 pointer-events-auto"
      : "opacity-30 pointer-events-none",
  );

  const onSubmit = async (data: UpdateReminderSettings) => {
    if (loading) return;
    setLoading(true);
    try {
      await axiosPatchInstance<UpdateReminderSettings, null>(
        UPDATE_REMINDER_SETTINGS,
        data,
        undefined, // No response schema expected (204 response)
      );
      toast.success("Reminder settings updated successfully");
      onClose();
      // Refresh the page to get updated stats
      router.refresh();
    } catch (error) {
      console.error("Error updating reminder settings", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FieldGroup>
          <Controller
            name="enabled"
            control={form.control}
            render={({
              field,
              fieldState,
            }: {
              field: ControllerRenderProps<UpdateReminderSettings, "enabled">;
              fieldState: {
                invalid: boolean;
                error?: { message?: string };
              };
            }) => (
              <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="reminder-enabled">
                    Enable Email Reminders
                  </FieldLabel>
                  <FieldDescription>
                    Receive email notifications when your token balance drops
                    below the threshold.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
                <Switch
                  id="reminder-enabled"
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                />
              </Field>
            )}
          />
        </FieldGroup>

        <FormField
          control={form.control}
          name="threshold"
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className={disabledFieldClasses}
            >
              <FieldLabel htmlFor={field.name}>Threshold</FieldLabel>
              <FieldContent>
                <FormControl>
                  <Input
                    id={field.name}
                    type="number"
                    aria-invalid={fieldState.invalid}
                    disabled={!enabled}
                    onChange={(e) =>
                      field.onChange(Number.parseInt(e.target.value, 10))
                    }
                    value={enabled ? field.value || "" : ""}
                  />
                </FormControl>
                <FieldError
                  errors={fieldState.error ? [fieldState.error] : undefined}
                />
                <p className="text-xs text-muted-foreground">
                  Receive reminders when tokens fall below this threshold.
                </p>
              </FieldContent>
            </Field>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className={disabledFieldClasses}
            >
              <FieldLabel htmlFor={field.name}>Reminder Email</FieldLabel>
              <FieldContent>
                <FormControl>
                  <Input
                    id={field.name}
                    type="email"
                    placeholder="email@example.com"
                    autoComplete="email"
                    aria-invalid={fieldState.invalid}
                    disabled={!enabled}
                    {...field}
                    value={enabled ? field.value || "" : ""}
                  />
                </FormControl>
                <FieldError
                  errors={fieldState.error ? [fieldState.error] : undefined}
                />
                <p className="text-xs text-muted-foreground">
                  Email address to receive token balance reminders.
                </p>
              </FieldContent>
            </Field>
          )}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || !isDirty}>
            {loading ? (
              <>
                <Spinner className="size-4" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
