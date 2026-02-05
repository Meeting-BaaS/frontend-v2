"use client";

import { Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { getColumns } from "@/components/admin/users/columns";
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
import type { TeamMember } from "@/lib/schemas/teams";

interface AdminUsersTableProps {
  members: TeamMember[];
  onSuccess: () => void;
}

export function AdminUsersTable({ members, onSuccess }: AdminUsersTableProps) {
  const searchParams = useSearchParams();
  const columnsWithActions = getColumns(onSuccess);

  const { table } = useDataTable({
    data: members ?? [],
    columns: columnsWithActions,
    getRowId: (row) =>
      row.userId != null ? String(row.userId) : `inv-${row.invitationId}`,
    manualPagination: false,
    initialSorting: [{ id: "email", desc: false }],
  });

  if (!searchParams.toString() && (!members || members.length === 0)) {
    return (
      <Empty className="border rounded-lg mt-8">
        <EmptyHeader>
          <EmptyMedia>
            <GradientIcon color="var(--color-orange-300)" size="lg">
              <Users />
            </GradientIcon>
          </EmptyMedia>
          <EmptyTitle>No users yet</EmptyTitle>
          <EmptyDescription>
            Invite users using the Invite User button above.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <DataTable
      table={table}
      clientSideSearch
      searchColumn="email"
      searchPlaceholder="Search by email..."
    />
  );
}
