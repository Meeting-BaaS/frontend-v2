import {
  MoreHorizontal,
  Pause,
  Pencil,
  Play,
  RefreshCcw,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { DeleteWebhookDialog } from "@/components/webhooks/delete";
import { EditWebhookDialog } from "@/components/webhooks/edit";
import { axiosPatchInstance, axiosPutInstance } from "@/lib/api-client";
import {
  DISABLE_WEBHOOK_ENDPOINT,
  ENABLE_WEBHOOK_ENDPOINT,
  ROTATE_WEBHOOK_ENDPOINT_SECRET,
} from "@/lib/api-routes";
import { genericError } from "@/lib/errors";
import type {
  DisableWebhookEndpointData,
  EnableWebhookEndpointData,
  RotateWebhookEndpointSecretData,
  WebhookEndpointWithSecret,
} from "@/lib/schemas/webhooks";

interface WebhookActionsProps {
  webhookEndpoint: WebhookEndpointWithSecret;
  buttonVariant?: "ghost" | "outline" | "default";
  allWebhookEvents: string[];
}

export function WebhookActions({
  webhookEndpoint,
  buttonVariant = "ghost",
  allWebhookEvents,
}: WebhookActionsProps) {
  const router = useRouter();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDisableWebhook = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await axiosPatchInstance<DisableWebhookEndpointData, null>(
        DISABLE_WEBHOOK_ENDPOINT,
        {
          endpointId: webhookEndpoint.uuid,
        },
      );

      router.refresh();
      toast.success("Webhook disabled successfully");
    } catch (error) {
      console.error("Error disabling webhook", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  const handleEnableWebhook = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await axiosPatchInstance<EnableWebhookEndpointData, null>(
        ENABLE_WEBHOOK_ENDPOINT,
        {
          endpointId: webhookEndpoint.uuid,
        },
      );

      router.refresh();
      toast.success("Webhook enabled successfully");
    } catch (error) {
      console.error("Error enabling webhook", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  const handleRotateWebhookSecret = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await axiosPutInstance<RotateWebhookEndpointSecretData, null>(
        ROTATE_WEBHOOK_ENDPOINT_SECRET,
        {
          endpointId: webhookEndpoint.uuid,
        },
      );

      router.refresh();
      toast.success("Webhook secret rotated successfully");
    } catch (error) {
      console.error("Error rotating webhook secret", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={buttonVariant}
            className="h-8 w-8 p-0"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner />
                <span className="sr-only">Loading</span>
              </>
            ) : (
              <>
                <MoreHorizontal />
                <span className="sr-only">Open menu</span>
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setOpenEditDialog(true)}>
            <Pencil /> Edit webhook
          </DropdownMenuItem>
          {webhookEndpoint.enabled ? (
            <DropdownMenuItem onClick={handleDisableWebhook}>
              <Pause /> Disable webhook
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={handleEnableWebhook}>
              <Play /> Enable webhook
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleRotateWebhookSecret}>
            <RefreshCcw /> Rotate signing secret
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive hover:!text-destructive hover:!bg-destructive/10"
            onClick={() => setOpenDeleteDialog(true)}
          >
            <Trash className="text-destructive" /> Delete webhook
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditWebhookDialog
        webhookEndpoint={webhookEndpoint}
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        allEventTypes={allWebhookEvents}
      />
      <DeleteWebhookDialog
        webhookEndpoint={webhookEndpoint}
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
      />
    </>
  );
}
