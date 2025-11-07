"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { formatRelativeDate } from "@/lib/date-helpers";
import type { TeamMember } from "@/lib/schemas/teams";

export const columns: ColumnDef<TeamMember>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <Badge variant="secondary" className="capitalize">
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      return <div className="capitalize">{formatRelativeDate(createdAt)}</div>;
    },
  },
];
