"use client";

import { MessageSquare } from "lucide-react";
import { ItemHeading } from "@/components/layout/item-heading";
import { statusColors } from "@/components/support/columns";
import { TicketActions } from "@/components/support/ticket-actions";
import { TicketMessageChain } from "@/components/support/ticket-message-chain";
import { Badge } from "@/components/ui/badge";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { NameValuePair } from "@/components/ui/name-value-pair";
import { formatRelativeDate } from "@/lib/date-helpers";
import type { TicketDetails } from "@/lib/schemas/support";
import { moduleLabels, statusLabels, typeLabels } from "@/lib/schemas/support";

interface TicketDetailsProps {
  ticketDetails: TicketDetails;
}

export function ViewTicketDetails({ ticketDetails }: TicketDetailsProps) {
  const statusColor = statusColors[ticketDetails.status].split(" ")[3];

  return (
    <section>
      <div className="flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <ItemHeading
          title={ticketDetails.subject}
          name={ticketDetails.ticketId}
          nameClassName="text-xl"
          containerClassName="md:flex-1"
          gradientIcon={
            <GradientIcon color={statusColor} size="xl">
              <MessageSquare className="size-8" />
            </GradientIcon>
          }
        />
        <TicketActions ticketDetails={ticketDetails} buttonVariant="outline" />
      </div>

      <div className="grid mt-10 md:mt-12 md:space-y-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        <NameValuePair
          title="Module"
          value={moduleLabels[ticketDetails.module]}
        />
        <NameValuePair title="Type" value={typeLabels[ticketDetails.type]} />
        <NameValuePair
          title="Status"
          value={
            <Badge className={statusColors[ticketDetails.status]}>
              {statusLabels[ticketDetails.status]}
            </Badge>
          }
        />
        <NameValuePair title="Bot UUID" value={ticketDetails.botUuid} />
        <NameValuePair
          title="Created At"
          valueClassName="capitalize"
          value={formatRelativeDate(ticketDetails.createdAt)}
        />

        <NameValuePair
          title="Resolved At"
          valueClassName="capitalize"
          value={
            ticketDetails.resolvedAt &&
            formatRelativeDate(ticketDetails.resolvedAt)
          }
        />

        <NameValuePair
          containerClassName="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4"
          title="Message Chain"
          value={
            <TicketMessageChain
              messageChain={ticketDetails.messageChain}
              ticketId={ticketDetails.ticketId}
              status={ticketDetails.status}
            />
          }
        />
      </div>
    </section>
  );
}
