"use client";

import {
  AlertTriangle,
  MoreHorizontal,
  RefreshCw,
  Send,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteBotDataDialog } from "@/components/bots/delete-bot-data-dialog";
import { RetryCallbackDialog } from "@/components/bots/retry-callback-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSupportDialog } from "@/hooks/use-support-dialog";
import { axiosPostInstance } from "@/lib/api-client";
import { RESEND_FINAL_WEBHOOK } from "@/lib/api-routes";
import { genericError } from "@/lib/errors";
import type { BotDetails } from "@/lib/schemas/bots";

interface BotActionsProps {
  botDetails: BotDetails;
  botUuid: string;
  buttonVariant?: "ghost" | "outline" | "default";
}

export function BotActions({
  botDetails,
  botUuid,
  buttonVariant = "ghost",
}: BotActionsProps) {
  const router = useRouter();
  const { openSupportDialog } = useSupportDialog();
  const [openRetryDialog, setOpenRetryDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if bot is in a final state (completed or failed)
  const isFinalState =
    botDetails.status === "completed" || botDetails.status === "failed";

  const handleResendWebhook = async () => {
    if (loading) return;

    if (!isFinalState) {
      toast.error(
        "Please wait for the bot to complete before resending the webhook",
      );
      return;
    }

    try {
      setLoading(true);
      await axiosPostInstance(
        RESEND_FINAL_WEBHOOK(botUuid),
        null,
        undefined, // No response schema expected
      );

      toast.success("Final webhook resent successfully");
      router.refresh();
    } catch (error) {
      console.error("Error resending webhook", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  const handleRetryCallback = async () => {
    if (loading) return;

    if (!isFinalState) {
      toast.error(
        "Please wait for the bot to complete before retrying the callback",
      );
      return;
    }

    setOpenRetryDialog(true);
  };

  const handleDeleteBotData = async () => {
    if (loading) return;

    if (!botDetails.artifacts_deleted) {
      toast.error(
        "Please wait for the bot to complete before deleting the bot data",
      );
      return;
    }

    setOpenDeleteDialog(true);
  };
  const handleReportIssue = () => {
    openSupportDialog({
      botUuid: botUuid,
      module: "bots",
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={buttonVariant} className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleResendWebhook} disabled={loading}>
            <Send /> Resend final webhook
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleRetryCallback} disabled={loading}>
            <RefreshCw /> Retry callback
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {!botDetails.artifacts_deleted && (
            <>
              <DropdownMenuItem
                onClick={handleDeleteBotData}
                disabled={loading}
                className="text-destructive hover:!text-destructive hover:!bg-destructive/10"
              >
                <Trash className="text-destructive" /> Delete bot data
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={handleReportIssue} disabled={loading}>
            <AlertTriangle /> Report issue
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <RetryCallbackDialog
        botUuid={botUuid}
        open={openRetryDialog}
        onOpenChange={setOpenRetryDialog}
      />
      <DeleteBotDataDialog
        botUuid={botUuid}
        botName={botDetails.bot_name}
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
      />
    </>
  );
}
