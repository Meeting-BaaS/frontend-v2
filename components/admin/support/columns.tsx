"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { statusColors } from "@/components/support/columns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { formatRelativeDate } from "@/lib/date-helpers";
import type { AdminSupportTicketListItem } from "@/lib/schemas/admin";
import { moduleLabels, statusLabels } from "@/lib/schemas/support";

export const columnWidths = {
  ticketId: "min-w-[150px] max-w-[180px] w-[20%]",
  teamName: "min-w-[120px] max-w-[150px] w-[15%]",
  module: "min-w-[100px] max-w-[130px] w-[12%]",
  status: "min-w-[100px] max-w-[130px] w-[12%]",
  subject: "min-w-[180px] max-w-[300px] w-[28%]",
  createdAt: "min-w-[120px] max-w-[150px] w-[13%]",
} as const;

export const columns: ColumnDef<AdminSupportTicketListItem>[] = [
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
              href={`/admin/support/${row.original.ticketId}`}
              className="flex gap-3 items-center decoration-dashed underline group-hover:decoration-baas-primary-500 group-hover:decoration-solid"
            >
              <GradientIcon color={color}>
                <MessageSquare />
              </GradientIcon>
              <span className="truncate max-w-lg">{row.original.ticketId}</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="opacity-0 -translate-x-2 delay-200 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
          >
            <CopyButton text={row.original.ticketId} />
          </Button>
        </div>
      );
    },
  },
  {
    id: "teamName",
    accessorKey: "teamName",
    header: "Team Name",
    meta: {
      className: columnWidths.teamName,
    },
    cell: ({ row }) => {
      return (
        <Button variant="link" asChild className="p-0">
          <Link
            href={`/admin/teams/${row.original.teamId}`}
            prefetch={false}
            className="decoration-dashed underline hover:decoration-baas-primary-500 hover:decoration-solid"
          >
            {row.original.teamName}
          </Link>
        </Button>
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
];
