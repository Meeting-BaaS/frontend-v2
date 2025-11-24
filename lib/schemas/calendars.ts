import {
  array,
  iso,
  literal,
  object,
  type output,
  preprocess,
  string,
  uuid,
  enum as zodEnum,
} from "zod";
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
