"use client";

import { FileText, Image } from "lucide-react";
import { FileCard } from "@/components/bots/file-card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { TicketAttachment } from "@/lib/schemas/support";

interface TicketAttachmentsSheetProps {
  attachments: TicketAttachment[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TicketAttachmentsSheet({
  attachments,
  open,
  onOpenChange,
}: TicketAttachmentsSheetProps) {
  const fileCards = attachments.map((attachment, index) => {
    // Determine icon based on file type
    const isImage = attachment.fileName.match(/\.(jpg|jpeg|png)$/i);
    const Icon = isImage ? Image : FileText;
    const iconColor = isImage
      ? "var(--color-green-500)"
      : "var(--color-blue-500)";

    return (
      <FileCard
        key={attachment.s3Key}
        icon={Icon}
        iconColor={iconColor}
        title={`Attachment ${index + 1}: ${attachment.fileName}`}
        date={attachment.uploadedAt}
        url={attachment.signedUrl}
        fileName={attachment.fileName}
        fileTitleClassName="text-sm"
      />
    );
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Attachments</SheetTitle>
          <SheetDescription>
            View and download all attachments for this ticket.
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          {attachments.length === 0 ? (
            <div className="text-muted-foreground text-sm">No attachments</div>
          ) : (
            <div className="space-y-3">{fileCards}</div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
