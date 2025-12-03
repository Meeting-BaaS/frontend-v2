"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { formatISODateString } from "@/lib/date-helpers";
import type { TeamMember } from "@/lib/schemas/teams";

// Column width configuration (read-only, no actions column)
export const columnWidths = {
  email: "min-w-[280px] max-w-[450px] w-[50%]",
  role: "min-w-[120px] max-w-[150px] w-[25%]",
  createdAt: "min-w-[140px] max-w-[200px] w-[25%]",
} as const;

export const adminMembersColumns: ColumnDef<TeamMember>[] = [
  {
    accessorKey: "email",
    header: "Email",
    meta: {
      className: columnWidths.email,
    },
    cell: ({ row }) => {
      const { email } = row.original;
      return <div>{email}</div>;
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    meta: {
      className: columnWidths.role,
    },
    cell: ({ row }) => {
      const { role } = row.original;
      return (
        <Badge variant="secondary" className="capitalize">
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined On",
    meta: {
      className: columnWidths.createdAt,
    },
    cell: ({ row }) => {
      const { createdAt } = row.original;
      if (!createdAt) {
        return <div className="text-muted-foreground">-</div>;
      }
      return <div className="capitalize">{formatISODateString(createdAt)}</div>;
    },
  },
];
