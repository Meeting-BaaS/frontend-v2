"use client";

import { ListCheck, Logs } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { columns } from "@/components/logs/columns";
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
  ApiLogListEntry,
  ListApiLogsRequestQueryParams,
} from "@/lib/schemas/api-logs";

interface LogsTableProps {
  logs: ApiLogListEntry[];
  prevCursor: string | null;
  nextCursor: string | null;
  params: ListApiLogsRequestQueryParams | null;
}

export function LogsTable({
  logs,
  prevCursor,
  nextCursor,
  params,
}: LogsTableProps) {
  const searchParams = useSearchParams();
  const cursor = params?.cursor ?? null;
  const { table } = useDataTable({
    data: logs || [],
    columns: columns,
    getRowId: (row) => row.id.toString(),
    manualPagination: true,
  });

  const prevCursorLink = useMemo(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (cursor && prevCursor) {
      newSearchParams.set("cursor", prevCursor); // prevCursor already has "-" prefix
      return `/logs?${newSearchParams.toString()}`;
    }
    return null;
  }, [cursor, prevCursor, searchParams]);

  const nextCursorLink = useMemo(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (nextCursor) {
      newSearchParams.set("cursor", nextCursor); // cursor has no prefix (forward direction)
      return `/logs?${newSearchParams.toString()}`;
    }
    return null;
  }, [nextCursor, searchParams]);

  if (!searchParams.toString() && (!logs || logs.length === 0)) {
    return (
      <Empty className="border rounded-lg mt-8">
        <EmptyHeader>
          <EmptyMedia>
            <GradientIcon color="var(--color-orange-300)" size="lg">
              <Logs />
            </GradientIcon>
          </EmptyMedia>
          <EmptyTitle>No logs yet</EmptyTitle>
          <EmptyDescription>
            Start making requests through the API to see your logs here.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="sm" className="font-medium" asChild>
            <Link href="/onboarding">
              <ListCheck /> Go to onboarding
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
      serverSideFilters
    />
  );
}
