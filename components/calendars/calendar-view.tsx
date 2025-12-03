"use client";

import { useMemo } from "react";
import { EventCalendar } from "@/components/calendars/event-calendar/event-calendar";
import { CalendarProvider } from "@/contexts/calendar-context";
import type { CalendarEventListItem } from "@/lib/schemas/calendars";
import { mapApiEventToCalendarEvent } from "@/lib/utils/calendar-events";

interface CalendarViewProps {
  events: CalendarEventListItem[];
  calendarId: string;
}

export function CalendarView({
  events,
  calendarId: _calendarId,
}: CalendarViewProps) {
  const calendarEvents = useMemo(() => {
    return events.map(mapApiEventToCalendarEvent);
  }, [events]);

  return (
    <CalendarProvider initialView="month">
      <EventCalendar events={calendarEvents} />
    </CalendarProvider>
  );
}
