"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { formatISODateString } from "@/lib/date-helpers";
import type { TeamMember } from "@/lib/schemas/teams";

export const columns: ColumnDef<TeamMember>[] = [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const { invitationStatus, email, expiresAt } = row.original;
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {email}{" "}
            {invitationStatus ? (
              <Badge variant="warning" className="capitalize">
                {invitationStatus}
              </Badge>
            ) : null}
          </div>
          {expiresAt ? (
            <div className="text-muted-foreground">
              Invite expires on {formatISODateString(expiresAt)}
            </div>
          ) : null}
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
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
    cell: ({ row }) => {
      const { createdAt } = row.original;
      if (!createdAt) {
        return <div className="text-muted-foreground">-</div>;
      }
      return <div className="capitalize">{formatISODateString(createdAt)}</div>;
    },
  },
];
