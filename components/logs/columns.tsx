"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Logs } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { formatRelativeDate } from "@/lib/date-helpers";
import type { ApiLogListEntry } from "@/lib/schemas/api-logs";

// Helper function to determine badge variant and color variant based on HTTP status
export const getStatusVariant = (
  status: number,
): {
  badge: "success" | "warning" | "destructive";
  color: string;
  className: string;
} => {
  if (status < 300) {
    return {
      badge: "success",
      color: "var(--color-green-300)",
      className: "text-green-500 fill-green-500",
    };
  }
  if (status <= 400) {
    return {
      badge: "warning",
      color: "var(--color-yellow-500)",
      className: "text-yellow-500 fill-yellow-500",
    };
  }
  return {
    badge: "destructive",
    color: "var(--color-red-500)",
    className: "text-red-500 fill-red-500",
  };
};

// Column width configuration shared between columns and skeleton
export const columnWidths = {
  endpoint: "min-w-[320px] max-w-[450px] w-[40%]",
  method: "min-w-[80px] max-w-[100px] w-[10%]",
  status: "min-w-[100px] max-w-[120px] w-[12%]",
  createdAt: "min-w-[140px] max-w-[150px] w-[15%]",
} as const;

export const columns: ColumnDef<ApiLogListEntry>[] = [
  {
    id: "endpoint",
    accessorKey: "endpoint",
    header: "Endpoint",
    meta: {
      className: columnWidths.endpoint,
    },
    cell: ({ row }) => {
      const variants = getStatusVariant(row.original.responseStatus);
      return (
        <div className="flex gap-1 items-center group">
          <Button variant="link" asChild className="p-0">
            <Link
              href={`/logs/${row.original.id}`}
              prefetch={false} // We don't need to prefetch the log details page
              className="flex gap-3 items-center decoration-dashed underline group-hover:decoration-baas-primary-500 group-hover:decoration-solid"
            >
              <GradientIcon color={variants.color}>
                <Logs />
              </GradientIcon>
              <span className="truncate max-w-sm">{row.original.endpoint}</span>
            </Link>
          </Button>
        </div>
      );
    },
  },
  {
    id: "method",
    accessorKey: "method",
    header: "Method",
    meta: {
      className: columnWidths.method,
    },
  },
  {
    id: "responseStatus",
    accessorKey: "responseStatus",
    header: "Status",
    meta: {
      className: columnWidths.status,
    },
    cell: ({ row }) => {
      const variants = getStatusVariant(row.original.responseStatus);
      return (
        <Badge variant={variants.badge}>{row.original.responseStatus}</Badge>
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
