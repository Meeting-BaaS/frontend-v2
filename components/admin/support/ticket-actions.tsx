"use client"

import { MoreHorizontal, Paperclip, SendToBack } from "lucide-react"
import { useState } from "react"
import { UpdateTicketStatusDialog } from "@/components/admin/support/update-status-dialog"
import { TicketAttachmentsSheet } from "@/components/support/ticket-attachments-sheet"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useConfiguration } from "@/hooks/use-configuration"
import type { AdminTicketDetails } from "@/lib/schemas/admin"

interface AdminTicketActionsProps {
  ticketDetails: AdminTicketDetails
  buttonVariant?: "ghost" | "outline" | "default"
}

export function AdminTicketActions({
  ticketDetails,
  buttonVariant = "ghost"
}: AdminTicketActionsProps) {
  const { configuration } = useConfiguration()
  const isSupportBucketConfigured = configuration?.isSupportBucketConfigured ?? true
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [attachmentsSheetOpen, setAttachmentsSheetOpen] = useState(false)

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
            <DropdownMenuItem onClick={() => setAttachmentsSheetOpen(true)}>
              <Paperclip /> View attachments
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => setStatusDialogOpen(true)}>
            <SendToBack /> Change Status
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isSupportBucketConfigured && (
        <TicketAttachmentsSheet
          attachments={ticketDetails.attachments}
          open={attachmentsSheetOpen}
          onOpenChange={setAttachmentsSheetOpen}
        />
      )}
      <UpdateTicketStatusDialog
        ticketId={ticketDetails.ticketId}
        currentStatus={ticketDetails.status}
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
      />
    </>
  )
}
