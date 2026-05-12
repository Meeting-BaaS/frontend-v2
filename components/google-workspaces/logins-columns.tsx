"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Users } from "lucide-react"
import { LoginTableActions } from "@/components/google-workspaces/logins-table-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/ui/copy-button"
import { GradientIcon } from "@/components/ui/gradient-icon"
import { formatRelativeDate } from "@/lib/date-helpers"
import type { MeetLogin } from "@/lib/schemas/meet-logins"
import type { MeetWorkspace } from "@/lib/schemas/meet-workspaces"

export const loginColumnWidths = {
  credential_id: "w-[280px]",
  email: "min-w-[180px] max-w-[240px] w-[20%]",
  emailGroup: "min-w-[160px] max-w-[220px] w-[18%]",
  status: "min-w-[100px] max-w-[120px] w-[10%]",
  sessions: "min-w-[110px] max-w-[120px] w-[10%]",
  lastUsed: "min-w-[140px] max-w-[160px] w-[12%]",
  actions: "min-w-[80px] max-w-[80px] w-[5%]"
} as const

export function buildLoginColumns(workspace: MeetWorkspace): ColumnDef<MeetLogin>[] {
  return [
    {
      id: "credential_id",
      accessorKey: "credential_id",
      header: "Credential ID",
      meta: { className: loginColumnWidths.credential_id },
      cell: ({ row }) => (
        <div className="flex gap-1 items-center group">
          <div className="flex gap-3 items-center min-w-0">
            <GradientIcon color="var(--color-green-300)" className="shrink-0">
              <Users />
            </GradientIcon>
            <div className="flex flex-col min-w-0">
              <span className="truncate max-w-sm font-medium">{row.original.credential_id}</span>
              <span className="truncate max-w-sm text-muted-foreground text-xs">
                {row.original.name}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="opacity-0 -translate-x-2 delay-200 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 shrink-0"
          >
            <CopyButton text={row.original.credential_id} />
          </Button>
        </div>
      )
    },
    {
      id: "email",
      accessorKey: "email",
      header: "Email",
      meta: { className: loginColumnWidths.email },
      cell: ({ row }) => <span className="truncate text-sm font-mono">{row.original.email}</span>
    },
    {
      id: "email_group",
      accessorKey: "email_group",
      header: "Email Group",
      meta: { className: loginColumnWidths.emailGroup },
      cell: ({ row }) => {
        const value = row.original.email_group
        if (!value) return <span className="text-muted-foreground">-</span>
        return <span className="truncate text-sm font-mono">{value}</span>
      }
    },
    {
      id: "state",
      accessorKey: "state",
      header: "Status",
      meta: { className: loginColumnWidths.status },
      cell: ({ row }) =>
        row.original.state === "active" ? (
          <Badge variant="success">Active</Badge>
        ) : (
          <Badge variant="destructive">Invalid</Badge>
        )
    },
    {
      id: "active_session_count",
      accessorKey: "active_session_count",
      header: "Sessions",
      meta: { className: loginColumnWidths.sessions },
      cell: ({ row }) => <span className="text-sm">{row.original.active_session_count}</span>
    },
    {
      id: "last_used_at",
      accessorKey: "last_used_at",
      header: "Last Used",
      meta: { className: loginColumnWidths.lastUsed },
      cell: ({ row }) =>
        row.original.last_used_at ? (
          <div className="capitalize">{formatRelativeDate(row.original.last_used_at)}</div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
    },
    {
      id: "actions",
      meta: { className: loginColumnWidths.actions },
      cell: ({ row }) => <LoginTableActions login={row.original} workspace={workspace} />
    }
  ]
}
