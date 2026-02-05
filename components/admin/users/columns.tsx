"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { UsersTableActions } from "@/components/admin/users/table-actions";
import { Badge } from "@/components/ui/badge";
import { formatISODateString } from "@/lib/date-helpers";
import type { TeamMember } from "@/lib/schemas/teams";

export const columnWidths = {
  email: "min-w-[220px] max-w-[380px] w-[40%]",
  status: "min-w-[100px] max-w-[120px] w-[12%]",
  joinedOn: "min-w-[140px] max-w-[200px] w-[18%]",
  actions: "min-w-[80px] max-w-[80px] w-[10%]",
} as const;

export function getColumns(onSuccess: () => void): ColumnDef<TeamMember>[] {
  return [
    {
      id: "email",
      accessorKey: "email",
      header: "Email",
      meta: {
        className: columnWidths.email,
      },
      cell: ({ row }) => {
        const { email, expiresAt, invitationStatus } = row.original;
        return (
          <div className="flex flex-col gap-1">
            <span className="truncate block max-w-full">{email}</span>
            {expiresAt && invitationStatus === "pending" && (
              <span className="text-muted-foreground text-xs">
                Invite expires on {formatISODateString(expiresAt)}
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      meta: {
        className: columnWidths.status,
      },
      cell: ({ row }) => {
        const { invitationStatus, banned } = row.original;
        if (invitationStatus === "pending") {
          return <Badge variant="secondary">Invited</Badge>;
        }
        if (banned) {
          return <Badge variant="destructive">Banned</Badge>;
        }
        return <Badge variant="secondary">Active</Badge>;
      },
    },
    {
      id: "joinedOn",
      accessorKey: "createdAt",
      header: "Joined On",
      meta: {
        className: columnWidths.joinedOn,
      },
      cell: ({ row }) => {
        const { createdAt, invitationStatus } = row.original;
        if (invitationStatus === "pending") {
          return <span className="text-muted-foreground">-</span>;
        }
        if (!createdAt) {
          return <span className="text-muted-foreground">-</span>;
        }
        return (
          <span className="capitalize">
            {formatISODateString(createdAt)}
          </span>
        );
      },
    },
    {
      id: "actions",
      meta: {
        className: columnWidths.actions,
      },
      cell: ({ row }) => (
        <UsersTableActions
          member={row.original}
          onSuccess={onSuccess}
          buttonVariant="ghost"
        />
      ),
    },
  ];
}
