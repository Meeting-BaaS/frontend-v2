"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { AdminTableActions } from "@/components/admin/admins/table-actions"
import { Badge } from "@/components/ui/badge"
import type { AdminListUser } from "@/types/admin-users"

export const columnWidths = {
  email: "min-w-[220px] max-w-[300px] w-[30%]",
  name: "min-w-[140px] max-w-[200px] w-[20%]",
  role: "min-w-[100px] max-w-[120px] w-[12%]",
  banned: "min-w-[100px] max-w-[120px] w-[12%]",
  actions: "min-w-[80px] max-w-[80px] w-[6%]"
} as const

export function getColumns(onSuccess: () => void): ColumnDef<AdminListUser>[] {
  return [
    {
      id: "email",
      accessorKey: "email",
      header: "Email",
      meta: {
        className: columnWidths.email
      },
      cell: ({ row }) => <span className="truncate block max-w-full">{row.original.email}</span>
    },
    {
      id: "name",
      accessorKey: "name",
      header: "Name",
      meta: {
        className: columnWidths.name
      },
      cell: ({ row }) => (
        <span className="truncate block max-w-full">{row.original.name ?? "-"}</span>
      )
    },
    {
      id: "role",
      accessorKey: "role",
      header: "Role",
      meta: {
        className: columnWidths.role
      },
      cell: ({ row }) => <span className="capitalize">{row.original.role}</span>
    },
    {
      id: "banned",
      accessorKey: "banned",
      header: "Status",
      meta: {
        className: columnWidths.banned
      },
      cell: ({ row }) =>
        row.original.banned ? (
          <Badge variant="destructive">Banned</Badge>
        ) : (
          <Badge variant="secondary">Active</Badge>
        )
    },
    {
      id: "actions",
      meta: {
        className: columnWidths.actions
      },
      cell: ({ row }) => (
        <AdminTableActions user={row.original} onSuccess={onSuccess} buttonVariant="ghost" />
      )
    }
  ]
}
