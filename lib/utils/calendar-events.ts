import type { CalendarEventListItem } from "@/lib/schemas/calendars";
import type { CalendarEvent } from "@/types/calendars.types";

/**
 * Map API event to calendar event format
 */
export function mapApiEventToCalendarEvent(
  apiEvent: CalendarEventListItem,
): CalendarEvent {
  // Check if event is all-day (starts and ends at midnight)
  const startDate = new Date(apiEvent.start_time);
  const endDate = new Date(apiEvent.end_time);
  const isAllDay =
    startDate.getHours() === 0 &&
    startDate.getMinutes() === 0 &&
    endDate.getHours() === 23 &&
    endDate.getMinutes() === 59;

  return {
    id: apiEvent.event_id,
    title: apiEvent.title,
    description: undefined, // API doesn't provide description in list view
    start: startDate,
    end: endDate,
    allDay: isAllDay,
    location: undefined, // API doesn't provide location in list view
    // Additional fields from API
    event_id: apiEvent.event_id,
    calendar_id: apiEvent.calendar_id,
    status: apiEvent.status,
    is_exception: apiEvent.is_exception,
    meeting_url: apiEvent.meeting_url,
    meeting_platform: apiEvent.meeting_platform,
    bot_scheduled: apiEvent.bot_scheduled,
    created_at: apiEvent.created_at,
  };
}
