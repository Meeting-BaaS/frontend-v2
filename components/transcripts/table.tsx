"use client";

import { FileText, ListCheck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { columns } from "@/components/transcripts/columns";
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

interface TranscriptsTableProps {
  bots: BotListEntry[];
  prevCursor: string | null;
  nextCursor: string | null;
  params: ListBotsRequestQueryParams | null;
}

export function TranscriptsTable({
  bots,
  prevCursor,
  nextCursor,
  params,
}: TranscriptsTableProps) {
  const searchParams = useSearchParams();
  const cursor = params?.cursor ?? null;
  const { table } = useDataTable({
    data: bots || [],
    columns: columns,
    getRowId: (row) => row.bot_id,
    manualPagination: true,
  });

  const prevCursorLink = useMemo(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (cursor && prevCursor) {
      newSearchParams.set("cursor", prevCursor);
      return `/transcripts?${newSearchParams.toString()}`;
    }
    return null;
  }, [cursor, prevCursor, searchParams]);

  const nextCursorLink = useMemo(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (nextCursor) {
      newSearchParams.set("cursor", nextCursor);
      return `/transcripts?${newSearchParams.toString()}`;
    }
    return null;
  }, [nextCursor, searchParams]);

  if (!searchParams.toString() && (!bots || bots.length === 0)) {
    return (
      <Empty className="border rounded-lg mt-8">
        <EmptyHeader>
          <EmptyMedia>
            <GradientIcon color="var(--color-orange-300)" size="lg">
              <FileText />
            </GradientIcon>
          </EmptyMedia>
          <EmptyTitle>No transcripts available yet</EmptyTitle>
          <EmptyDescription>
            Transcripts will appear here once your bots have completed
            recording and transcription.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="primary" size="sm" className="font-medium" asChild>
            <Link href="/bots">
              <ListCheck /> View bots
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
