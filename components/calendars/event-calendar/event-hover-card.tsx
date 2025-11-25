"use client";

import { format } from "date-fns";
import { Bot, Calendar, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";
import { GoogleMeetLogo } from "@/components/icons/google-meet";
import { MicrosoftTeamsLogo } from "@/components/icons/microsoft-teams";
import { ZoomLogo } from "@/components/icons/zoom";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { CalendarEvent } from "@/types/calendars.types";

interface EventHoverCardProps {
  event: CalendarEvent;
  children: React.ReactNode;
}

function getPlatformIcon(platform: string | null) {
  if (platform === "zoom") {
    return <ZoomLogo className="size-3" />;
  }
  if (platform === "meet") {
    return <GoogleMeetLogo className="size-3" />;
  }
  if (platform === "teams") {
    return <MicrosoftTeamsLogo className="size-3" />;
  }
  return null;
}

export function EventHoverCard({ event, children }: EventHoverCardProps) {
  const startDate = new Date(event.start);
  const endDate = new Date(event.end);

  const dateStr = format(startDate, "PPP");
  const timeStr = event.allDay
    ? "All day"
    : `${format(startDate, "h:mm a")} - ${format(endDate, "h:mm a")}`;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-2 px-2">
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <Calendar className="size-3" />
            <span>{dateStr}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <Clock className="size-3" />
            <span>{timeStr}</span>
          </div>
          {event.bot_scheduled && (
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Bot className="size-3" />
              <span>Bot Scheduled</span>
            </div>
          )}
          {event.meeting_url && (
            <Button
              variant="link"
              asChild
              className="h-auto p-0 text-sm has-[>svg]:px-0"
              size="sm"
            >
              <Link
                href={event.meeting_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                {getPlatformIcon(event.meeting_platform)}
                Join meeting
                <ExternalLink className="size-3" />
              </Link>
            </Button>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
