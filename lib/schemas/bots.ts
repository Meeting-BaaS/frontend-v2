import {
  array,
  boolean,
  iso,
  number,
  object,
  type output,
  record,
  string,
  enum as zodEnum,
  unknown as zodUnknown,
} from "zod";

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
export type BotListEntry = output<typeof botListEntry>;
export type BotsListResponse = output<typeof botsListResponseSchema>;
