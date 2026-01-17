"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizontal } from "lucide-react";
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
import { FormFields } from "@/components/webhooks/form-fields";
import { axiosPutInstance } from "@/lib/api-client";
import { UPDATE_WEBHOOK_ENDPOINT } from "@/lib/api-routes";
import { genericError } from "@/lib/errors";
import {
  type UpdateWebhookFormData,
  updateWebhookFormSchema,
  type WebhookEndpointWithSecret,
} from "@/lib/schemas/webhooks";

interface EditWebhookDialogProps {
  open: boolean;
  webhookEndpoint: WebhookEndpointWithSecret;
  onOpenChange: (open: boolean) => void;
  allEventTypes: string[];
}

export function EditWebhookDialog({
  open,
  onOpenChange,
  webhookEndpoint,
  allEventTypes,
}: EditWebhookDialogProps) {
  const router = useRouter();

  const form = useForm<UpdateWebhookFormData>({
    resolver: zodResolver(updateWebhookFormSchema),
    defaultValues: {
      name: webhookEndpoint.name || "",
      endpointUrl: webhookEndpoint.url || "",
      events: webhookEndpoint.events || [],
      endpointId: webhookEndpoint.uuid,
    },
  });
  const [loading, setLoading] = useState(false);

  const isDirty = form.formState.isDirty;

  const onSubmit = async (data: UpdateWebhookFormData) => {
    if (loading) return;

    try {
      setLoading(true);

      await axiosPutInstance<UpdateWebhookFormData, null>(
        UPDATE_WEBHOOK_ENDPOINT,
        data,
      );

      router.refresh();
      onOpenChange(false);

      form.reset(data);
      toast.success("Webhook updated successfully");
    } catch (error) {
      console.error("Error updating webhook", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  const onCancel = (updatedOpen: boolean) => {
    if (updatedOpen || loading) {
      return;
    }
    form.reset();
    onOpenChange(updatedOpen);
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Update Webhook</DialogTitle>
          <DialogDescription>
            Update the name, endpoint URL or events of the webhook.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormFields loading={loading} allEventTypes={allEventTypes} />
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
                  <>
                    <SendHorizontal />
                    Update
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
