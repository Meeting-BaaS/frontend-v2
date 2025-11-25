"use client";

import { differenceInMinutes, format, getMinutes, isPast } from "date-fns";
import { Bot } from "lucide-react";
import { useMemo } from "react";
import { EventHoverCard } from "@/components/calendars/event-calendar/event-hover-card";
import { cn } from "@/lib/utils";
import {
  getBorderRadiusClasses,
  getEventColorClasses,
} from "@/lib/utils/calendar-helpers";
import type { CalendarEvent, CalendarView } from "@/types/calendars.types";

const formatTimeWithOptionalMinutes = (date: Date) => {
  return format(date, getMinutes(date) === 0 ? "ha" : "h:mma").toLowerCase();
};

interface EventWrapperProps {
  event: CalendarEvent;
  isFirstDay?: boolean;
  isLastDay?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  children: React.ReactNode;
}

function EventWrapper({
  event,
  isFirstDay = true,
  isLastDay = true,
  onClick,
  className,
  children,
}: EventWrapperProps) {
  const isEventInPast = isPast(new Date(event.end));

  return (
    <EventHoverCard event={event}>
      <button
        type="button"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex h-full w-full items-center gap-1 overflow-hidden px-1 text-left font-medium backdrop-blur-md transition outline-none select-none focus-visible:ring-[3px] data-past-event:line-through sm:px-2",
          getEventColorClasses(event),
          getBorderRadiusClasses(isFirstDay, isLastDay),
          className,
        )}
        data-past-event={isEventInPast || undefined}
        onClick={onClick}
      >
        {children}
      </button>
    </EventHoverCard>
  );
}

interface EventItemProps {
  event: CalendarEvent;
  view: CalendarView;
  onClick?: (e: React.MouseEvent) => void;
  showTime?: boolean;
  isFirstDay?: boolean;
  isLastDay?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function EventItem({
  event,
  view,
  onClick,
  showTime,
  isFirstDay = true,
  isLastDay = true,
  className,
  children,
}: EventItemProps) {
  const displayStart = useMemo(() => new Date(event.start), [event.start]);
  const displayEnd = useMemo(() => new Date(event.end), [event.end]);

  const durationMinutes = useMemo(() => {
    return differenceInMinutes(displayEnd, displayStart);
  }, [displayStart, displayEnd]);

  const getEventTime = () => {
    if (event.allDay) return "All day";

    if (durationMinutes < 45) {
      return formatTimeWithOptionalMinutes(displayStart);
    }

    return `${formatTimeWithOptionalMinutes(displayStart)} - ${formatTimeWithOptionalMinutes(displayEnd)}`;
  };

  if (view === "month") {
    return (
      <EventWrapper
        event={event}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
        onClick={onClick}
        className={cn(
          "mt-[var(--event-gap)] h-[var(--event-height)] items-center text-[10px] sm:text-[13px]",
          className,
        )}
      >
        {children || (
          <>
            <span className="truncate flex-1 min-w-0">
              {!event.allDay && (
                <span className="truncate sm:text-xs font-normal opacity-70 uppercase">
                  {formatTimeWithOptionalMinutes(displayStart)}{" "}
                </span>
              )}
              {event.title}
            </span>
            {event.bot_scheduled && (
              <Bot
                className="size-3 flex-shrink-0 ml-auto"
                aria-label="Bot scheduled"
              />
            )}
          </>
        )}
      </EventWrapper>
    );
  }

  if (view === "week" || view === "day") {
    return (
      <EventWrapper
        event={event}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
        onClick={onClick}
        className={cn(
          "py-1",
          durationMinutes < 45 ? "items-center" : "flex-col",
          view === "week" ? "text-[10px] sm:text-[13px]" : "text-[13px]",
          className,
        )}
      >
        {durationMinutes < 45 ? (
          <div className="flex items-center gap-1 w-full min-w-0">
            <div className="truncate flex-1">
              {event.title}{" "}
              {showTime && (
                <span className="opacity-70">
                  {formatTimeWithOptionalMinutes(displayStart)}
                </span>
              )}
            </div>
            {event.bot_scheduled && (
              <Bot
                className="size-3 flex-shrink-0 ml-auto"
                aria-label="Bot scheduled"
              />
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center gap-1 w-full min-w-0">
              <div className="truncate font-medium flex-1">{event.title}</div>
              {event.bot_scheduled && (
                <Bot
                  className="size-3 flex-shrink-0 ml-auto"
                  aria-label="Bot scheduled"
                />
              )}
            </div>
            {showTime && (
              <div className="truncate flex w-full font-normal opacity-70 sm:text-xs uppercase">
                {getEventTime()}
              </div>
            )}
          </>
        )}
      </EventWrapper>
    );
  }

  return null;
}
