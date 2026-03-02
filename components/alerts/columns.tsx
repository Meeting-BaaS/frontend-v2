"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Bell } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GradientIcon } from "@/components/ui/gradient-icon"
import { formatRelativeDate } from "@/lib/date-helpers"
import { ALERT_TYPE_LABELS, type AlertRule, getAlertCategory, OPERATOR_LABELS } from "@/lib/schemas/alerts"

export const columnWidths = {
  name: "min-w-[200px] max-w-[350px] w-[30%]",
  type: "min-w-[150px] max-w-[200px] w-[18%]",
  condition: "min-w-[120px] max-w-[180px] w-[15%]",
  status: "min-w-[100px] max-w-[130px] w-[12%]",
  cooldown: "min-w-[100px] max-w-[130px] w-[12%]",
  createdAt: "min-w-[130px] max-w-[200px] w-[13%]"
} as const

export const columns: ColumnDef<AlertRule>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
    meta: { className: columnWidths.name },
    cell: ({ row }) => (
      <div className="flex gap-1 items-center group">
        <Button variant="link" asChild className="p-0">
          <Link
            href={`/alerts/${row.original.uuid}`}
            className="flex gap-3 items-center decoration-dashed underline group-hover:decoration-baas-primary-500 group-hover:decoration-solid"
          >
            <GradientIcon
              color={
                row.original.enabled ? "var(--color-rose-300)" : "var(--color-gray-300)"
              }
            >
              <Bell />
            </GradientIcon>
            <span className="truncate max-w-xs">{row.original.name}</span>
          </Link>
        </Button>
      </div>
    )
  },
  {
    id: "type",
    accessorKey: "alertType",
    header: "Metric",
    meta: { className: columnWidths.type },
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-sm">
          {ALERT_TYPE_LABELS[row.original.alertType] || row.original.alertType}
        </span>
        <span className="text-[0.65rem] text-muted-foreground capitalize">
          {getAlertCategory(row.original.alertType)}
        </span>
      </div>
    )
  },
  {
    id: "condition",
    accessorKey: "value",
    header: "Condition",
    meta: { className: columnWidths.condition },
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {OPERATOR_LABELS[row.original.operator] || row.original.operator} {row.original.value}
      </span>
    )
  },
  {
    id: "status",
    accessorKey: "enabled",
    header: "Status",
    meta: { className: columnWidths.status },
    cell: ({ row }) =>
      row.original.enabled ? (
        <Badge variant="success">Enabled</Badge>
      ) : (
        <Badge variant="disabled">Disabled</Badge>
      )
  },
  {
    id: "cooldown",
    accessorKey: "cooldownMinutes",
    header: "Cooldown",
    meta: { className: columnWidths.cooldown },
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.original.cooldownMinutes}m</span>
    )
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created At",
    meta: { className: columnWidths.createdAt },
    cell: ({ row }) => (
      <div className="capitalize">{formatRelativeDate(row.original.createdAt)}</div>
    )
  }
]
