"use client";

import type { ColumnDef, Row, Table } from "@tanstack/react-table";
import type { VariantProps } from "class-variance-authority";
import { Badge, type badgeVariants } from "@/components/ui/badge";
import { HoverCopyCard } from "@/components/ui/hover-copy-card";
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

/**
 * Computes the backoff duration for a scheduled attempt by finding the
 * previous scheduled attempt (filtered by triggerType, ordered by attemptNumber).
 * Returns null for manual resends or the first scheduled attempt.
 */
function getScheduledBackoff(
  row: Row<WebhookMessageAttempt>,
  table: Table<WebhookMessageAttempt>,
): string | null {
  if (row.original.triggerType === 1) return null;

  const scheduledAttempts = table
    .getRowModel()
    .rows.filter((r) => r.original.triggerType === 0)
    .sort((a, b) => a.original.attemptNumber - b.original.attemptNumber);

  const currentIdx = scheduledAttempts.findIndex((r) => r.id === row.id);
  const prevScheduled = currentIdx > 0 ? scheduledAttempts[currentIdx - 1] : undefined;

  return formatDurationBetweenDates(prevScheduled?.original.timestamp, row.original.timestamp);
}

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
      const backoff = getScheduledBackoff(row, table);
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
    cell: ({ row }) => {
      const response = row.original.response;
      if (!response) {
        return <span className="text-muted-foreground">-</span>;
      }

      return <HoverCopyCard text={response} title="Response Body" triggerClassName="max-w-[200px] ml-auto" />;
    },
  },
];
