"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { VariantProps } from "class-variance-authority";
import Link from "next/link";
import { Badge, type badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRelativeDate } from "@/lib/date-helpers";
import type { WebhookMessage } from "@/lib/schemas/webhooks";

// Message Status Map from SVIX (https://api.svix.com/docs#tag/Message-Attempt/operation/v1.message-attempt.list-by-endpoint.query.status)
const statusMap: Record<
  number,
  { label: string; variant: VariantProps<typeof badgeVariants>["variant"] }
> = {
  0: {
    label: "Delivered",
    variant: "success",
  },
  1: {
    label: "Pending",
    variant: "secondary",
  },
  2: {
    label: "Failed",
    variant: "destructive",
  },
  3: {
    label: "Sending",
    variant: "outline",
  },
};

// Column width configuration
export const columnWidths = {
  status: "min-w-[120px] max-w-[150px] w-[14%]",
  eventType: "min-w-[160px] max-w-[280px] w-[28%]",
  messageId: "min-w-[200px] max-w-[320px] w-[32%]",
  createdAt: "min-w-[140px] max-w-[260px] w-[26%]",
} as const;

export const columns = (endpointId: string): ColumnDef<WebhookMessage>[] => [
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    meta: {
      className: columnWidths.status,
    },
    cell: ({ row }) => {
      return (
        <Badge
          variant={
            statusMap[row.original.status as keyof typeof statusMap].variant
          }
        >
          {statusMap[row.original.status as keyof typeof statusMap].label}
        </Badge>
      );
    },
  },
  {
    id: "eventType",
    accessorKey: "eventType",
    header: "Event type",
    meta: {
      className: columnWidths.eventType,
    },
    cell: ({ row }) => {
      return (
        <Button variant="link" asChild className="p-0">
          <Link
            href={`/webhooks/${endpointId}/${row.original.id}`}
            prefetch={false} // Disable prefetching for these links to save on server-side requests
            className="flex gap-3 items-center decoration-dashed underline hover:decoration-baas-primary-500 hover:decoration-solid"
          >
            {row.original.eventType}
          </Link>
        </Button>
      );
    },
  },
  {
    id: "messageId",
    accessorKey: "id",
    header: "Message ID",
    meta: {
      className: columnWidths.messageId,
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
