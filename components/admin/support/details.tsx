"use client";

import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { AdminTicketActions } from "@/components/admin/support/ticket-actions";
import { statusColors } from "@/components/support/columns";
import { TicketMessageChain } from "@/components/support/ticket-message-chain";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { NameValuePair } from "@/components/ui/name-value-pair";
import { formatRelativeDate } from "@/lib/date-helpers";
import type { AdminTicketDetails as AdminTicketDetailsType } from "@/lib/schemas/admin";
import { moduleLabels, statusLabels, typeLabels } from "@/lib/schemas/support";

interface AdminTicketDetailsProps {
  ticketDetails: AdminTicketDetailsType;
  ticketId: string;
}

export function AdminTicketDetails({
  ticketDetails,
  ticketId,
}: AdminTicketDetailsProps) {
  const statusColor = statusColors[ticketDetails.status].split(" ")[3];

  return (
    <section>
      <div className="flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3 md:flex-1">
          <GradientIcon color={statusColor} size="xl">
            <MessageSquare className="size-8" />
          </GradientIcon>
          <div>
            <h1 className="text-2xl font-bold">{ticketDetails.subject}</h1>
            <p className="text-muted-foreground text-sm">{ticketId}</p>
          </div>
        </div>
        <AdminTicketActions
          ticketDetails={ticketDetails}
          buttonVariant="outline"
        />
      </div>

      <div className="grid mt-10 md:mt-12 md:space-y-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        <NameValuePair
          title="Team"
          value={
            <Button variant="link" asChild className="p-0">
              <Link
                href={`/admin/teams/${ticketDetails.teamId}`}
                className="decoration-dashed underline hover:decoration-baas-primary-500 hover:decoration-solid"
              >
                {ticketDetails.teamName}
              </Link>
            </Button>
          }
        />
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
        <NameValuePair
          title="Bot UUID"
          value={
            ticketDetails.botUuid ? (
              <Button variant="link" asChild className="p-0">
                <Link
                  href={`/admin/bots/${ticketDetails.botUuid}`}
                  className="decoration-dashed underline hover:decoration-baas-primary-500 hover:decoration-solid"
                >
                  {ticketDetails.botUuid}
                </Link>
              </Button>
            ) : null
          }
        />
        <NameValuePair
          title="Created At"
          valueClassName="capitalize"
          value={formatRelativeDate(ticketDetails.createdAt)}
        />

        <NameValuePair
          title="Resolved At"
          valueClassName="capitalize"
          value={
            ticketDetails.resolvedAt
              ? formatRelativeDate(ticketDetails.resolvedAt)
              : null
          }
        />

        <NameValuePair
          containerClassName="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4"
          title="Message Chain"
          value={
            <TicketMessageChain
              messageChain={ticketDetails.messageChain}
              ticketId={ticketId}
              status={ticketDetails.status}
              isAdmin
            />
          }
        />
      </div>
    </section>
  );
}
