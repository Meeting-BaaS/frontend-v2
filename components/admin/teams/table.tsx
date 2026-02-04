"use client";

import { Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
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
import type { AdminTeamListItem } from "@/lib/schemas/admin";

interface AdminTeamsTableProps {
  teams: AdminTeamListItem[];
}

export function AdminTeamsTable({ teams }: AdminTeamsTableProps) {
  const searchParams = useSearchParams();

  const { table } = useDataTable({
    data: teams || [],
    columns: columns,
    getRowId: (row) => row.teamId.toString(),
    manualPagination: false,
    initialSorting: [
      { id: "lastBotCreatedAt", desc: false },
      { id: "createdAt", desc: false },
    ],
  });

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
      clientSideSearch
      searchColumn="team"
      searchPlaceholder="Search by team name..."
    />
  );
}
