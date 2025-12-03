"use client";

import { TicketAddMessage } from "@/components/support/ticket-add-message";
import { TicketViewMessages } from "@/components/support/ticket-view-messages";
import type { TicketDetails } from "@/lib/schemas/support";

interface TicketMessageChainProps {
  messageChain: TicketDetails["messageChain"];
  ticketId: string;
  status: TicketDetails["status"];
  isAdmin?: boolean;
}

export function TicketMessageChain({
  messageChain,
  ticketId,
  status,
  isAdmin = false,
}: TicketMessageChainProps) {
  return (
    <div className="space-y-4">
      <TicketViewMessages messageChain={messageChain} />
      <TicketAddMessage ticketId={ticketId} status={status} isAdmin={isAdmin} />
    </div>
  );
}
