"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Webhook } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { formatRelativeDate } from "@/lib/date-helpers";
import type { WebhookEndpoint } from "@/lib/schemas/webhooks";

export const columns: ColumnDef<WebhookEndpoint>[] = [
  {
    id: "url",
    accessorKey: "url",
    header: "Endpoint",
    cell: ({ row }) => {
      return (
        <div className="flex gap-1 items-center group">
          <Button variant="link" asChild className="p-0">
            <Link
              href={`/webhooks/${row.original.uuid}`}
              className="flex gap-3 items-center decoration-dashed underline group-hover:decoration-baas-primary-500 group-hover:decoration-solid"
            >
              <GradientIcon
                color={
                  row.original.enabled
                    ? "var(--color-green-300)"
                    : "var(--color-gray-300)"
                }
              >
                <Webhook />
              </GradientIcon>
              {row.original.url}
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="opacity-0 -translate-x-2 delay-200 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
          >
            <CopyButton text={row.original.url} />
          </Button>
        </div>
      );
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      if (row.original.enabled) {
        return <Badge variant="success">Enabled</Badge>;
      } else {
        return <Badge variant="disabled">Disabled</Badge>;
      }
    },
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
