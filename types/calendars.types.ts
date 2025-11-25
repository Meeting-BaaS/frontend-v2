import type { MeetingPlatform } from "@/lib/schemas/bots";

export type CalendarView = "month" | "week" | "day";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  label?: string;
  location?: string;
  // Additional fields from API
  event_id: string;
  calendar_id: string;
  status: "confirmed" | "cancelled" | "tentative";
  deleted: boolean;
  is_exception: boolean;
  meeting_url: string | null;
  meeting_platform: MeetingPlatform | null;
  bot_scheduled: boolean;
  created_at: string;
}
