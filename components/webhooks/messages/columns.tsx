"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRelativeDate } from "@/lib/date-helpers";
import type { WebhookMessage } from "@/lib/schemas/webhooks";

export const columns = (endpointId: string): ColumnDef<WebhookMessage>[] => [
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      if (row.original.status === "delivered") {
        return <Badge variant="success">Delivered</Badge>;
      } else {
        return <Badge variant="disabled">Failed</Badge>;
      }
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
