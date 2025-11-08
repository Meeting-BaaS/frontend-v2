"use client";

import { columns } from "@/components/settings/team/members/columns";
import { DataTable } from "@/components/ui/data-table";
import { MemberTableProvider } from "@/contexts/member-table-context";
import { useDataTable } from "@/hooks/use-data-table";
import type { TeamMember } from "@/lib/schemas/teams";
import { MemberTableDialogs } from "./member-table-dialogs";

interface MembersTableProps {
  members: TeamMember[];
}

export function MembersTable({ members }: MembersTableProps) {
  const { table } = useDataTable({
    data: members,
    columns,
    getRowId: (row) => row.email,
    initialSorting: [{ id: "email", desc: false }],
  });

  // This will realistically never happen, but it's a good fallback
  if (members.length === 0) {
    return <div className="text-muted-foreground py-4">No members found</div>;
  }

  return (
    <MemberTableProvider members={members}>
      <DataTable table={table} />
      <MemberTableDialogs />
    </MemberTableProvider>
  );
}
