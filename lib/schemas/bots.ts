import { BATCH_PROVIDERS } from "@meeting-baas/voice-router/providers"
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
  unknown as zodUnknown
} from "zod"
import { isDateBefore } from "@/lib/date-helpers"
import { CursorSchema } from "@/lib/schemas/common"

export const meetingPlatformSchema = zodEnum(["zoom", "meet", "teams"])
export const recordingModeSchema = zodEnum(["audio_only", "speaker_view", "gallery_view"])
// Derived from voice-router — single source of truth for provider lists
export const speechToTextProviderSchema = zodEnum([...BATCH_PROVIDERS, "none"])

// All possible resolved statuses (lifecycle statuses + error codes)
// Used by BFF/admin list endpoints where resolved_status is returned
export const botStatusSchema = zodEnum([
  // Backend-set statuses
  "queued", // Set by backend when bot is created
  "pickup_delayed", // Set by backend when pickup is delayed
  "transcribing", // Set by backend during transcription processing
  "completed", // Set by backend after successful processing
  "failed", // Set by backend after failure processing
  "transcription_failed", // Set by backend when transcription fails but recording succeeded
  "awaiting_reconciliation",

  // Normal flow statuses (sent by both bots)
  "joining_call",
  "in_waiting_room",
  "in_waiting_for_host",
  "in_call_not_recording",
  "in_call_recording",
  "recording_paused",
  "recording_resumed",
  "call_ended",
  "recording_succeeded",
  "recording_failed",

  // Intermediate error statuses
  "api_request_stop",
  "bot_rejected",
  "bot_removed",
  "bot_removed_too_early",
  "waiting_room_timeout",
  "invalid_meeting_url",
  "meeting_error",

  // Non-terminal retry status: a failed attempt is being re-queued (fresh pod /
  // fresh exit IP). Carries attempt/max in the status-history entry. A terminal
  // failure error code follows only if all retries are exhausted.
  "retrying",

  // Error codes (from resolved_status for failed bots)
  // Normal end reasons
  "BOT_REMOVED",
  "NO_ATTENDEES",
  "NO_SPEAKER",
  "RECORDING_TIMEOUT",
  "API_REQUEST",
  // Error end reasons
  "BOT_REMOVED_TOO_EARLY",
  "BOT_NOT_ACCEPTED",
  "CANNOT_JOIN_MEETING",
  "TIMEOUT_WAITING_TO_START",
  "INVALID_MEETING_URL",
  "STREAMING_SETUP_FAILED",
  "LOGIN_REQUIRED",
  "INTERNAL_ERROR",
  // Crash reasons
  "OOM_KILLED",
  "SIGTERM",
  "FORCE_KILLED",
  "GENERAL_ERROR",
  // Transcription errors
  "TRANSCRIPTION_FAILED",
  // Pre-recording stop (all bot types)
  "EXITING_MEETING_BEFORE_RECORD",
  // Zoom-specific errors
  "WAITING_FOR_HOST_TIMEOUT",
  "RECORDING_RIGHTS_NOT_GRANTED",
  "CANNOT_REQUEST_RECORDING_RIGHT",
  "MEETING_ENDED_PREMATURELY",
  "SET_ZOOM_ID_AND_PWD_TOGETHER",
  "CANNOT_GET_JWT_TOKEN",
  "SDK_AUTH_FAILED",
  "ZOOM_ACCESS_TOKEN_ERROR",
  "ZOOM_OBF_TOKEN_ERROR",
  "RECORDING_START_TIMEOUT",
  "HOST_CLIENT_CANNOT_GRANT_PERMISSION",
  "WAITING_FOR_AUTHORIZED_USER_TIMEOUT",
  "UNABLE_JOIN_EXTERNAL_MEETING",
  "ZOOM_ANONYMOUS_JOIN_NOT_ALLOWED",
  // Business errors
  "INSUFFICIENT_TOKENS",
  "DAILY_BOT_CAP_REACHED",
  "BOT_ALREADY_EXISTS",
  // Meet SAML SSO authenticated bot errors
  "MEET_LOGIN_UNAVAILABLE",
  "MEET_LOGIN_REQUIRED",
  "MEET_LOGIN_FAILED_SAML_REJECTED",
  "MEET_LOGIN_FAILED_TIMEOUT",
  "TEAMS_LOGIN_UNAVAILABLE",
  "TEAMS_LOGIN_REQUIRED",
  "TEAMS_LOGIN_FAILED_INVALID_CREDENTIALS",
  "TEAMS_LOGIN_FAILED_CAPTCHA",
  "TEAMS_LOGIN_FAILED_MFA_REQUIRED",
  "TEAMS_LOGIN_FAILED_TIMEOUT",
  // Unknown fallback
  "UNKNOWN_ERROR"
])

const artifactTypeSchema = zodEnum([
  "audio",
  "video",
  "diarization",
  "raw_transcription",
  "transcription",
  "screenshots",
  "chat_messages"
])

const artifactErrorCodeSchema = zodEnum([
  "FILE_NOT_FOUND",
  "UPLOAD_FAILED",
  "FILE_TOO_SMALL",
  "UNKNOWN_ERROR",
  "NOT_SUPPORTED"
])

// Artifact schema (snake_case to match BFF API)
const artifactSchema = object({
  s3_key: string().nullable(),
  file_path: string(),
  extension: string(),
  uploaded: boolean(),
  uploaded_at: iso.datetime().nullable(),
  type: artifactTypeSchema,
  error_code: artifactErrorCodeSchema.nullable(),
  error_message: string().nullable()
})

export const artifactWithSignedUrlSchema = artifactSchema.extend({
  signed_url: string().nullable()
})

// Frontend query params (camelCase for URL/search params)
export const ListBotsRequestQuerySchema = object({
  botUuid: string().nullable().default(null),
  createdBefore: iso.datetime().nullable().default(null),
  createdAfter: iso.datetime().nullable().default(null),
  cursor: CursorSchema,
  meetingPlatform: preprocess((value) => {
    if (value == null) return null
    if (typeof value === "string") {
      return value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    }
    return value
  }, array(meetingPlatformSchema).min(1).nullable().default(null)),
  status: preprocess((value) => {
    if (value == null) return null
    if (typeof value === "string") {
      return value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    }
    return value
  }, array(botStatusSchema).min(1).nullable().default(null))
})
  .refine(
    (data) => {
      // Only validate if both dates are provided
      if (data.createdAfter && data.createdBefore) {
        return isDateBefore(data.createdAfter, data.createdBefore)
      }
      return true
    },
    {
      message: "createdAfter must be before createdBefore",
      path: ["createdAfter"]
    }
  )
  .nullable()

// Bot list entry (snake_case to match BFF API)
// Simplified schema - only includes fields returned by BFF list bots endpoint
// status is string() because resolvedStatus can be a lifecycle status OR an error code
export const botListEntry = object({
  bot_id: uuid(),
  bot_name: string(),
  meeting_platform: meetingPlatformSchema,
  speech_to_text_provider: speechToTextProviderSchema,
  transcription_ids: array(string()).nullable(),
  duration: number().nullable(),
  created_at: iso.datetime(),
  status: botStatusSchema.catch("UNKNOWN_ERROR")
})

export const botsListResponseSchema = object({
  data: array(botListEntry),
  success: boolean(),
  cursor: string().nullable(),
  prev_cursor: string().nullable()
})

// Bot status history entry (snake_case to match BFF API)
export const botStatusHistoryEntry = object({
  status: botStatusSchema.catch("UNKNOWN_ERROR"),
  updated_at: iso.datetime(),
  error_code: string().nullable(),
  error_message: string().nullable(),
  // Only present for the non-terminal "retrying" status: the attempt number now
  // being started and the platform cap (e.g. 5 for Zoom). Used to render
  // "Retrying (N/max)" in the status timeline.
  attempt: number().optional(),
  max: number().optional()
})

const callbackMethodSchema = zodEnum(["POST", "PUT"])

export const callbackConfigSchema = object({
  enabled: literal(true),
  url: string(),
  secret: string().nullable(),
  method: callbackMethodSchema
})

export const callbackErrorSchema = object({
  status_code: number().nullable().describe("Status code if the callback failed"),
  error: string().describe("Error code if the callback failed"),
  message: string().describe("Human-readable error message if the callback failed"),
  attempted_at: iso.datetime().describe("ISO 8601 timestamp when the callback was attempted"),
  retries_attempted: number().nullable().describe("Number of retries attempted")
})

// Bot details schema (snake_case to match BFF API)
export const botDetailsSchema = object({
  bot_name: string(),
  meeting_url: string(),
  meeting_platform: meetingPlatformSchema,
  timeout_config: object({
    waiting_room_timeout: number().int(),
    no_one_joined_timeout: number().int(),
    silence_timeout: number().int(),
    grace_period: number().int()
  }).nullable(),
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
  status: botStatusSchema.catch("UNKNOWN_ERROR"),
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
  open_support_tickets: number().describe("Number of open support tickets for the bot"),
  api_only_artifact_access: boolean().describe("Whether artifact access is restricted to API only"),
  participants: array(
    object({
      name: string(),
      id: number().int().nullable(),
      display_name: string().optional(),
      profile_picture: string().optional()
    })
  ).nullable(),
  callback_config: callbackConfigSchema.nullable()
})

export const botDetailsResponseSchema = object({
  data: botDetailsSchema,
  success: boolean()
})

export type MeetingPlatform = output<typeof meetingPlatformSchema>
export type RecordingMode = output<typeof recordingModeSchema>
export type SpeechToTextProvider = output<typeof speechToTextProviderSchema>
export type BotStatus = output<typeof botStatusSchema>
export type ListBotsRequestQueryParams = output<typeof ListBotsRequestQuerySchema>
export type BotListEntry = output<typeof botListEntry>
export type BotsListResponse = output<typeof botsListResponseSchema>
export type BotDetails = output<typeof botDetailsSchema>
export type BotStatusHistoryEntry = output<typeof botStatusHistoryEntry>
export type BotDetailsResponse = output<typeof botDetailsResponseSchema>
export type Artifact = output<typeof artifactSchema>
export type ArtifactWithSignedUrl = output<typeof artifactWithSignedUrlSchema>
export type CallbackError = output<typeof callbackErrorSchema>

/** Check if a bot has a transcription failure (from errors array, not status) */
export function hasTranscriptionFailure(
  errors: Array<Record<string, unknown>> | null | undefined
): boolean {
  if (!errors) return false
  return errors.some((e) => e["code"] === "TRANSCRIPTION_FAILED")
}

// Retry callback form schema (for dialog) - discriminated union
export const retryCallbackFormSchema = discriminatedUnion("useOverride", [
  object({
    useOverride: literal(true),
    url: url("Callback URL must be a valid URL"),
    method: zodEnum(["POST", "PUT"]),
    secret: string().optional()
  }),
  object({
    useOverride: literal(false)
  })
])

export type RetryCallbackFormData = output<typeof retryCallbackFormSchema>

// Retranscribe form schema (for dialog) - discriminated union
export const retranscribeFormSchema = discriminatedUnion("useOverride", [
  object({
    useOverride: literal(true),
    provider: speechToTextProviderSchema.exclude(["none"]),
    api_key: string().optional(),
    custom_params: record(string(), zodUnknown()).optional()
  }),
  object({
    useOverride: literal(false)
  })
])

export type RetranscribeFormData = output<typeof retranscribeFormSchema>

// Screenshot schemas
export const botScreenshotSchema = object({
  screenshot_id: number().int().positive(),
  url: url()
})

export const getBotScreenshotsRequestQuerySchema = object({
  limit: number().int().positive().max(250).default(50).optional(),
  cursor: string().nullable().default(null)
})

export const getBotScreenshotsResponseSchema = object({
  success: literal(true),
  data: array(botScreenshotSchema),
  cursor: string().nullable(),
  prev_cursor: string().nullable()
})

export type BotScreenshot = output<typeof botScreenshotSchema>
export type GetBotScreenshotsRequestQuery = output<typeof getBotScreenshotsRequestQuerySchema>
export type GetBotScreenshotsResponse = output<typeof getBotScreenshotsResponseSchema>
