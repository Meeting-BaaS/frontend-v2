"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { botColorVariants } from "@/components/bots/columns";
import { GoogleMeetLogo } from "@/components/icons/google-meet";
import { MicrosoftTeamsLogo } from "@/components/icons/microsoft-teams";
import { ZoomLogo } from "@/components/icons/zoom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { formatDuration, formatRelativeDate } from "@/lib/date-helpers";
import type { AdminBotListItem } from "@/lib/schemas/admin";
import { cn } from "@/lib/utils";

export const columnWidths = {
  bot_id: "w-[350px]",
  status: "min-w-[150px] max-w-[200px] w-[20%]",
  team_name: "min-w-[160px] max-w-[180px] w-[18%]",
  duration: "min-w-[100px] max-w-[120px] w-[12%]",
  created_at: "min-w-[140px] max-w-[150px] w-[15%]",
} as const;

export const columns: ColumnDef<AdminBotListItem>[] = [
  {
    id: "bot_id",
    accessorKey: "botId",
    header: "Bot ID",
    meta: {
      className: columnWidths.bot_id,
    },
    cell: ({ row }) => {
      return (
        <div className="flex gap-1 items-center group">
          <Button variant="link" asChild className="p-0">
            <Link
              href={`/admin/bots/${row.original.botId}`}
              prefetch={false}
              className="flex gap-3 items-center decoration-dashed underline group-hover:decoration-baas-primary-500 group-hover:decoration-solid"
            >
              <GradientIcon color="var(--color-background)">
                {row.original.meetingPlatform === "zoom" ? (
                  <ZoomLogo />
                ) : row.original.meetingPlatform === "meet" ? (
                  <GoogleMeetLogo />
                ) : (
                  <MicrosoftTeamsLogo />
                )}
              </GradientIcon>
              <span className="truncate max-w-sm">{row.original.botId}</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="opacity-0 -translate-x-2 delay-200 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
          >
            <CopyButton text={row.original.botId} />
          </Button>
        </div>
      );
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
      return (
        <Badge
          className={cn(
            "capitalize",
            botColorVariants({ status: row.original.status }),
          )}
        >
          {row.original.status.split("_").join(" ")}
        </Badge>
      );
    },
  },
  {
    id: "team_name",
    accessorKey: "teamName",
    header: "Team Name",
    meta: {
      className: columnWidths.team_name,
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
    id: "duration",
    accessorKey: "duration",
    header: () => <div className="text-center">Duration</div>,
    meta: {
      className: columnWidths.duration,
    },
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.duration ? (
          formatDuration(row.original.duration)
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </div>
    ),
  },
  {
    id: "created_at",
    accessorKey: "createdAt",
    header: "Created At",
    meta: {
      className: columnWidths.created_at,
    },
    cell: ({ row }) => (
      <div className="capitalize">
        {formatRelativeDate(row.original.createdAt)}
      </div>
    ),
  },
];
