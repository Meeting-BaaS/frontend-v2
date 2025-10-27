"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import { axiosPostInstance } from "@/lib/api-client";
import { CREATE_WEBHOOK_ENDPOINT } from "@/lib/api-routes";
import { genericError } from "@/lib/errors";
import {
  type CreateWebhookEndpointResponse,
  type CreateWebhookFormData,
  createWebhookEndpointResponseSchema,
  createWebhookFormSchema,
} from "@/lib/schemas/webhooks";

interface CreateWebhookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allEventTypes: string[]; // All available event types
}

export function CreateWebhookDialog({
  open,
  onOpenChange,
  allEventTypes,
}: CreateWebhookDialogProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const form = useForm<CreateWebhookFormData>({
    resolver: zodResolver(createWebhookFormSchema),
    defaultValues: {
      name: "",
      endpointUrl: "",
      events: [],
    },
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: CreateWebhookFormData) => {
    if (loading) return;

    try {
      setLoading(true);
      const response = await axiosPostInstance<
        CreateWebhookFormData,
        CreateWebhookEndpointResponse
      >(CREATE_WEBHOOK_ENDPOINT, data, createWebhookEndpointResponseSchema);

      router.push(`/webhooks/${response.data.webhookId}`);
      toast.success("Webhook created successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating webhook", error);
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

    // Remove new=true from searchParams when dialog closes
    if (searchParams.get("new") === "true") {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("new");
      const newUrl = newSearchParams.toString()
        ? `${pathname}?${newSearchParams.toString()}`
        : pathname;

      window.history.pushState(null, "", newUrl);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Add Webhook</DialogTitle>
          <DialogDescription>
            Create a new webhook to receive real-time event updates for bots or
            calendar changes.
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
                disabled={loading}
                aria-busy={loading}
                aria-disabled={loading}
                aria-label={loading ? "Saving" : "Save"}
              >
                {loading ? (
                  <>
                    <Spinner /> Saving
                  </>
                ) : (
                  <>
                    <SendHorizontal />
                    Save
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
