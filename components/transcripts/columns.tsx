"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { cva } from "class-variance-authority";
import { Eye } from "lucide-react";
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

// Provider color variants for consistent branding
export const providerColorVariants = cva("", {
  variants: {
    provider: {
      gladia: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      assembly: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      assemblyai: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      deepgram: "bg-green-500/10 text-green-500 border-green-500/20",
      "azure-stt": "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
      "openai-whisper": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      speechmatics: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      none: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    },
  },
  defaultVariants: {
    provider: "none",
  },
});

// Provider display names
const providerNames: Record<string, string> = {
  gladia: "Gladia",
  assembly: "AssemblyAI",
  assemblyai: "AssemblyAI",
  deepgram: "Deepgram",
  "azure-stt": "Azure STT",
  "openai-whisper": "OpenAI Whisper",
  speechmatics: "Speechmatics",
  none: "None",
};

export const columnWidths = {
  bot_id: "min-w-[300px] max-w-[380px] w-[35%]",
  provider: "min-w-[140px] max-w-[160px] w-[16%]",
  bot_name: "min-w-[160px] max-w-[180px] w-[18%]",
  duration: "min-w-[100px] max-w-[120px] w-[12%]",
  created_at: "min-w-[140px] max-w-[150px] w-[14%]",
  actions: "min-w-[80px] max-w-[100px] w-[10%]",
} as const;

export const columns: ColumnDef<BotListEntry>[] = [
  {
    id: "bot_id",
    accessorKey: "bot_id",
    header: "Bot ID",
    meta: {
      className: columnWidths.bot_id,
    },
    cell: ({ row }) => {
      return (
        <div className="flex gap-1 items-center group">
          <Button variant="link" asChild className="p-0">
            <Link
              href={`/bots/${row.original.bot_id}`}
              prefetch={false}
              className="flex gap-3 items-center decoration-dashed underline group-hover:decoration-baas-primary-500 group-hover:decoration-solid"
            >
              <GradientIcon color="var(--color-background)">
                {row.original.meeting_platform === "zoom" ? (
                  <ZoomLogo />
                ) : row.original.meeting_platform === "meet" ? (
                  <GoogleMeetLogo />
                ) : (
                  <MicrosoftTeamsLogo />
                )}
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
    id: "provider",
    accessorKey: "speech_to_text_provider",
    header: "Provider",
    meta: {
      className: columnWidths.provider,
    },
    cell: ({ row }) => {
      const provider = row.original.speech_to_text_provider || "none";
      return (
        <Badge
          variant="outline"
          className={cn(providerColorVariants({ provider: provider as any }))}
        >
          {providerNames[provider] || provider}
        </Badge>
      );
    },
  },
  {
    id: "bot_name",
    accessorKey: "bot_name",
    header: "Bot Name",
    meta: {
      className: columnWidths.bot_name,
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
    accessorKey: "created_at",
    header: "Created At",
    meta: {
      className: columnWidths.created_at,
    },
    cell: ({ row }) => (
      <div className="capitalize">
        {formatRelativeDate(row.original.created_at)}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">View</div>,
    meta: {
      className: columnWidths.actions,
    },
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/viewer/${row.original.bot_id}`} target="_blank">
            <Eye className="size-4" />
          </Link>
        </Button>
      </div>
    ),
  },
];
