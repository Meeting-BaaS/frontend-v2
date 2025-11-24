"use client";

import { CalendarClock, ClipboardList } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { scheduledBotColumns } from "@/components/scheduled-bots/columns";
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
import type {
  ListScheduledBotsRequestQueryParams,
  ScheduledBotListEntry,
} from "@/lib/schemas/scheduled-bots";

interface ScheduledBotsTableProps {
  bots: ScheduledBotListEntry[];
  prevCursor: string | null;
  nextCursor: string | null;
  params: ListScheduledBotsRequestQueryParams | null;
}

export function ScheduledBotsTable({
  bots,
  prevCursor,
  nextCursor,
  params,
}: ScheduledBotsTableProps) {
  const searchParams = useSearchParams();
  const cursor = params?.cursor ?? null;

  const { table } = useDataTable({
    data: bots || [],
    columns: scheduledBotColumns,
    getRowId: (row) => row.bot_id,
    manualPagination: true,
  });

  const prevCursorLink = useMemo(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (cursor && prevCursor) {
      newSearchParams.set("cursor", prevCursor);
      return `/scheduled-bots?${newSearchParams.toString()}`;
    }
    return null;
  }, [cursor, prevCursor, searchParams]);

  const nextCursorLink = useMemo(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (nextCursor) {
      newSearchParams.set("cursor", nextCursor);
      return `/scheduled-bots?${newSearchParams.toString()}`;
    }
    return null;
  }, [nextCursor, searchParams]);

  if (!searchParams.toString() && (!bots || bots.length === 0)) {
    return (
      <Empty className="border rounded-lg mt-8">
        <EmptyHeader>
          <EmptyMedia>
            <GradientIcon color="var(--color-cyan-300)" size="lg">
              <CalendarClock />
            </GradientIcon>
          </EmptyMedia>
          <EmptyTitle>No scheduled bots yet</EmptyTitle>
          <EmptyDescription>
            Schedule bots ahead of time to automatically join future meetings.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="sm" className="font-medium" asChild>
            <Link href="/bots">
              <ClipboardList /> View active bots
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
