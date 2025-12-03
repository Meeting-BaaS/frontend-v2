"use client";

import { Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { columns } from "@/components/admin/teams/columns";
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
  AdminTeamListItem,
  ListAllTeamsRequestQueryParams,
} from "@/lib/schemas/admin";

interface AdminTeamsTableProps {
  teams: AdminTeamListItem[];
  prevCursor: string | null;
  nextCursor: string | null;
  params: ListAllTeamsRequestQueryParams | null;
}

export function AdminTeamsTable({
  teams,
  prevCursor,
  nextCursor,
  params,
}: AdminTeamsTableProps) {
  const searchParams = useSearchParams();
  const cursor = params?.cursor ?? null;
  const { table } = useDataTable({
    data: teams || [],
    columns: columns,
    getRowId: (row) => row.teamId.toString(),
    manualPagination: true,
  });

  const prevCursorLink = useMemo(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (cursor && prevCursor) {
      newSearchParams.set("cursor", prevCursor);
      return `/admin/teams?${newSearchParams.toString()}`;
    }
    return null;
  }, [cursor, prevCursor, searchParams]);

  const nextCursorLink = useMemo(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (nextCursor) {
      newSearchParams.set("cursor", nextCursor);
      return `/admin/teams?${newSearchParams.toString()}`;
    }
    return null;
  }, [nextCursor, searchParams]);

  if (!searchParams.toString() && (!teams || teams.length === 0)) {
    return (
      <Empty className="border rounded-lg mt-8">
        <EmptyHeader>
          <EmptyMedia>
            <GradientIcon color="var(--color-orange-300)" size="lg">
              <Users />
            </GradientIcon>
          </EmptyMedia>
          <EmptyTitle>No teams found</EmptyTitle>
          <EmptyDescription>No teams have been created yet.</EmptyDescription>
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
