"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { formatRelativeDate } from "@/lib/date-helpers";
import {
  moduleLabels,
  type SupportTicket,
  statusLabels,
} from "@/lib/schemas/support";

// Column width configuration
export const columnWidths = {
  ticketId: "min-w-[150px] max-w-[180px] w-[20%]",
  module: "min-w-[100px] max-w-[130px] w-[12%]",
  status: "min-w-[100px] max-w-[130px] w-[12%]",
  subject: "min-w-[180px] max-w-[300px] w-[28%]",
  createdAt: "min-w-[120px] max-w-[150px] w-[14%]",
  resolvedAt: "min-w-[120px] max-w-[150px] w-[14%]",
} as const;

export const statusColors: Record<SupportTicket["status"], string> = {
  open: "bg-amber-500/10 text-amber-500 fill-amber-500 var(--color-amber-500)",
  in_progress:
    "bg-green-500/10 text-green-500 fill-green-500 var(--color-green-500)",
  awaiting_client:
    "bg-purple-500/10 text-purple-500 fill-purple-500 var(--color-purple-500)",
  awaiting_agent:
    "bg-green-500/10 text-green-500 fill-green-500 var(--color-green-500)",
  resolved: "bg-blue-500/10 text-blue-500 fill-blue-500 var(--color-blue-500)",
  closed: "bg-blue-500/10 text-blue-500 fill-blue-500 var(--color-blue-500)",
};

export const columns = (showResolved: boolean): ColumnDef<SupportTicket>[] => [
  {
    id: "ticketId",
    accessorKey: "ticketId",
    header: "Ticket ID",
    meta: {
      className: columnWidths.ticketId,
    },
    cell: ({ row }) => {
      const color = statusColors[row.original.status].split(" ")[3];
      return (
        <div className="flex gap-1 items-center group">
          <Button variant="link" asChild className="p-0">
            <Link
              href={`/support-center/${row.original.ticketId}`}
              className="flex gap-3 items-center decoration-dashed underline group-hover:decoration-baas-primary-500 group-hover:decoration-solid"
            >
              <GradientIcon color={color}>
                <MessageSquare />
              </GradientIcon>
              <span className="truncate max-w-lg">{row.original.ticketId}</span>
            </Link>
          </Button>
          <div>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="opacity-0 -translate-x-2 delay-200 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
            >
              <CopyButton text={row.original.ticketId} />
            </Button>
          </div>
        </div>
      );
    },
  },
  {
    id: "module",
    accessorKey: "module",
    header: "Module",
    meta: {
      className: columnWidths.module,
    },
    cell: ({ row }) => {
      return moduleLabels[row.original.module];
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    meta: {
      className: columnWidths.status,
    },
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge className={statusColors[status]}>{statusLabels[status]}</Badge>
      );
    },
  },
  {
    id: "subject",
    accessorKey: "subject",
    header: "Subject",
    meta: {
      className: columnWidths.subject,
    },
    cell: ({ row }) => {
      return (
        <div className="truncate max-w-sm" title={row.original.subject}>
          {row.original.subject}
          {row.original.botUuid && (
            <div className="text-muted-foreground text-xs">
              Bot: {row.original.botUuid}
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created At",
    meta: {
      className: columnWidths.createdAt,
    },
    cell: ({ row }) => (
      <div className="capitalize">
        {formatRelativeDate(row.original.createdAt)}
      </div>
    ),
  },
  ...(showResolved
    ? [
        {
          id: "resolvedAt",
          accessorKey: "resolvedAt",
          header: "Resolved At",
          meta: {
            className: columnWidths.resolvedAt,
          },
          cell: ({ row }: { row: Row<SupportTicket> }) =>
            row.original.resolvedAt ? (
              <div className="capitalize">
                {formatRelativeDate(row.original.resolvedAt)}
              </div>
            ) : (
              <span className="text-muted-foreground">-</span>
            ),
        },
      ]
    : []),
];
