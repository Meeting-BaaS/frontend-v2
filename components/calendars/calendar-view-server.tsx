import { cookies } from "next/headers";
import { CalendarView } from "@/components/calendars/calendar-view";
import { axiosGetInstance } from "@/lib/api-client";
import { LIST_CALENDAR_EVENTS } from "@/lib/api-routes";
import {
  type CalendarEventsListResponse,
  calendarEventsListResponseSchema,
} from "@/lib/schemas/calendars";

interface CalendarViewServerProps {
  calendarId: string;
}

export async function CalendarViewServer({
  calendarId,
}: CalendarViewServerProps) {
  const cookieStore = await cookies();

  // Fetch events for the calendar
  // For now, we'll fetch a reasonable range (e.g., past 30 days to future 90 days)
  const now = new Date();
  const startTime = new Date(now);
  startTime.setDate(startTime.getDate() - 30);
  const endTime = new Date(now);
  endTime.setDate(endTime.getDate() + 90);

  let allEvents: CalendarEventsListResponse["data"] = [];
  let cursor: string | null = null;

  // Fetch all events with pagination
  let response: CalendarEventsListResponse;
  do {
    response = await axiosGetInstance<CalendarEventsListResponse>(
      LIST_CALENDAR_EVENTS(calendarId),
      calendarEventsListResponseSchema,
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
        params: {
          cursor: cursor ?? null,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          status: null,
          show_cancelled: false,
          limit: 250,
        },
      },
    );

    allEvents = [...allEvents, ...response.data];
    cursor = response.cursor;
  } while (cursor);

  return <CalendarView events={allEvents} calendarId={calendarId} />;
}
