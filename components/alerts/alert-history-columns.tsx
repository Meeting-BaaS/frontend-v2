"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { formatRelativeDate } from "@/lib/date-helpers"
import type { AlertHistoryEntry } from "@/lib/schemas/alerts"

const columnWidths = {
  triggeredAt: "min-w-[140px] max-w-[220px] w-[25%]",
  currentValue: "min-w-[100px] max-w-[140px] w-[15%]",
  thresholdValue: "min-w-[100px] max-w-[140px] w-[15%]",
  suppressed: "min-w-[100px] max-w-[140px] w-[15%]",
  status: "min-w-[100px] max-w-[160px] w-[15%]"
} as const

export const alertHistoryColumns: ColumnDef<AlertHistoryEntry>[] = [
  {
    id: "triggeredAt",
    accessorKey: "triggeredAt",
    header: "Triggered",
    meta: {
      className: columnWidths.triggeredAt
    },
    cell: ({ row }) => (
      <div className="capitalize">{formatRelativeDate(row.original.triggeredAt)}</div>
    )
  },
  {
    id: "currentValue",
    accessorKey: "currentValue",
    header: "Current Value",
    meta: {
      className: columnWidths.currentValue
    }
  },
  {
    id: "thresholdValue",
    accessorKey: "thresholdValue",
    header: "Threshold",
    meta: {
      className: columnWidths.thresholdValue
    }
  },
  {
    id: "suppressed",
    accessorKey: "suppressedCount",
    header: "Suppressed",
    meta: {
      className: columnWidths.suppressed
    },
    cell: ({ row }) => {
      const count = row.original.suppressedCount
      return count > 0 ? (
        <Badge variant="secondary">{count}</Badge>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      )
    }
  },
  {
    id: "status",
    accessorKey: "deliveryStatus",
    header: "Status",
    meta: {
      className: columnWidths.status
    },
    cell: ({ row }) => {
      const { deliveryStatus } = row.original
      const allSuccess = deliveryStatus?.every((d) => d.success) ?? false

      return allSuccess ? (
        <Badge variant="success">Delivered</Badge>
      ) : (
        <Badge variant="destructive">Failed</Badge>
      )
    }
  }
]
