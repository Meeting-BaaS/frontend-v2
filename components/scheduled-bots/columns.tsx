"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { cva } from "class-variance-authority";
import Link from "next/link";
import { GoogleMeetLogo } from "@/components/icons/google-meet";
import { MicrosoftTeamsLogo } from "@/components/icons/microsoft-teams";
import { ZoomLogo } from "@/components/icons/zoom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { formatISODateString, formatRelativeDate } from "@/lib/date-helpers";
import { formatScheduledBotStatus } from "@/lib/formatters/scheduled-bots";
import type { ScheduledBotListEntry } from "@/lib/schemas/scheduled-bots";
import { cn } from "@/lib/utils";

export const scheduledBotColumnWidths = {
  bot_id: "min-w-[320px] max-w-[400px] w-[40%]",
  status: "min-w-[120px] max-w-[150px] w-[15%]",
  bot_name: "min-w-[160px] max-w-[180px] w-[18%]",
  join_at: "min-w-[160px] max-w-[200px] w-[18%]",
  created_at: "min-w-[150px] max-w-[160px] w-[15%]",
} as const;

export const scheduledStatusVariants = cva("capitalize", {
  variants: {
    status: {
      scheduled: "bg-blue-500/10 text-blue-500 fill-blue-500",
      completed: "bg-green-500/10 text-green-500 fill-green-500",
      failed: "bg-red-500/10 text-red-500 fill-red-500",
      cancelled: "bg-amber-500/10 text-amber-500 fill-amber-500",
    },
  },
  defaultVariants: {
    status: "scheduled",
  },
});

const renderPlatformIcon = (
  platform: ScheduledBotListEntry["meeting_platform"],
) => {
  if (platform === "zoom") {
    return <ZoomLogo />;
  }
  if (platform === "meet") {
    return <GoogleMeetLogo />;
  }
  return <MicrosoftTeamsLogo />;
};

export const scheduledBotColumns: ColumnDef<ScheduledBotListEntry>[] = [
  {
    id: "bot_id",
    accessorKey: "bot_id",
    header: "Bot ID",
    meta: {
      className: scheduledBotColumnWidths.bot_id,
    },
    cell: ({ row }) => {
      return (
        <div className="flex gap-1 items-center group">
          <Button variant="link" asChild className="p-0">
            <Link
              href={`/scheduled-bots/${row.original.bot_id}`}
              prefetch={false}
              className="flex gap-3 items-center decoration-dashed underline group-hover:decoration-baas-primary-500 group-hover:decoration-solid"
            >
              <GradientIcon color="var(--color-background)">
                {renderPlatformIcon(row.original.meeting_platform)}
              </GradientIcon>
              <span className="truncate max-w-sm">{row.original.bot_id}</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="opacity-0 -translate-x-2 delay-200 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
          >
            <CopyButton text={row.original.bot_id} />
          </Button>
        </div>
      );
    },
  },
  {
    id: "join_at",
    accessorKey: "join_at",
    header: "Join Time",
    meta: {
      className: scheduledBotColumnWidths.join_at,
    },
    cell: ({ row }) => (
      <div>
        {formatISODateString(row.original.join_at, "MMM d, yyyy hh:mm a")}
      </div>
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    meta: {
      className: scheduledBotColumnWidths.status,
    },
    cell: ({ row }) => (
      <Badge
        className={cn(
          "capitalize",
          scheduledStatusVariants({ status: row.original.status }),
        )}
      >
        {formatScheduledBotStatus(row.original.status)}
      </Badge>
    ),
  },
  {
    id: "bot_name",
    accessorKey: "bot_name",
    header: "Bot Name",
    meta: {
      className: scheduledBotColumnWidths.bot_name,
    },
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    header: "Created",
    meta: {
      className: scheduledBotColumnWidths.created_at,
    },
    cell: ({ row }) => (
      <div className="capitalize">
        {formatRelativeDate(row.original.created_at)}
      </div>
    ),
  },
];
