"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { VariantProps } from "class-variance-authority";
import { Badge, type badgeVariants } from "@/components/ui/badge";
import { formatDurationBetweenDates, formatRelativeDate } from "@/lib/date-helpers";
import type { WebhookMessageAttempt } from "@/lib/schemas/webhooks";

// Attempt status map (same enum as message status from SVIX)
const statusMap: Record<
  number,
  { label: string; variant: VariantProps<typeof badgeVariants>["variant"] }
> = {
  0: { label: "Success", variant: "success" },
  1: { label: "Pending", variant: "secondary" },
  2: { label: "Failed", variant: "destructive" },
  3: { label: "Sending", variant: "outline" },
};

const triggerTypeMap: Record<number, string> = {
  0: "Scheduled",
  1: "Manual",
};

export const columnWidths = {
  index: "w-[5%] min-w-[40px]",
  trigger: "w-[10%] min-w-[80px]",
  timestamp: "w-[18%] min-w-[140px]",
  backoff: "w-[8%] min-w-[60px]",
  statusCode: "w-[10%] min-w-[80px]",
  duration: "w-[10%] min-w-[70px]",
  status: "w-[10%] min-w-[80px]",
  response: "w-[29%] min-w-[160px]",
} as const;

export const columns: ColumnDef<WebhookMessageAttempt>[] = [
  {
    id: "attemptNumber",
    accessorKey: "attemptNumber",
    header: "#",
    meta: { className: columnWidths.index },
  },
  {
    id: "trigger",
    accessorKey: "triggerType",
    header: "Trigger",
    meta: { className: columnWidths.trigger },
    cell: ({ row }) => triggerTypeMap[row.original.triggerType] ?? "Unknown",
  },
  {
    id: "timestamp",
    accessorKey: "timestamp",
    header: "Created At",
    meta: { className: columnWidths.timestamp },
    cell: ({ row }) => (
      <span className="capitalize">
        {formatRelativeDate(row.original.timestamp)}
      </span>
    ),
  },
  {
    id: "backoff",
    header: "Backoff",
    meta: { className: columnWidths.backoff },
    cell: ({ row, table }) => {
      const rows = table.getRowModel().rows;
      const prevRow = rows[row.index - 1];
      const backoff = formatDurationBetweenDates(
        prevRow?.original.timestamp,
        row.original.timestamp,
      );
      return backoff ?? <span className="text-muted-foreground">-</span>;
    },
  },
  {
    id: "statusCode",
    accessorKey: "responseStatusCode",
    header: "Status Code",
    meta: { className: columnWidths.statusCode },
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.responseStatusCode}</span>
    ),
  },
  {
    id: "duration",
    accessorKey: "responseDurationMs",
    header: "Duration",
    meta: { className: columnWidths.duration },
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.responseDurationMs}ms</span>
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    meta: { className: columnWidths.status },
    cell: ({ row }) => {
      const info = statusMap[row.original.status] ?? {
        label: "Unknown",
        variant: "outline" as const,
      };
      return <Badge variant={info.variant}>{info.label}</Badge>;
    },
  },
  {
    id: "response",
    accessorKey: "response",
    header: "Response",
    meta: { className: columnWidths.response },
    cell: ({ row }) => (
      <span
        className="truncate block max-w-[200px]"
        title={row.original.response}
      >
        {row.original.response || (
          <span className="text-muted-foreground">-</span>
        )}
      </span>
    ),
  },
];
