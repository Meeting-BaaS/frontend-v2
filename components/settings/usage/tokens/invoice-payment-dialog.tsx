"use client";

import { ExternalLink } from "lucide-react";
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

interface InvoicePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceUrl: string;
}

export function InvoicePaymentDialog({
  open,
  onOpenChange,
  invoiceUrl,
}: InvoicePaymentDialogProps) {
  const handleOpenInvoice = () => {
    window.open(invoiceUrl, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Payment Gateway Opened</DialogTitle>
          <DialogDescription className="space-y-2">
            <p>
              A payment gateway has been opened in a new tab. Complete the
              payment there, then refresh this page to see your updated token
              balance.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Close
            </Button>
          </DialogClose>
          <Button size="sm" onClick={handleOpenInvoice}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Payment Gateway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
