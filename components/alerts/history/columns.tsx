"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { formatRelativeDate } from "@/lib/date-helpers";
import type { AlertHistoryRecord } from "@/lib/schemas/alerts";

function getSuppressedCount(payload: unknown): number {
  if (!payload || typeof payload !== "object") return 0;
  const p = payload as Record<string, unknown>;
  return typeof p.suppressedCount === "number" ? p.suppressedCount : 0;
}

export const columnWidths = {
  triggeredAt: "min-w-[130px] max-w-[180px] w-[16%]",
  ruleName: "min-w-[120px] max-w-[200px] w-[16%]",
  message: "min-w-[150px] max-w-[260px] w-[22%]",
  suppressed: "min-w-[80px] max-w-[100px] w-[8%]",
  channel: "min-w-[80px] max-w-[110px] w-[9%]",
  status: "min-w-[80px] max-w-[110px] w-[9%]",
  destination: "min-w-[140px] max-w-[260px] w-[20%]",
} as const;

export const historyColumns: ColumnDef<AlertHistoryRecord>[] = [
  {
    id: "triggeredAt",
    accessorKey: "triggeredAt",
    header: "Triggered At",
    meta: { className: columnWidths.triggeredAt },
    cell: ({ row }) => (
      <div className="capitalize">
        {formatRelativeDate(row.original.triggeredAt)}
      </div>
    ),
  },
  {
    id: "ruleName",
    accessorKey: "ruleName",
    header: "Rule",
    meta: { className: columnWidths.ruleName },
    cell: ({ row }) => (
      <span className="truncate">{row.original.ruleName}</span>
    ),
  },
  {
    id: "message",
    accessorKey: "message",
    header: "Message",
    meta: { className: columnWidths.message },
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground truncate">
        {row.original.message || "-"}
      </span>
    ),
  },
  {
    id: "suppressed",
    header: "Suppressed",
    meta: { className: columnWidths.suppressed },
    cell: ({ row }) => {
      const count = getSuppressedCount(row.original.payload);
      return (
        <span className="text-sm text-muted-foreground tabular-nums">
          {count}
        </span>
      );
    },
  },
  {
    id: "channel",
    accessorKey: "channel",
    header: "Channel",
    meta: { className: columnWidths.channel },
    cell: ({ row }) => (
      <Badge variant="secondary" className="capitalize">
        {row.original.channel}
      </Badge>
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    meta: { className: columnWidths.status },
    cell: ({ row }) =>
      row.original.status === "delivered" ? (
        <Badge variant="success">Delivered</Badge>
      ) : (
        <Badge variant="destructive">Failed</Badge>
      ),
  },
  {
    id: "destination",
    header: "Destination",
    meta: { className: columnWidths.destination },
    cell: ({ row }) => {
      if (row.original.channel === "email" && row.original.emailTo) {
        return (
          <span className="text-sm text-muted-foreground truncate">
            {row.original.emailTo}
          </span>
        );
      }
      if (row.original.channel === "webhook" && row.original.httpStatus) {
        return (
          <span className="text-sm text-muted-foreground">
            HTTP {row.original.httpStatus}
          </span>
        );
      }
      if (row.original.error) {
        return (
          <span className="text-sm text-destructive truncate">
            {row.original.error}
          </span>
        );
      }
      return <span className="text-sm text-muted-foreground">-</span>;
    },
  },
];
