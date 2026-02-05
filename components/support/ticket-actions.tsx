"use client";

import {
  CheckCircle2,
  MoreHorizontal,
  Paperclip,
  Upload,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { TicketAttachmentsSheet } from "@/components/support/ticket-attachments-sheet";
import { UploadAttachmentsDialog } from "@/components/support/upload-attachments-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfiguration } from "@/hooks/use-configuration";
import { axiosPostInstance } from "@/lib/api-client";
import { UPDATE_TICKET_STATUS } from "@/lib/api-routes";
import { genericError } from "@/lib/errors";
import type {
  TicketDetails,
  UpdateTicketStatusRequest,
} from "@/lib/schemas/support";

interface TicketActionsProps {
  ticketDetails: TicketDetails;
  buttonVariant?: "ghost" | "outline" | "default";
}

export function TicketActions({
  ticketDetails,
  buttonVariant = "ghost",
}: TicketActionsProps) {
  const router = useRouter();
  const { configuration } = useConfiguration();
  const isSupportBucketConfigured =
    configuration?.isSupportBucketConfigured ?? true;
  const [openAttachmentsSheet, setOpenAttachmentsSheet] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const isResolved =
    ticketDetails.status === "resolved" || ticketDetails.status === "closed";

  const handleStatusUpdate = async (newStatus: "resolved" | "open") => {
    if (loading) return;

    try {
      setLoading(true);
      const requestData: UpdateTicketStatusRequest = {
        ticketId: ticketDetails.ticketId,
        status: newStatus,
      };

      await axiosPostInstance<UpdateTicketStatusRequest, void>(
        UPDATE_TICKET_STATUS,
        requestData,
        undefined, // No response schema expected for 204 No Content
      );

      toast.success(
        newStatus === "resolved"
          ? "Ticket marked as resolved"
          : "Ticket reopened",
      );
      router.refresh();
    } catch (error) {
      console.error("Error updating ticket status", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
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
          {isSupportBucketConfigured && (
            <>
              <DropdownMenuItem onClick={() => setOpenAttachmentsSheet(true)}>
                <Paperclip /> View attachments
              </DropdownMenuItem>
              {ticketDetails.status !== "resolved" &&
                ticketDetails.status !== "closed" && (
                  <DropdownMenuItem onClick={() => setOpenUploadDialog(true)}>
                    <Upload /> Upload more attachments
                  </DropdownMenuItem>
                )}
            </>
          )}
          {isResolved ? (
            <DropdownMenuItem
              onClick={() => handleStatusUpdate("open")}
              disabled={loading}
            >
              <XCircle /> Reopen ticket
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => handleStatusUpdate("resolved")}
              disabled={loading}
              className="hover:!text-green-500 hover:!bg-green-500/10"
            >
              <CheckCircle2 className="hover:text-green-500" /> Mark ticket as
              resolved
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {isSupportBucketConfigured && (
        <>
          <TicketAttachmentsSheet
            attachments={ticketDetails.attachments}
            open={openAttachmentsSheet}
            onOpenChange={setOpenAttachmentsSheet}
          />
          <UploadAttachmentsDialog
            ticketId={ticketDetails.ticketId}
            open={openUploadDialog}
            onOpenChange={setOpenUploadDialog}
          />
        </>
      )}
    </>
  );
}
