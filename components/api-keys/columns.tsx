"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Info, KeyRound } from "lucide-react";
import Link from "next/link";
import { TableActions } from "@/components/api-keys/table-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { GradientIcon } from "@/components/ui/gradient-icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatRelativeDate, parseDateString } from "@/lib/date-helpers";
import { type ApiKey, permissionMap } from "@/lib/schemas/api-keys";

// Adding created At to the slug to avoid exposing API key ID which is incremented sequentially
// Just a redundancy, as the endpoint is protected.
const generateApiKeySlug = (id: number, createdAt: Date): string => {
  const timestamp = createdAt.getTime();
  return `${id}A${timestamp}`;
};

// Column width configuration
export const columnWidths = {
  name: "min-w-[280px] max-w-[320px] w-[32%]",
  start: "min-w-[120px] max-w-[150px] w-[15%]",
  permissions: "min-w-[160px] max-w-[200px] w-[20%]",
  lastRequest: "min-w-[100px] max-w-[120px] w-[12%]",
  createdAt: "min-w-[120px] max-w-[150px] w-[15%]",
  actions: "min-w-[100px] max-w-[100px] w-[6%]",
} as const;

export const columns: ColumnDef<ApiKey>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
    meta: {
      className: columnWidths.name,
    },
    cell: ({ row }) => {
      return (
        <div className="flex gap-1 items-center group">
          <Button variant="link" asChild className="p-0">
            <Link
              href={`/api-keys/${generateApiKeySlug(Number(row.original.id), parseDateString(row.original.createdAt))}`}
              className="flex gap-3 items-center decoration-dashed underline group-hover:decoration-baas-primary-500 group-hover:decoration-solid"
            >
              <GradientIcon color="var(--color-orange-300)">
                <KeyRound />
              </GradientIcon>
              <span className="truncate max-w-sm">{row.original.name}</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="opacity-0 -translate-x-2 delay-200 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
          >
            <CopyButton text={row.original.name} />
          </Button>
        </div>
      );
    },
  },
  {
    id: "start",
    accessorKey: "start",
    header: "Token",
    meta: {
      className: columnWidths.start,
    },
    cell: ({ row }) => {
      return <Badge variant="secondary">{row.original.start}...</Badge>;
    },
  },
  {
    id: "permissions",
    accessorFn: (row) => {
      const permissions = row.permissions.access.join("_");
      return permissionMap[permissions];
    },
    header: "Permission",
    meta: {
      className: columnWidths.permissions,
    },
  },
  {
    id: "lastRequest",
    accessorKey: "lastRequest",
    header: "Last Used",
    meta: {
      className: columnWidths.lastRequest,
    },
    cell: ({ row }) => {
      const value = row.original.lastRequest;
      if (!value) {
        const isOlderThanDay =
          Date.now() - new Date(row.original.createdAt).getTime() >
          24 * 60 * 60 * 1000;

        return (
          <div className="flex items-center gap-1">
            Never
            {isOlderThanDay && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-2xs">
                    <p>
                      This API has never been used. We recommend deleting any
                      API keys that are not in use to ensure that your account
                      remains secure.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        );
      }
      return <div className="capitalize">{formatRelativeDate(value)}</div>;
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
  {
    id: "actions",
    meta: {
      className: columnWidths.actions,
    },
    cell: ({ row }) => <TableActions apiKey={row.original} />,
  },
];
