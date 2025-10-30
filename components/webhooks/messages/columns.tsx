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

export const columns = (endpointId: string): ColumnDef<WebhookMessage>[] => [
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
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
    cell: ({ row }) => {
      return (
        <Button variant="link" asChild className="p-0">
          <Link
            href={`/webhooks/${endpointId}/${row.original.id}`}
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
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <div className="capitalize">
        {formatRelativeDate(row.original.createdAt)}
      </div>
    ),
  },
];
