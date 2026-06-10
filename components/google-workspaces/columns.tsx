"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Building2 } from "lucide-react"
import Link from "next/link"
import { WorkspaceTableActions } from "@/components/google-workspaces/table-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/ui/copy-button"
import { GradientIcon } from "@/components/ui/gradient-icon"
import { formatRelativeDate } from "@/lib/date-helpers"
import type { MeetWorkspace } from "@/lib/schemas/meet-workspaces"

// Column width configuration (uuid/createdAt aligned with credentials table)
export const columnWidths = {
  workspace_id: "w-[350px]",
  domain: "min-w-[160px] max-w-[220px] w-[20%]",
  status: "min-w-[100px] max-w-[120px] w-[12%]",
  createdAt: "min-w-[140px] max-w-[150px] w-[15%]",
  actions: "min-w-[80px] max-w-[80px] w-[5%]"
} as const

export const columns: ColumnDef<MeetWorkspace>[] = [
  {
    id: "workspace_id",
    accessorKey: "workspace_id",
    header: "Workspace ID",
    meta: { className: columnWidths.workspace_id },
    cell: ({ row }) => (
      <div className="flex gap-1 items-center group">
        <div className="flex gap-3 items-center min-w-0">
          <GradientIcon color="var(--color-blue-300)" className="shrink-0">
            <Building2 />
          </GradientIcon>
          <div className="flex flex-col min-w-0">
            <Link
              href={`/google-workspaces/${row.original.workspace_id}`}
              className="truncate max-w-sm font-medium hover:underline"
            >
              {row.original.workspace_id}
            </Link>
            <span className="truncate max-w-sm text-muted-foreground text-xs">
              {row.original.name}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="opacity-0 -translate-x-2 delay-200 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-focus-within:opacity-100 group-focus-within:translate-x-0 focus-visible:opacity-100 focus-visible:translate-x-0 shrink-0"
        >
          <CopyButton text={row.original.workspace_id} />
        </Button>
      </div>
    )
  },
  {
    id: "domain",
    accessorKey: "domain",
    header: "Domain",
    meta: { className: columnWidths.domain },
    cell: ({ row }) => <span className="truncate text-sm font-mono">{row.original.domain}</span>
  },
  {
    id: "state",
    accessorKey: "state",
    header: "Status",
    meta: { className: columnWidths.status },
    cell: ({ row }) => {
      const state = row.original.state
      if (state === "active") {
        return <Badge variant="success">Active</Badge>
      }
      return <Badge variant="destructive">Invalid</Badge>
    }
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    header: "Created At",
    meta: { className: columnWidths.createdAt },
    cell: ({ row }) => (
      <div className="capitalize">{formatRelativeDate(row.original.created_at)}</div>
    )
  },
  {
    id: "actions",
    meta: { className: columnWidths.actions },
    cell: ({ row }) => <WorkspaceTableActions workspace={row.original} />
  }
]
