"use client";

import { CreateSupportTicketDialog } from "@/components/support/create-dialog";
import { useSupportDialog } from "@/hooks/use-support-dialog";

/**
 * Component that renders the support dialog based on context state
 * This ensures only one dialog is mounted and can be opened from anywhere
 */
export function SupportDialog() {
  const { dialogState, closeSupportDialog } = useSupportDialog();

  return (
    <CreateSupportTicketDialog
      open={dialogState.open}
      onOpenChange={(open) => {
        if (!open) closeSupportDialog();
      }}
      initialBotUuid={dialogState.botUuid}
      initialModule={dialogState.module}
    />
  );
}
