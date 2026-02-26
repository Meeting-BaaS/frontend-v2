"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, SendHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField } from "@/components/ui/form";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { FormFields } from "@/components/alerts/form-fields";
import { axiosPostInstance } from "@/lib/api-client";
import { CREATE_ALERT_RULE } from "@/lib/api-routes";
import { genericError } from "@/lib/errors";
import {
  type AlertRuleFormData,
  type CreateAlertRuleResponse,
  alertRuleFormSchema,
  createAlertRuleResponseSchema,
  transformFormToApiPayload,
} from "@/lib/schemas/alerts";
import { useConfiguration } from "@/hooks/use-configuration";

interface CreateAlertRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAlertRuleDialog({
  open,
  onOpenChange,
}: CreateAlertRuleDialogProps) {
  const router = useRouter();
  const { configuration } = useConfiguration();
  const isSelfHosted = configuration?.selfHosted ?? false;
  const isStripeEnabled = configuration?.features?.stripe ?? false;

  const form = useForm<AlertRuleFormData>({
    resolver: zodResolver(alertRuleFormSchema),
    defaultValues: {
      name: "",
      type: "",
      resource: undefined,
      operator: "gte",
      threshold: "",
      eventType: undefined,
      emailAddresses: "",
      webhookUrl: "",
      webhookSecret: "",
      cooldownMinutes: "15",
    },
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const watchedType = form.watch("type");
  const canShowThreshold = !isSelfHosted && isStripeEnabled;
  // Skip step 1 when only one type is available
  const hasMultipleTypes = canShowThreshold;

  const handleNext = () => {
    if (!watchedType) {
      form.setError("type", { message: "Please select an alert type" });
      return;
    }
    setStep(2);
  };

  const handleBack = () => {
    if (!hasMultipleTypes) {
      // Nothing to go back to — close dialog
      onCancel(false);
      return;
    }
    setStep(1);
  };

  const onSubmit = async (data: AlertRuleFormData) => {
    if (loading) return;

    try {
      setLoading(true);
      const payload = transformFormToApiPayload(data);

      const response = await axiosPostInstance<
        Record<string, unknown>,
        CreateAlertRuleResponse
      >(CREATE_ALERT_RULE, payload, createAlertRuleResponseSchema);

      if (!response || !response.success) {
        throw new Error("Failed to create alert rule");
      }

      router.push(`/alerts/${response.data.ruleId}`);
      toast.success("Alert rule created successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating alert rule", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  const onCancel = (updatedOpen: boolean) => {
    if (updatedOpen || loading) return;
    form.reset();
    setStep(1);
    onOpenChange(updatedOpen);
  };

  // Auto-select "event" and skip to step 2 when only one type is available
  useEffect(() => {
    if (open && !hasMultipleTypes) {
      form.setValue("type", "event");
      setStep(2);
    }
  }, [open, hasMultipleTypes, form]);

  const effectiveStep = !hasMultipleTypes ? 2 : step;

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent
        className="sm:max-w-lg max-h-[85vh] overflow-y-auto"
        showCloseButton={!loading}
      >
        <DialogHeader>
          <DialogTitle>Create Alert Rule</DialogTitle>
          <DialogDescription>
            {effectiveStep === 1
              ? "Choose the type of alert rule you want to create."
              : "Configure the alert rule details, delivery channels, and cooldown."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {effectiveStep === 1 ? (
              /* Step 1: Type selection (only when multiple types available) */
              <FieldGroup>
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
                          >
                            <SelectTrigger id={field.name}>
                              <SelectValue placeholder="Select type..." />
                            </SelectTrigger>
                            <SelectContent>
                              {canShowThreshold && (
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
                          errors={
                            fieldState.error ? [fieldState.error] : undefined
                          }
                        />
                      </FieldContent>
                    </Field>
                  )}
                />
              </FieldGroup>
            ) : (
              /* Step 2: Full configuration */
              <FormFields loading={loading} hideTypeField={!hasMultipleTypes} />
            )}

            <DialogFooter>
              {effectiveStep === 1 ? (
                <>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="button" onClick={handleNext}>
                    Next <ArrowRight />
                  </Button>
                </>
              ) : (
                <>
                  {hasMultipleTypes ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      disabled={loading}
                    >
                      <ArrowLeft /> Back
                    </Button>
                  ) : (
                    <DialogClose asChild>
                      <Button type="button" variant="outline" disabled={loading}>
                        Cancel
                      </Button>
                    </DialogClose>
                  )}
                  <Button
                    type="submit"
                    disabled={loading}
                    aria-busy={loading}
                    aria-disabled={loading}
                    aria-label={loading ? "Creating" : "Create"}
                  >
                    {loading ? (
                      <>
                        <Spinner /> Creating
                      </>
                    ) : (
                      <>
                        <SendHorizontal />
                        Create
                      </>
                    )}
                  </Button>
                </>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
