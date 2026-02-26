"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Bell, Info } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GradientIcon } from "@/components/ui/gradient-icon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatRelativeDate } from "@/lib/date-helpers";
import { TableActions } from "@/components/alerts/table-actions";
import type { AlertRule } from "@/lib/schemas/alerts";
import {
  THRESHOLD_RESOURCE_LABELS,
  THRESHOLD_OPERATOR_LABELS,
  ALERT_EVENT_TYPE_LABELS,
} from "@/lib/schemas/alerts";

export const columnWidths = {
  name: "min-w-[200px] max-w-[300px] w-[25%]",
  type: "min-w-[90px] max-w-[120px] w-[10%]",
  condition: "min-w-[160px] max-w-[240px] w-[22%]",
  cooldown: "min-w-[90px] max-w-[120px] w-[10%]",
  suppressed: "min-w-[90px] max-w-[120px] w-[10%]",
  status: "min-w-[90px] max-w-[110px] w-[10%]",
  createdAt: "min-w-[120px] max-w-[160px] w-[11%]",
  actions: "min-w-[50px] max-w-[60px] w-[4%]",
} as const;

function formatCooldown(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h${mins}m` : `${hours}h`;
}

function getConditionLabel(rule: AlertRule): string {
  if (rule.type === "threshold") {
    const resource = THRESHOLD_RESOURCE_LABELS[rule.resource ?? ""] ?? rule.resource;
    const operator = THRESHOLD_OPERATOR_LABELS[rule.operator ?? ""] ?? rule.operator;
    return `${resource} ${operator} ${rule.threshold}`;
  }
  return ALERT_EVENT_TYPE_LABELS[rule.eventType ?? ""] ?? rule.eventType ?? "";
}

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
            href={`/alerts/${row.original.id}`}
            className="flex gap-3 items-center decoration-dashed underline group-hover:decoration-baas-primary-500 group-hover:decoration-solid"
          >
            <GradientIcon
              color={
                row.original.enabled
                  ? "var(--color-green-300)"
                  : "var(--color-gray-300)"
              }
            >
              <Bell />
            </GradientIcon>
            <span className="truncate max-w-xs">{row.original.name}</span>
          </Link>
        </Button>
      </div>
    ),
  },
  {
    id: "type",
    accessorKey: "type",
    header: "Type",
    meta: { className: columnWidths.type },
    cell: ({ row }) => (
      <Badge variant="secondary" className="capitalize">
        {row.original.type}
      </Badge>
    ),
  },
  {
    id: "condition",
    header: "Condition",
    meta: { className: columnWidths.condition },
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {getConditionLabel(row.original)}
      </span>
    ),
  },
  {
    id: "cooldown",
    accessorKey: "cooldownMinutes",
    header: "Cooldown",
    meta: { className: columnWidths.cooldown },
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatCooldown(row.original.cooldownMinutes)}
      </span>
    ),
  },
  {
    id: "suppressed",
    accessorKey: "suppressedCount",
    header: () => (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center gap-1 cursor-help">
            Suppressed
            <Info className="size-3.5 text-muted-foreground" />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[240px]">
          Alerts that matched but were skipped because the cooldown was still active. Resets each time the alert fires.
        </TooltipContent>
      </Tooltip>
    ),
    meta: { className: columnWidths.suppressed },
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground tabular-nums">
        {row.original.suppressedCount}
      </span>
    ),
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
      ),
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created At",
    meta: { className: columnWidths.createdAt },
    cell: ({ row }) => (
      <div className="capitalize">
        {formatRelativeDate(row.original.createdAt)}
      </div>
    ),
  },
  {
    id: "actions",
    header: "",
    meta: { className: columnWidths.actions },
    cell: ({ row }) => <TableActions rule={row.original} />,
  },
];
