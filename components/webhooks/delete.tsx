"use client";

import { SendHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { axiosDeleteInstance } from "@/lib/api-client";
import { DELETE_WEBHOOK_ENDPOINT } from "@/lib/api-routes";
import { genericError } from "@/lib/errors";
import type { WebhookEndpointWithSecret } from "@/lib/schemas/webhooks";

interface DeleteWebhookDialogProps {
  open: boolean;
  webhookEndpoint: WebhookEndpointWithSecret;
  onOpenChange: (open: boolean) => void;
}

export function DeleteWebhookDialog({
  open,
  onOpenChange,
  webhookEndpoint,
}: DeleteWebhookDialogProps) {
  const router = useRouter();
  const [typedText, setTypedText] = useState("");

  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading || typedText !== "delete") return;

    try {
      setLoading(true);

      await axiosDeleteInstance(
        `${DELETE_WEBHOOK_ENDPOINT}/${webhookEndpoint.uuid}`,
      );

      router.push("/webhooks");
      toast.success("Webhook deleted successfully");
      onCancel(false);
    } catch (error) {
      console.error("Error deleting webhook", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  const onCancel = (updatedOpen: boolean) => {
    if (updatedOpen || loading) {
      return;
    }
    setTypedText("");
    onOpenChange(updatedOpen);
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Delete Webhook</DialogTitle>
          <DialogDescription className="sr-only">
            Click the button to delete the webhook.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} noValidate>
          <div className="space-y-6 pb-8">
            <div className="flex flex-col gap-1">
              <p>Are you sure you want to delete this webhook?</p>
              <p className="text-sm text-destructive">
                <span className="font-bold">Warning:</span> This action cannot
                be undone.
              </p>
            </div>
            <FieldGroup>
              <Field>
                <FieldLabel>
                  Type{" "}
                  <Badge
                    variant="warning"
                    className="flex items-center gap-2 py-1 text-sm"
                  >
                    delete
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-3 [&_svg]:size-3 [&_svg]:text-foreground"
                      asChild
                    >
                      <CopyButton text="delete" />
                    </Button>
                  </Badge>
                  to confirm
                </FieldLabel>
                <FieldContent>
                  <Input
                    value={typedText}
                    onChange={(e) => setTypedText(e.target.value)}
                    disabled={loading}
                    aria-label="Type 'delete' to confirm"
                    aria-required="true"
                  />
                </FieldContent>
              </Field>
            </FieldGroup>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant="destructive"
              disabled={loading || typedText !== "delete"}
              aria-busy={loading}
              aria-disabled={loading}
              aria-label={loading ? "Deleting" : "Delete"}
            >
              {loading ? (
                <>
                  <Spinner /> Deleting
                </>
              ) : (
                <>
                  <SendHorizontal />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
