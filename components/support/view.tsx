"use client";

import { Plus } from "lucide-react";
import { PageHeading } from "@/components/layout/page-heading";
import { SupportTicketsTable } from "@/components/support/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupportDialog } from "@/hooks/use-support-dialog";
import type { Status, SupportTicket } from "@/lib/schemas/support";

interface SupportTicketsViewProps {
  tickets: SupportTicket[];
}

const OPEN_STATUSES: Status[] = [
  "open",
  "in_progress",
  "awaiting_client",
  "awaiting_agent",
] as const;
const RESOLVED_STATUSES: Status[] = ["resolved", "closed"] as const;

export function SupportTicketsView({ tickets }: SupportTicketsViewProps) {
  const { openSupportDialog } = useSupportDialog();

  const handleCreateButtonClick = () => {
    openSupportDialog();
  };

  // Filter tickets by status
  const openTickets = tickets.filter((ticket) =>
    OPEN_STATUSES.includes(ticket.status),
  );
  const resolvedTickets = tickets.filter((ticket) =>
    RESOLVED_STATUSES.includes(ticket.status),
  );

  return (
    <>
      <div className="flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <PageHeading title="Support Center" containerClassName="md:flex-1" />
        <div className="flex w-full sm:w-auto flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            size="sm"
            className="w-full sm:w-auto font-medium"
            onClick={handleCreateButtonClick}
          >
            <Plus /> Create ticket
          </Button>
        </div>
      </div>
      <Tabs defaultValue="open" className="mt-8">
        <TabsList className="flex gap-2">
          <TabsTrigger value="open">Open ({openTickets.length})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
        <TabsContent value="open">
          <SupportTicketsTable
            tickets={openTickets}
            tab="open"
            onAddButtonClick={handleCreateButtonClick}
          />
        </TabsContent>
        <TabsContent value="resolved">
          <SupportTicketsTable
            tickets={resolvedTickets}
            tab="resolved"
            onAddButtonClick={handleCreateButtonClick}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
