"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TeamAvatar } from "@/components/ui/team-avatar";
import { formatRelativeDate } from "@/lib/date-helpers";
import type { AdminTeamListItem } from "@/lib/schemas/admin";

export const columnWidths = {
  team: "min-w-[200px] max-w-[300px] w-[30%]",
  plan: "min-w-[100px] max-w-[150px] w-[15%]",
  lastBotCreatedAt: "min-w-[140px] max-w-[180px] w-[20%]",
  createdAt: "min-w-[140px] max-w-[180px] w-[20%]",
} as const;

export const columns: ColumnDef<AdminTeamListItem>[] = [
  {
    id: "team",
    accessorKey: "teamName",
    header: "Team",
    meta: {
      className: columnWidths.team,
    },
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 items-center">
          {row.original.teamLogo ? (
            <div className="relative flex aspect-square size-8 items-center justify-center overflow-hidden rounded-lg border">
              <Image
                src={row.original.teamLogo}
                alt={row.original.teamName}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
          ) : (
            <TeamAvatar
              name={row.original.teamName}
              size="md"
              className="size-8"
            />
          )}
          <Button variant="link" asChild className="p-0">
            <Link
              href={`/admin/teams/${row.original.teamId}`}
              prefetch={false}
              className="decoration-dashed underline hover:decoration-baas-primary-500 hover:decoration-solid"
            >
              {row.original.teamName}
            </Link>
          </Button>
        </div>
      );
    },
  },
  {
    id: "plan",
    accessorKey: "subscriptionPlan",
    header: "Subscription Plan",
    meta: {
      className: columnWidths.plan,
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.original.subscriptionPlan}</div>
    ),
  },
  {
    id: "lastBotCreatedAt",
    accessorKey: "lastBotCreatedAt",
    header: "Last Bot Created",
    meta: {
      className: columnWidths.lastBotCreatedAt,
    },
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.lastBotCreatedAt ? (
          formatRelativeDate(row.original.lastBotCreatedAt)
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </div>
    ),
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
