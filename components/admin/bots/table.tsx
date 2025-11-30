"use client";

import { Bot, ListCheck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { columns } from "@/components/admin/bots/columns";
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
  AdminBotListItem,
  ListAllBotsRequestQueryParams,
} from "@/lib/schemas/admin";

interface AdminBotsTableProps {
  bots: AdminBotListItem[];
  prevCursor: string | null;
  nextCursor: string | null;
  params: ListAllBotsRequestQueryParams | null;
}

export function AdminBotsTable({
  bots,
  prevCursor,
  nextCursor,
  params,
}: AdminBotsTableProps) {
  const searchParams = useSearchParams();
  const cursor = params?.cursor ?? null;
  const { table } = useDataTable({
    data: bots || [],
    columns: columns,
    getRowId: (row) => row.botId,
    manualPagination: true,
  });

  const prevCursorLink = useMemo(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (cursor && prevCursor) {
      newSearchParams.set("cursor", prevCursor);
      return `/admin/bots?${newSearchParams.toString()}`;
    }
    return null;
  }, [cursor, prevCursor, searchParams]);

  const nextCursorLink = useMemo(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (nextCursor) {
      newSearchParams.set("cursor", nextCursor);
      return `/admin/bots?${newSearchParams.toString()}`;
    }
    return null;
  }, [nextCursor, searchParams]);

  if (!searchParams.toString() && (!bots || bots.length === 0)) {
    return (
      <Empty className="border rounded-lg mt-8">
        <EmptyHeader>
          <EmptyMedia>
            <GradientIcon color="var(--color-orange-300)" size="lg">
              <Bot />
            </GradientIcon>
          </EmptyMedia>
          <EmptyTitle>No bots found</EmptyTitle>
          <EmptyDescription>
            No bots have been created across all teams yet.
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
