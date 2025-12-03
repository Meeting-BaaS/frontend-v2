"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MemberTableActions } from "@/components/settings/team/members/member-table-actions";
import { Badge } from "@/components/ui/badge";
import { formatISODateString } from "@/lib/date-helpers";
import type { TeamMember } from "@/lib/schemas/teams";

// Column width configuration shared between columns and skeleton
export const columnWidths = {
  email: "min-w-[280px] max-w-[450px] w-[45%]",
  role: "min-w-[120px] max-w-[150px] w-[15%]",
  createdAt: "min-w-[140px] max-w-[200px] w-[20%]",
  actions: "min-w-[80px] max-w-[100px] w-[10%]",
} as const;

export const columns: ColumnDef<TeamMember>[] = [
  {
    accessorKey: "email",
    header: "Email",
    meta: {
      className: columnWidths.email,
    },
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
  {
    id: "actions",
    meta: {
      className: columnWidths.actions,
    },
    cell: ({ row }) => {
      return <MemberTableActions member={row.original} />;
    },
  },
];
