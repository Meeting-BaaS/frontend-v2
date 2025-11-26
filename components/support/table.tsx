"use client";

import { MessageSquare, Plus } from "lucide-react";
import { columns } from "@/components/support/columns";
import { ModuleFilter } from "@/components/support/module-filter";
import { StatusFilter } from "@/components/support/status-filter";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { useDataTable } from "@/hooks/use-data-table";
import { useUser } from "@/hooks/use-user";
import type { SupportTicket } from "@/lib/schemas/support";

interface SupportTicketsTableProps {
  tickets: SupportTicket[];
  tab: "open" | "resolved";
  onAddButtonClick: () => void;
}

export function SupportTicketsTable({
  tickets,
  tab,
  onAddButtonClick,
}: SupportTicketsTableProps) {
  const { activeTeam } = useUser();
  const { table } = useDataTable({
    data: tickets || [],
    columns: columns(tab === "resolved"),
    initialSorting: [{ id: "createdAt", desc: true }],
    getRowId: (row) => row.ticketId,
  });

  if (!tickets || tickets.length === 0) {
    return (
      <Empty className="border rounded-lg">
        <EmptyHeader>
          <EmptyMedia>
            <GradientIcon
              color={
                tab === "open"
                  ? "var(--color-orange-300)"
                  : "var(--color-green-300)"
              }
              size="lg"
            >
              <MessageSquare />
            </GradientIcon>
          </EmptyMedia>
          <EmptyTitle>
            No {tab} support tickets for {activeTeam.name} team
          </EmptyTitle>

          {tab === "open" ? (
            <EmptyDescription>
              Create a support ticket to report bugs, request features, or get
              help.
            </EmptyDescription>
          ) : (
            <EmptyDescription>
              Once a ticket is resolved, it will be moved to the resolved tab.
            </EmptyDescription>
          )}
        </EmptyHeader>
        {tab === "open" && (
          <EmptyContent>
            <Button
              variant="primary"
              size="sm"
              className="font-medium"
              onClick={onAddButtonClick}
            >
              <Plus /> Create ticket
            </Button>
          </EmptyContent>
        )}
      </Empty>
    );
  }
  return (
    <DataTable
      table={table}
      clientSideSearch
      searchColumn="subject"
      searchPlaceholder="Search by subject..."
      clientSideFilters={
        <div className="flex gap-2 w-full md:w-auto flex-col md:flex-row">
          <StatusFilter table={table} />
          <ModuleFilter table={table} />
        </div>
      }
    />
  );
}
