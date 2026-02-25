"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ShieldCheck, ShieldPlus, User } from "lucide-react"
import { CredentialTableActions } from "@/components/credentials/table-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/ui/copy-button"
import { GradientIcon } from "@/components/ui/gradient-icon"
import { formatRelativeDate } from "@/lib/date-helpers"
import type { ZoomCredential } from "@/lib/schemas/credentials"

// Column width configuration (uuid/createdAt aligned with bots table)
export const columnWidths = {
  credential_id: "w-[350px]",
  type: "min-w-[80px] max-w-[110px] w-[10%]",
  status: "min-w-[100px] max-w-[120px] w-[12%]",
  zoomUser: "min-w-[150px] max-w-[200px] w-[20%]",
  createdAt: "min-w-[140px] max-w-[150px] w-[15%]",
  actions: "min-w-[80px] max-w-[80px] w-[5%]"
} as const

export const columns: ColumnDef<ZoomCredential>[] = [
  {
    id: "credential_id",
    accessorKey: "credential_id",
    header: "Credential ID",
    meta: {
      className: columnWidths.credential_id
    },
    cell: ({ row }) => {
      return (
        <div className="flex gap-1 items-center group">
          <div className="flex gap-3 items-center min-w-0">
            <GradientIcon color="var(--color-blue-300)" className="shrink-0">
              <ShieldPlus />
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
            className="opacity-0 -translate-x-2 delay-200 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-focus-within:opacity-100 group-focus-within:translate-x-0 focus-visible:opacity-100 focus-visible:translate-x-0 shrink-0"
          >
            <CopyButton text={row.original.credential_id} />
          </Button>
        </div>
      )
    }
  },
  {
    id: "credential_type",
    accessorKey: "credential_type",
    header: "Type",
    meta: {
      className: columnWidths.type
    },
    cell: ({ row }) => {
      const type = row.original.credential_type
      if (type === "user") {
        return (
          <Badge variant="secondary" className="gap-1">
            <User className="h-3 w-3" />
            User
          </Badge>
        )
      }
      return (
        <Badge variant="outline" className="gap-1">
          <ShieldCheck className="h-3 w-3" />
          App
        </Badge>
      )
    }
  },
  {
    id: "state",
    accessorKey: "state",
    header: "Status",
    meta: {
      className: columnWidths.status
    },
    cell: ({ row }) => {
      const state = row.original.state
      if (state === "active") {
        return <Badge variant="success">Active</Badge>
      }
      return <Badge variant="destructive">Invalid</Badge>
    }
  },
  {
    id: "zoom_user_id",
    accessorKey: "zoom_user_id",
    header: "Zoom User",
    meta: {
      className: columnWidths.zoomUser
    },
    cell: ({ row }) => {
      const zoomUserId = row.original.zoom_user_id
      if (!zoomUserId) {
        return <span className="text-muted-foreground">-</span>
      }
      return (
        <div className="flex items-center gap-1 group">
          <span className="truncate max-w-[150px] text-sm">{zoomUserId}</span>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="opacity-0 -translate-x-2 delay-200 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
          >
            <CopyButton text={zoomUserId} />
          </Button>
        </div>
      )
    }
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    header: "Created At",
    meta: {
      className: columnWidths.createdAt
    },
    cell: ({ row }) => (
      <div className="capitalize">{formatRelativeDate(row.original.created_at)}</div>
    )
  },
  {
    id: "actions",
    meta: {
      className: columnWidths.actions
    },
    cell: ({ row }) => <CredentialTableActions credential={row.original} />
  }
]
