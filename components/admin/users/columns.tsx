"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { UsersTableActions } from "@/components/admin/users/table-actions";
import { Badge } from "@/components/ui/badge";
import type { TeamMember } from "@/lib/schemas/teams";

export const columnWidths = {
  email: "min-w-[220px] max-w-[300px] w-[30%]",
  role: "min-w-[100px] max-w-[120px] w-[12%]",
  status: "min-w-[100px] max-w-[120px] w-[12%]",
  actions: "min-w-[80px] max-w-[80px] w-[6%]",
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
      cell: ({ row }) => (
        <span className="truncate block max-w-full">
          {row.original.email}
          {row.original.invitationStatus === "pending" && (
            <span className="ml-1 text-xs text-muted-foreground">
              (pending)
            </span>
          )}
        </span>
      ),
    },
    {
      id: "role",
      accessorKey: "role",
      header: "Role",
      meta: {
        className: columnWidths.role,
      },
      cell: ({ row }) => (
        <span className="capitalize">{row.original.role ?? "-"}</span>
      ),
    },
    {
      id: "status",
      accessorKey: "banned",
      header: "Status",
      meta: {
        className: columnWidths.status,
      },
      cell: ({ row }) => {
        const m = row.original;
        if (m.invitationId != null) {
          return <Badge variant="outline">Pending</Badge>;
        }
        return m.banned ? (
          <Badge variant="destructive">Banned</Badge>
        ) : (
          <Badge variant="secondary">Active</Badge>
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
