import {
  array,
  boolean,
  iso,
  literal,
  number,
  object,
  type output,
  preprocess,
  record,
  string,
  url,
  uuid,
  enum as zodEnum,
  unknown as zodUnknown,
} from "zod";
import { isDateBefore } from "@/lib/date-helpers";
import {
  meetingPlatformSchema,
  recordingModeSchema,
  speechToTextProviderSchema,
} from "@/lib/schemas/bots";
import { CursorSchema } from "@/lib/schemas/common";

export const scheduledBotStatusSchema = zodEnum([
  "scheduled",
  "cancelled",
  "completed",
  "failed",
]);

export const callbackMethodSchema = zodEnum(["POST", "PUT"]);

export const ListScheduledBotsRequestQuerySchema = object({
  cursor: CursorSchema,
  botUuid: string().nullable().default(null),
  meetingUrl: string().nullable().default(null),
  scheduledBefore: iso.datetime().nullable().default(null),
  scheduledAfter: iso.datetime().nullable().default(null),
  meetingPlatform: preprocess((value) => {
    if (value == null) return null;
    if (typeof value === "string") {
      return value
        .split(",")
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);
    }
    return value;
  }, array(meetingPlatformSchema).min(1).nullable().default(null)),
  status: preprocess((value) => {
    if (value == null) return null;
    if (typeof value === "string") {
      return value
        .split(",")
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);
    }
    return value;
  }, array(scheduledBotStatusSchema).min(1).nullable().default(null)),
})
  .refine(
    (data) => {
      if (data.scheduledAfter && data.scheduledBefore) {
        return isDateBefore(data.scheduledAfter, data.scheduledBefore);
      }
      return true;
    },
    {
      message: "scheduledAfter must be before scheduledBefore",
      path: ["scheduledAfter"],
    },
  )
  .nullable();

export const scheduledBotListEntrySchema = object({
  bot_id: uuid(),
  bot_name: string(),
  meeting_url: url(),
  meeting_platform: meetingPlatformSchema,
  join_at: iso.datetime(),
  status: scheduledBotStatusSchema,
  created_at: iso.datetime(),
  updated_at: iso.datetime(),
});

export const scheduledBotsListResponseSchema = object({
  success: boolean(),
  data: array(scheduledBotListEntrySchema),
  cursor: string().nullable(),
  prev_cursor: string().nullable(),
});

const timeoutConfigSchema = object({
  waiting_room_timeout: number().int().nullable(),
  no_one_joined_timeout: number().int().nullable(),
});

const transcriptionConfigSchema = object({
  enabled: literal(true),
  provider: speechToTextProviderSchema,
  custom_params: record(string(), zodUnknown()).nullable(),
});

const streamingConfigSchema = object({
  enabled: literal(true),
  input_url: string().nullable(),
  output_url: string().nullable(),
  audio_frequency: number().int().nullable(),
});

const callbackConfigSchema = object({
  enabled: literal(true),
  url: string(),
  secret: string().nullable(),
  method: callbackMethodSchema,
});

export const scheduledBotDetailsSchema = object({
  bot_id: uuid(),
  bot_name: string(),
  bot_image: string().nullable(),
  meeting_url: url(),
  meeting_platform: meetingPlatformSchema,
  recording_mode: recordingModeSchema,
  join_at: iso.datetime(),
  status: scheduledBotStatusSchema,
  created_at: iso.datetime(),
  updated_at: iso.datetime(),
  cancelled_at: iso.datetime().nullable(),
  allow_multiple_bots: boolean(),
  entry_message: string().nullable(),
  timeout_config: timeoutConfigSchema,
  transcription_config: transcriptionConfigSchema.nullable(),
  streaming_config: streamingConfigSchema.nullable(),
  callback_config: callbackConfigSchema.nullable(),
  extra: record(string(), zodUnknown()).nullable(),
});

export const scheduledBotDetailsResponseSchema = object({
  success: boolean(),
  data: scheduledBotDetailsSchema,
});

export type ScheduledBotStatus = output<typeof scheduledBotStatusSchema>;
export type ListScheduledBotsRequestQueryParams = output<
  typeof ListScheduledBotsRequestQuerySchema
>;
export type ScheduledBotListEntry = output<typeof scheduledBotListEntrySchema>;
export type ScheduledBotsListResponse = output<
  typeof scheduledBotsListResponseSchema
>;
export type ScheduledBotDetails = output<typeof scheduledBotDetailsSchema>;
export type ScheduledBotDetailsResponse = output<
  typeof scheduledBotDetailsResponseSchema
>;
