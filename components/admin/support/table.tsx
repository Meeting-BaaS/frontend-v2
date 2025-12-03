"use client";

import { MessageSquare } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { columns } from "@/components/admin/support/columns";
import { DataTable } from "@/components/ui/data-table";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { useDataTable } from "@/hooks/use-data-table";
import type {
  AdminSupportTicketListItem,
  ListAllSupportTicketsRequestQueryParams,
} from "@/lib/schemas/admin";

interface AdminSupportTableProps {
  tickets: AdminSupportTicketListItem[];
  prevCursor: string | null;
  nextCursor: string | null;
  params: ListAllSupportTicketsRequestQueryParams | null;
}

export function AdminSupportTable({
  tickets,
  prevCursor,
  nextCursor,
  params,
}: AdminSupportTableProps) {
  const searchParams = useSearchParams();
  const cursor = params?.cursor ?? null;
  const { table } = useDataTable({
    data: tickets || [],
    columns: columns,
    getRowId: (row) => row.ticketId,
    manualPagination: true,
  });

  const prevCursorLink = useMemo(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (cursor && prevCursor) {
      newSearchParams.set("cursor", prevCursor);
      return `/admin/support?${newSearchParams.toString()}`;
    }
    return null;
  }, [cursor, prevCursor, searchParams]);

  const nextCursorLink = useMemo(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (nextCursor) {
      newSearchParams.set("cursor", nextCursor);
      return `/admin/support?${newSearchParams.toString()}`;
    }
    return null;
  }, [nextCursor, searchParams]);

  if (!searchParams.toString() && (!tickets || tickets.length === 0)) {
    return (
      <Empty className="border rounded-lg mt-8">
        <EmptyHeader>
          <EmptyMedia>
            <GradientIcon color="var(--color-orange-300)" size="lg">
              <MessageSquare />
            </GradientIcon>
          </EmptyMedia>
          <EmptyTitle>No support tickets found</EmptyTitle>
          <EmptyDescription>
            No support tickets have been created across all teams yet.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <DataTable
      table={table}
      serverSidePagination
      prevIteratorLink={prevCursorLink}
      nextIteratorLink={nextCursorLink}
    />
  );
}
