"use client";

import { format } from "date-fns";
import {
  AlertCircle,
  CheckCircle2,
  Circle,
  Clapperboard,
  Clock,
  FileText,
  Link as LinkIcon,
  Mic,
  MicOff,
  PlayCircle,
  Radio,
  Send,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { parseDateString } from "@/lib/date-helpers";
import type { BotStatus, BotStatusHistoryEntry } from "@/lib/schemas/bots";
import { cn } from "@/lib/utils";
import { botColorVariants } from "./columns";

interface StatusConfig {
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
  badgeVariant: "secondary" | "success" | "destructive" | "outline";
}

const statusConfigMap: Record<BotStatus, StatusConfig> = {
  // Waiting/Initial states - Gray
  queued: {
    icon: Clock,
    description: "Bot is queued and waiting to start",
    color: "var(--color-slate-500)",
    badgeVariant: "secondary",
  },
  joining_call: {
    icon: Send,
    description: "Bot is joining the meeting",
    color: "var(--color-slate-500)",
    badgeVariant: "secondary",
  },
  in_waiting_room: {
    icon: Clock,
    description: "Bot is waiting in the waiting room",
    color: "var(--color-slate-500)",
    badgeVariant: "secondary",
  },

  // Active call states - Violet
  in_call_not_recording: {
    icon: Radio,
    description: "Bot is in the call but not recording yet",
    color: "var(--color-violet-500)",
    badgeVariant: "outline",
  },

  // Recording states - Green
  in_call_recording: {
    icon: Mic,
    description: "Bot is actively recording the meeting",
    color: "var(--color-green-500)",
    badgeVariant: "success",
  },
  recording_resumed: {
    icon: PlayCircle,
    description: "Recording has been resumed",
    color: "var(--color-green-500)",
    badgeVariant: "success",
  },
  recording_succeeded: {
    icon: Clapperboard,
    description: "Recording completed successfully",
    color: "var(--color-green-500)",
    badgeVariant: "success",
  },

  // Paused/Warning states - Amber
  recording_paused: {
    icon: MicOff,
    description: "Recording has been paused",
    color: "var(--color-amber-500)",
    badgeVariant: "outline",
  },
  waiting_room_timeout: {
    icon: AlertCircle,
    description: "Waiting room timeout occurred",
    color: "var(--color-amber-500)",
    badgeVariant: "outline",
  },

  // Processing state - Violet
  transcribing: {
    icon: FileText,
    description: "Transcribing the recorded audio",
    color: "var(--color-violet-500)",
    badgeVariant: "outline",
  },

  // Success/Completion - Blue
  completed: {
    icon: CheckCircle2,
    description: "Bot has completed all tasks successfully",
    color: "var(--color-blue-500)",
    badgeVariant: "success",
  },

  // Ended states - Slate
  call_ended: {
    icon: Circle,
    description: "The call has ended",
    color: "var(--color-slate-500)",
    badgeVariant: "secondary",
  },

  // Error/Rejected states - Red/Destructive
  failed: {
    icon: XCircle,
    description: "Bot operation failed",
    color: "var(--color-red-500)",
    badgeVariant: "destructive",
  },
  recording_failed: {
    icon: XCircle,
    description: "Recording failed",
    color: "var(--color-red-500)",
    badgeVariant: "destructive",
  },
  bot_rejected: {
    icon: XCircle,
    description: "Bot was rejected from the meeting",
    color: "var(--color-red-500)",
    badgeVariant: "destructive",
  },
  bot_removed: {
    icon: XCircle,
    description: "Bot was removed from the meeting",
    color: "var(--color-red-500)",
    badgeVariant: "destructive",
  },
  invalid_meeting_url: {
    icon: LinkIcon,
    description: "Invalid meeting URL provided",
    color: "var(--color-red-500)",
    badgeVariant: "destructive",
  },
  meeting_error: {
    icon: AlertCircle,
    description: "An error occurred with the meeting",
    color: "var(--color-red-500)",
    badgeVariant: "destructive",
  },
};

interface StatusHistoryProps {
  statusHistory: BotStatusHistoryEntry[];
}

export function StatusHistory({ statusHistory }: StatusHistoryProps) {
  return (
    <TooltipProvider>
      <ScrollArea className="w-full rounded-md border border-dashed bg-dots">
        <div className="relative flex w-max gap-12 p-8 z-10">
          <span
            className="pointer-events-none absolute left-16 top-1/2 mt-[0.30rem] h-0.5 w-[calc(100%-8rem)] -translate-y-8 select-none bg-muted"
            aria-hidden="true"
          />
          {statusHistory.map((entry, index) => {
            const config = statusConfigMap[entry.status as BotStatus];
            if (!config) return null;

            const Icon = config.icon;
            const updatedAt = parseDateString(entry.updatedAt);

            return (
              <div
                key={`${entry.status}-${entry.updatedAt}-${index}`}
                className="relative flex min-w-[6rem] shrink-0 flex-col items-center justify-center gap-2"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="group flex flex-col items-center justify-center gap-2 rounded-lg outline-hidden cursor-default"
                      aria-label={`${entry.status} - ${config.description}`}
                    >
                      <div className="relative z-20 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition duration-150 ease-in-out group-focus-visible:border-slate-8">
                        <GradientIcon
                          color={config.color}
                          className="flex items-center justify-center"
                          size="md"
                        >
                          <Icon className="size-5" />
                        </GradientIcon>
                      </div>
                      <div className="bg-background">
                        <Badge
                          className={cn(
                            "capitalize",
                            botColorVariants({ status: entry.status }),
                          )}
                        >
                          {entry.status.split("_").join(" ")}
                        </Badge>
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    {config.description}{" "}
                    {entry.message ? `: ${entry.message}` : ""}
                  </TooltipContent>
                </Tooltip>
                <span className="text-xs text-muted-foreground font-normal text-center whitespace-nowrap">
                  {format(updatedAt, "MMM d, h:mm a")}
                </span>
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </TooltipProvider>
  );
}
