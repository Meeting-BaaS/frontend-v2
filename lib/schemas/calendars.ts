import {
  array,
  boolean,
  iso,
  literal,
  object,
  type output,
  preprocess,
  string,
  uuid,
  enum as zodEnum,
} from "zod";
import { meetingPlatformSchema } from "@/lib/schemas/bots";
import { CursorSchema } from "@/lib/schemas/common";

export const calendarPlatformSchema = zodEnum(["google", "microsoft"]);

export const calendarConnectionStatusSchema = zodEnum([
  "active",
  "error",
  "revoked",
  "permission_denied",
]);

export const subscriptionStatusSchema = zodEnum([
  "active",
  "error",
  "revoked",
  "permission_denied",
]);

export const ListCalendarsRequestQuerySchema = object({
  cursor: CursorSchema,
  email: string().nullable().default(null),
  calendarPlatform: preprocess((value) => {
    if (value == null) return null;
    if (typeof value === "string") {
      return value
        .split(",")
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);
    }
    return value;
  }, array(calendarPlatformSchema).min(1).nullable().default(null)),
  status: preprocess((value) => {
    if (value == null) return null;
    if (typeof value === "string") {
      return value
        .split(",")
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);
    }
    return value;
  }, array(calendarConnectionStatusSchema).min(1).nullable().default(null)),
}).nullable();

export const calendarListEntrySchema = object({
  calendar_id: uuid(),
  calendar_platform: calendarPlatformSchema,
  account_email: string(),
  status: calendarConnectionStatusSchema,
  subscription_status: subscriptionStatusSchema.nullable(),
  synced_at: iso.datetime().nullable(),
  created_at: iso.datetime(),
});

export const calendarsListResponseSchema = object({
  success: literal(true),
  data: array(calendarListEntrySchema),
  cursor: string().nullable(),
  prev_cursor: string().nullable(),
});

// Calendar Event Schemas
export const calendarEventStatusSchema = zodEnum([
  "confirmed",
  "cancelled",
  "tentative",
]);

export const ListCalendarEventsRequestQuerySchema = object({
  cursor: CursorSchema,
  start_time: iso.datetime().nullable().default(null),
  end_time: iso.datetime().nullable().default(null),
  status: preprocess((value) => {
    if (value == null) return null;
    if (typeof value === "string") {
      return value
        .split(",")
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);
    }
    return value;
  }, array(calendarEventStatusSchema).min(1).nullable().default(null)),
  show_cancelled: boolean().nullable().default(null),
}).nullable();

export const calendarEventListItemSchema = object({
  event_id: uuid(),
  title: string(),
  start_time: iso.datetime(),
  end_time: iso.datetime(),
  status: calendarEventStatusSchema,
  is_exception: boolean(),
  meeting_url: string().nullable(),
  meeting_platform: meetingPlatformSchema.nullable(),
  calendar_id: uuid(),
  bot_scheduled: boolean(),
  created_at: iso.datetime(),
});

export const calendarEventsListResponseSchema = object({
  success: literal(true),
  data: array(calendarEventListItemSchema),
  cursor: string().nullable(),
  prev_cursor: string().nullable(),
});

export type CalendarPlatform = output<typeof calendarPlatformSchema>;
export type CalendarConnectionStatus = output<
  typeof calendarConnectionStatusSchema
>;
export type SubscriptionStatus = output<typeof subscriptionStatusSchema>;
export type ListCalendarsRequestQueryParams = output<
  typeof ListCalendarsRequestQuerySchema
>;
export type CalendarListEntry = output<typeof calendarListEntrySchema>;
export type CalendarsListResponse = output<typeof calendarsListResponseSchema>;
export type CalendarEventStatus = output<typeof calendarEventStatusSchema>;
export type MeetingPlatform = output<typeof meetingPlatformSchema>;
export type ListCalendarEventsRequestQueryParams = output<
  typeof ListCalendarEventsRequestQuerySchema
>;
export const calendarDetailsSchema = object({
  calendar_id: uuid(),
  calendar_platform: calendarPlatformSchema,
  account_email: string(),
  status: calendarConnectionStatusSchema,
  status_message: string().nullable(),
  subscription_status: subscriptionStatusSchema.nullable(),
  subscription_id: string().nullable(),
  subscription_expires_at: iso.datetime().nullable(),
  synced_at: iso.datetime().nullable(),
  created_at: iso.datetime(),
  updated_at: iso.datetime().nullable(),
});

export const calendarDetailsResponseSchema = object({
  success: literal(true),
  data: calendarDetailsSchema,
});

export type CalendarEventListItem = output<typeof calendarEventListItemSchema>;
export type CalendarEventsListResponse = output<
  typeof calendarEventsListResponseSchema
>;
export type CalendarDetails = output<typeof calendarDetailsSchema>;
export type CalendarDetailsResponse = output<
  typeof calendarDetailsResponseSchema
>;
