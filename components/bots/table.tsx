"use client";

import { Bot, ListCheck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { columns } from "@/components/bots/columns";
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
  BotListEntry,
  ListBotsRequestQueryParams,
} from "@/lib/schemas/bots";

interface BotsTableProps {
  bots: BotListEntry[];
  prevCursor: string | null;
  nextCursor: string | null;
  params: ListBotsRequestQueryParams | null;
}

export function BotsTable({
  bots,
  prevCursor,
  nextCursor,
  params,
}: BotsTableProps) {
  const searchParams = useSearchParams();
  const cursor = params?.cursor ?? null;
  const { table } = useDataTable({
    data: bots || [],
    columns: columns,
    getRowId: (row) => row.botUuid,
    manualPagination: true,
  });

  const prevCursorLink = useMemo(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (cursor && prevCursor) {
      // Fixed: removed cursor !== null check
      newSearchParams.set("cursor", prevCursor); // prevCursor already has "-" prefix
      return `/bots?${newSearchParams.toString()}`;
    }
    return null;
  }, [cursor, prevCursor, searchParams]); // Removed cursor dependency

  const nextCursorLink = useMemo(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (nextCursor) {
      // Fixed: changed nextCursor to cursor
      newSearchParams.set("cursor", nextCursor); // cursor has no prefix (forward direction)
      return `/bots?${newSearchParams.toString()}`;
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
          <EmptyTitle>No bots created yet</EmptyTitle>
          <EmptyDescription>
            Create a bot to start recording and transcribing meetings using a
            unified API.
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
    />
  );
}
