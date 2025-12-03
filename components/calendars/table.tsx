"use client";

import { Calendar, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { calendarColumns } from "@/components/calendars/columns";
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
import { DOCS_URL } from "@/lib/external-urls";
import type {
  CalendarListEntry,
  ListCalendarsRequestQueryParams,
} from "@/lib/schemas/calendars";

interface CalendarsTableProps {
  calendars: CalendarListEntry[];
  prevCursor: string | null;
  nextCursor: string | null;
  params: ListCalendarsRequestQueryParams | null;
}

export function CalendarsTable({
  calendars,
  prevCursor,
  nextCursor,
  params,
}: CalendarsTableProps) {
  const searchParams = useSearchParams();
  const cursor = params?.cursor ?? null;

  const { table } = useDataTable({
    data: calendars || [],
    columns: calendarColumns,
    getRowId: (row) => row.calendar_id,
    manualPagination: true,
  });

  const prevCursorLink = useMemo(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (cursor && prevCursor) {
      newSearchParams.set("cursor", prevCursor);
      return `/calendars?${newSearchParams.toString()}`;
    }
    return null;
  }, [cursor, prevCursor, searchParams]);

  const nextCursorLink = useMemo(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (nextCursor) {
      newSearchParams.set("cursor", nextCursor);
      return `/calendars?${newSearchParams.toString()}`;
    }
    return null;
  }, [nextCursor, searchParams]);

  if (!searchParams.toString() && (!calendars || calendars.length === 0)) {
    return (
      <Empty className="border rounded-lg mt-8">
        <EmptyHeader>
          <EmptyMedia>
            <GradientIcon color="var(--color-cyan-300)" size="lg">
              <Calendar />
            </GradientIcon>
          </EmptyMedia>
          <EmptyTitle>No calendars connected</EmptyTitle>
          <EmptyDescription>
            Follow a quick guide to connect your calendar and automatically
            schedule bots for meetings.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="primary" size="sm" className="font-medium" asChild>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={`${DOCS_URL}/api-v2/getting-started/calendars`}
            >
              Go to docs <ExternalLink />
            </Link>
          </Button>
        </EmptyContent>
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
