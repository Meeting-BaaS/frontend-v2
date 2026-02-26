"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { Form } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { FormFields } from "@/components/alerts/form-fields";
import { axiosPutInstance } from "@/lib/api-client";
import { UPDATE_ALERT_RULE } from "@/lib/api-routes";
import { genericError } from "@/lib/errors";
import {
  type AlertRule,
  type AlertRuleFormData,
  alertRuleFormSchema,
  ruleToFormDefaults,
  transformFormToApiPayload,
} from "@/lib/schemas/alerts";

interface EditAlertRuleDialogProps {
  open: boolean;
  alertRule: AlertRule;
  onOpenChange: (open: boolean) => void;
}

export function EditAlertRuleDialog({
  open,
  onOpenChange,
  alertRule,
}: EditAlertRuleDialogProps) {
  const router = useRouter();
  const defaults = ruleToFormDefaults(alertRule);

  const form = useForm<AlertRuleFormData>({
    resolver: zodResolver(alertRuleFormSchema),
    defaultValues: defaults,
  });
  const [loading, setLoading] = useState(false);

  const isDirty = form.formState.isDirty;

  const onSubmit = async (data: AlertRuleFormData) => {
    if (loading) return;

    try {
      setLoading(true);
      const payload = transformFormToApiPayload(data, alertRule.id);

      await axiosPutInstance<Record<string, unknown>, null>(
        UPDATE_ALERT_RULE,
        payload,
      );

      router.refresh();
      onOpenChange(false);
      form.reset(data);
      toast.success("Alert rule updated successfully");
    } catch (error) {
      console.error("Error updating alert rule", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  const onCancel = (updatedOpen: boolean) => {
    if (updatedOpen || loading) return;
    form.reset();
    onOpenChange(updatedOpen);
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent
        className="sm:max-w-lg max-h-[85vh] overflow-y-auto"
        showCloseButton={!loading}
      >
        <DialogHeader>
          <DialogTitle>Edit Alert Rule</DialogTitle>
          <DialogDescription>
            Update the alert rule configuration.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormFields loading={loading} isEditing />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={loading || !isDirty}
                aria-busy={loading}
                aria-disabled={loading}
                aria-label={loading ? "Updating" : "Update"}
              >
                {loading ? (
                  <>
                    <Spinner /> Updating
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
