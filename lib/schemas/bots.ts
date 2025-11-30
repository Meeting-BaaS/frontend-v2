import {
  array,
  boolean,
  discriminatedUnion,
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
import { CursorSchema } from "@/lib/schemas/common";

export const meetingPlatformSchema = zodEnum(["zoom", "meet", "teams"]);
export const recordingModeSchema = zodEnum([
  "audio_only",
  "speaker_view",
  "gallery_view",
]);
export const speechToTextProviderSchema = zodEnum([
  "gladia",
  "assembly",
  "none",
]);

// All possible bot statuses (event codes)
// These are the event_code values sent by bots to /bot-process/update-status
export const botStatusSchema = zodEnum([
  // Backend-set statuses
  "queued", // Set by backend when bot is created
  "transcribing", // Set by backend during transcription processing
  "completed", // Set by backend after successful processing
  "failed", // Set by backend after failure processing

  // Normal flow statuses (sent by both bots)
  "joining_call", // Sent by bots when starting to join
  "in_waiting_room", // Sent by bots when in waiting room
  "in_waiting_for_host", // Sent by zoom-bot when waiting for host
  "in_call_not_recording", // Sent by bots when in call but not recording yet
  "in_call_recording", // Sent by bots when recording starts
  "recording_paused", // Sent by meet-teams-bot when recording is paused
  "recording_resumed", // Sent by meet-teams-bot when recording resumes
  "call_ended", // Sent by bots when call ends
  "recording_succeeded", // Sent by bots when recording completes successfully
  "recording_failed", // Sent by bots when recording fails

  // Intermediate error statuses (sent by meet-teams-bot before recording_failed)
  // These are informational and all eventually lead to recording_failed
  "api_request_stop", // Sent by meet-teams-bot when stopped via API
  "bot_rejected", // Sent by meet-teams-bot when bot is rejected
  "bot_removed", // Sent by meet-teams-bot when bot is removed
  "bot_removed_too_early", // Sent by meet-teams-bot when bot removed too early
  "waiting_room_timeout", // Sent by meet-teams-bot when waiting room times out
  "invalid_meeting_url", // Sent by meet-teams-bot when meeting URL is invalid
  "meeting_error", // Sent by meet-teams-bot for general meeting errors
]);

const artifactTypeSchema = zodEnum([
  "audio",
  "video",
  "diarization",
  "raw_transcription",
  "transcription",
  "screenshots",
]);

const artifactErrorCodeSchema = zodEnum([
  "FILE_NOT_FOUND",
  "UPLOAD_FAILED",
  "FILE_TOO_SMALL",
  "UNKNOWN_ERROR",
  "NOT_SUPPORTED",
]);

// Artifact schema (snake_case to match BFF API)
const artifactSchema = object({
  s3_key: string().nullable(),
  file_path: string(),
  extension: string(),
  uploaded: boolean(),
  uploaded_at: iso.datetime().nullable(),
  type: artifactTypeSchema,
  error_code: artifactErrorCodeSchema.nullable(),
  error_message: string().nullable(),
});

export const artifactWithSignedUrlSchema = artifactSchema.extend({
  signed_url: string().nullable(),
});

// Frontend query params (camelCase for URL/search params)
export const ListBotsRequestQuerySchema = object({
  botUuid: string().nullable().default(null),
  createdBefore: iso.datetime().nullable().default(null),
  createdAfter: iso.datetime().nullable().default(null),
  cursor: CursorSchema,
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

// Bot list entry (snake_case to match BFF API)
export const botListEntry = object({
  bot_id: uuid(),
  bot_name: string(),
  meeting_url: url(),
  meeting_platform: meetingPlatformSchema,
  extra: record(string(), zodUnknown()).nullable(),
  duration: number().nullable(),
  created_at: iso.datetime(),
  ended_at: iso.datetime().nullable(),
  joined_at: iso.datetime().nullable(),
  exited_at: iso.datetime().nullable(),
  status: botStatusSchema,
  error_code: string().nullable(),
  error_message: string().nullable(),
});

export const botsListResponseSchema = object({
  data: array(botListEntry),
  success: boolean(),
  cursor: string().nullable(),
  prev_cursor: string().nullable(),
});

// Bot status history entry (snake_case to match BFF API)
export const botStatusHistoryEntry = object({
  status: botStatusSchema,
  updated_at: iso.datetime(),
  error_code: string().nullable(),
  error_message: string().nullable(),
});

export const callbackErrorSchema = object({
  status_code: number()
    .nullable()
    .describe("Status code if the callback failed"),
  error: string().describe("Error code if the callback failed"),
  message: string().describe(
    "Human-readable error message if the callback failed",
  ),
  attempted_at: iso
    .datetime()
    .describe("ISO 8601 timestamp when the callback was attempted"),
  retries_attempted: number()
    .nullable()
    .describe("Number of retries attempted"),
});

// Bot details schema (snake_case to match BFF API)
export const botDetailsSchema = object({
  bot_name: string(),
  meeting_url: string(),
  meeting_platform: meetingPlatformSchema,
  recording_mode: recordingModeSchema,
  speech_to_text_provider: speechToTextProviderSchema,
  extra: record(string(), zodUnknown()).nullable(),
  total_tokens: string().nullable(),
  recording_tokens: string().nullable(),
  transcription_tokens: string().nullable(),
  byok_transcription_tokens: string().nullable(),
  streaming_input_tokens: string().nullable(),
  streaming_output_tokens: string().nullable(),
  duration: string().nullable(),
  created_at: iso.datetime(),
  ended_at: iso.datetime().nullable(),
  joined_at: iso.datetime().nullable(),
  exited_at: iso.datetime().nullable(),
  status: botStatusSchema,
  status_history: array(botStatusHistoryEntry).nullable(),
  callback_error: callbackErrorSchema.nullable(),
  has_screenshots: boolean(),
  transcription_failures: number(),
  diarization_failures: number(),
  video_upload_failures: number(),
  audio_upload_failures: number(),
  logs_upload_failures: number(),
  artifacts: array(artifactWithSignedUrlSchema).nullable(),
  artifacts_deleted: boolean(),
  errors: array(record(string(), zodUnknown())).nullable(),
  updated_at: iso.datetime(),
  transcription_ids: array(string()).nullable(),
});

export const botDetailsResponseSchema = object({
  data: botDetailsSchema,
  success: boolean(),
});

export type MeetingPlatform = output<typeof meetingPlatformSchema>;
export type RecordingMode = output<typeof recordingModeSchema>;
export type SpeechToTextProvider = output<typeof speechToTextProviderSchema>;
export type BotStatus = output<typeof botStatusSchema>;
export type ListBotsRequestQueryParams = output<
  typeof ListBotsRequestQuerySchema
>;
export type BotListEntry = output<typeof botListEntry>;
export type BotsListResponse = output<typeof botsListResponseSchema>;
export type BotDetails = output<typeof botDetailsSchema>;
export type BotStatusHistoryEntry = output<typeof botStatusHistoryEntry>;
export type BotDetailsResponse = output<typeof botDetailsResponseSchema>;
export type Artifact = output<typeof artifactSchema>;
export type ArtifactWithSignedUrl = output<typeof artifactWithSignedUrlSchema>;
export type CallbackError = output<typeof callbackErrorSchema>;

// Retry callback form schema (for dialog) - discriminated union
export const retryCallbackFormSchema = discriminatedUnion("useOverride", [
  object({
    useOverride: literal(true),
    url: url("Callback URL must be a valid URL"),
    method: zodEnum(["POST", "PUT"]),
    secret: string().optional(),
  }),
  object({
    useOverride: literal(false),
  }),
]);

export type RetryCallbackFormData = output<typeof retryCallbackFormSchema>;

// Screenshot schemas
export const botScreenshotSchema = object({
  screenshot_id: number().int().positive(),
  url: url(),
});

export const getBotScreenshotsRequestQuerySchema = object({
  limit: number().int().positive().max(250).default(50).optional(),
  cursor: string().nullable().default(null),
});

export const getBotScreenshotsResponseSchema = object({
  success: literal(true),
  data: array(botScreenshotSchema),
  cursor: string().nullable(),
  prev_cursor: string().nullable(),
});

export type BotScreenshot = output<typeof botScreenshotSchema>;
export type GetBotScreenshotsRequestQuery = output<
  typeof getBotScreenshotsRequestQuerySchema
>;
export type GetBotScreenshotsResponse = output<
  typeof getBotScreenshotsResponseSchema
>;
