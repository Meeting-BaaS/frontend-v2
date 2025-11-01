import {
  array,
  boolean,
  iso,
  number,
  object,
  type output,
  preprocess,
  record,
  string,
  enum as zodEnum,
  unknown as zodUnknown,
} from "zod";
import { isDateBefore } from "@/lib/date-helpers";

export const meetingPlatformSchema = zodEnum(["zoom", "meet", "teams"]);

// All possible bot statuses
export const botStatusSchema = zodEnum([
  "pending",
  "joining_call",
  "in_waiting_room",
  "in_call_not_recording",
  "in_call_recording",
  "recording_paused",
  "recording_resumed",
  "call_ended",
  "bot_rejected",
  "bot_removed",
  "waiting_room_timeout",
  "invalid_meeting_url",
  "meeting_error",
  "recording_succeeded",
  "recording_failed",
  "transcribing",
  "completed",
  "failed",
]);

export const ListBotsRequestQuerySchema = object({
  botUuid: string().nullable().default(null),
  createdBefore: iso.datetime().nullable().default(null),
  createdAfter: iso.datetime().nullable().default(null),
  cursor: preprocess(
    (value) => {
      if (value == null || value === "") return null;
      if (typeof value !== "string") return value;

      try {
        // Check for "-" prefix indicating backward pagination
        const isPrevDirection = value.startsWith("-");
        const cursorValue = isPrevDirection ? value.slice(1) : value;

        const decoded = Buffer.from(cursorValue, "base64").toString("utf8");
        const parts = decoded.split("::");
        if (parts.length !== 2) {
          return value; // Let schema validation handle the error
        }
        return {
          createdAt: parts[0],
          id: parts[1] ? Number.parseInt(parts[1], 10) : null,
          isPrevDirection,
        };
      } catch {
        // Return original value to let schema validation handle the error
        return value;
      }
    },
    object({
      createdAt: iso.datetime(),
      id: number().int().positive(),
      isPrevDirection: boolean().default(false),
    })
      .nullable()
      .default(null),
  ),
  meetingPlatform: preprocess((value) => {
    if (value == null) return null;
    if (typeof value === "string") {
      return value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }
    return value;
  }, array(meetingPlatformSchema).min(1).nullable().default(null)),
  status: preprocess((value) => {
    if (value == null) return null;
    if (typeof value === "string") {
      return value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }
    return value;
  }, array(botStatusSchema).min(1).nullable().default(null)),
})
  .refine(
    (data) => {
      // Only validate if both dates are provided
      if (data.createdAfter && data.createdBefore) {
        return isDateBefore(data.createdAfter, data.createdBefore);
      }
      return true;
    },
    {
      message: "createdAfter must be before createdBefore",
      path: ["createdAfter"],
    },
  )
  .nullable();

export const botListEntry = object({
  botUuid: string(),
  botName: string(),
  meetingUrl: string(),
  meetingPlatform: meetingPlatformSchema,
  extra: record(string(), zodUnknown()).nullable(),
  duration: number().nullable(),
  createdAt: iso.datetime(),
  endedAt: iso.datetime().nullable(),
  joinedAt: iso.datetime().nullable(),
  exitedAt: iso.datetime().nullable(),
  latestStatus: botStatusSchema,
});

export const botsListResponseSchema = object({
  data: array(botListEntry),
  success: boolean(),
  cursor: string().nullable(),
  prevCursor: string().nullable(),
});

export type MeetingPlatform = output<typeof meetingPlatformSchema>;
export type BotStatus = output<typeof botStatusSchema>;
export type ListBotsRequestQueryParams = output<
  typeof ListBotsRequestQuerySchema
>;
export type BotListEntry = output<typeof botListEntry>;
export type BotsListResponse = output<typeof botsListResponseSchema>;
