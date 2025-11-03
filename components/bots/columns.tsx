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
import { formatDuration, formatRelativeDate } from "@/lib/date-helpers";
import type { BotListEntry } from "@/lib/schemas/bots";
import { cn } from "@/lib/utils";

export const botColorVariants = cva("", {
  variants: {
    status: {
      // Waiting/Initial states - Gray
      queued: "bg-slate-500/10 text-slate-500 fill-slate-500",
      joining_call: "bg-slate-500/10 text-slate-500 fill-slate-500",
      in_waiting_room: "bg-slate-500/10 text-slate-500 fill-slate-500",

      // Active call states - Violet
      in_call_not_recording: "bg-violet-500/10 text-violet-500 fill-violet-500",

      // Recording states - Green
      in_call_recording: "bg-green-500/10 text-green-500 fill-green-500",
      recording_resumed: "bg-green-500/10 text-green-500 fill-green-500",
      recording_succeeded: "bg-green-500/10 text-green-500 fill-green-500",

      // Paused/Warning states - Amber
      recording_paused: "bg-amber-500/10 text-amber-500 fill-amber-500",
      waiting_room_timeout: "bg-amber-500/10 text-amber-500 fill-amber-500",

      // Processing state - Violet
      transcribing: "bg-violet-500/10 text-violet-500 fill-violet-500",

      // Success/Completion - Blue
      completed: "bg-blue-500/10 text-blue-500 fill-blue-500",

      // Ended states - Slate
      call_ended: "bg-slate-500/10 text-slate-500 fill-slate-500",

      // Error/Rejected states - Red/Destructive
      failed: "bg-red-500/10 text-red-500 fill-red-500",
      recording_failed: "bg-red-500/10 text-red-500 fill-red-500",
      bot_rejected: "bg-red-500/10 text-red-500 fill-red-500",
      bot_removed: "bg-red-500/10 text-red-500 fill-red-500",
      invalid_meeting_url: "bg-red-500/10 text-red-500 fill-red-500",
      meeting_error: "bg-red-500/10 text-red-500 fill-red-500",
    },
  },
  defaultVariants: {
    status: "queued",
  },
});

// Column width configuration shared between columns and skeleton
export const columnWidths = {
  botUuid: "min-w-[320px] max-w-[400px] w-[40%]",
  status: "min-w-[120px] max-w-[150px] w-[15%]",
  botName: "min-w-[160px] max-w-[180px] w-[18%]",
  duration: "min-w-[100px] max-w-[120px] w-[12%]",
  createdAt: "min-w-[140px] max-w-[150px] w-[15%]",
} as const;

export const columns: ColumnDef<BotListEntry>[] = [
  {
    id: "botUuid",
    accessorKey: "botUuid",
    header: "Bot UUID",
    meta: {
      className: columnWidths.botUuid,
    },
    cell: ({ row }) => {
      return (
        <div className="flex gap-1 items-center group">
          <Button variant="link" asChild className="p-0">
            <Link
              href={`/bots/${row.original.botUuid}`}
              prefetch={false} // Disable prefetching for these links to save on server-side requests
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
              <span className="truncate max-w-sm">{row.original.botUuid}</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="opacity-0 -translate-x-2 delay-200 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
          >
            <CopyButton text={row.original.botUuid} />
          </Button>
        </div>
      );
    },
  },
  {
    id: "latestStatus",
    accessorKey: "latestStatus",
    header: "Status",
    meta: {
      className: columnWidths.status,
    },
    cell: ({ row }) => {
      return (
        <Badge
          className={cn(
            "capitalize",
            botColorVariants({ status: row.original.latestStatus }),
          )}
        >
          {row.original.latestStatus.split("_").join(" ")}
        </Badge>
      );
    },
  },
  {
    id: "botName",
    accessorKey: "botName",
    header: "Bot Name",
    meta: {
      className: columnWidths.botName,
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
