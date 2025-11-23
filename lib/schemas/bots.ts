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
  url,
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

// All possible bot statuses
export const botStatusSchema = zodEnum([
  "queued",
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

const artifactTypeSchema = zodEnum([
  "audio",
  "video",
  "diarization",
  "raw_transcription",
  "transcription",
]);

const artifactErrorCodeSchema = zodEnum([
  "FILE_NOT_FOUND",
  "UPLOAD_FAILED",
  "FILE_TOO_SMALL",
  "UNKNOWN_ERROR",
  "NOT_SUPPORTED",
]);

const artifactSchema = object({
  s3Key: string().nullable(),
  filePath: string(),
  extension: string(),
  uploaded: boolean(),
  uploadedAt: iso.datetime(),
  type: artifactTypeSchema,
  errorCode: artifactErrorCodeSchema.nullable(),
  errorMessage: string().nullable(),
});

const artifactWithSignedUrlSchema = artifactSchema.extend({
  signedUrl: url().nullable(),
});

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

export const botStatusHistoryEntry = object({
  status: botStatusSchema,
  updatedAt: iso.datetime(),
  message: string().nullish(),
  error_message: string().nullish(),
});

export const botDetailsSchema = object({
  name: string(),
  meetingUrl: string(),
  meetingPlatform: meetingPlatformSchema,
  recordingMode: recordingModeSchema,
  speechToTextProvider: speechToTextProviderSchema,
  extra: record(string(), zodUnknown()).nullable(),
  totalTokens: string().nullable(),
  duration: string().nullable(),
  createdAt: iso.datetime(),
  endedAt: iso.datetime().nullable(),
  joinedAt: iso.datetime().nullable(),
  exitedAt: iso.datetime().nullable(),
  latestStatus: botStatusSchema,
  statusHistory: array(botStatusHistoryEntry),
  transcriptionFailures: number(),
  diarizationFailures: number(),
  videoUploadFailures: number(),
  audioUploadFailures: number(),
  logsUploadFailures: number(),
  artifacts: array(artifactWithSignedUrlSchema).nullable(),
  artifactsDeleted: boolean(),
  errors: array(record(string(), zodUnknown())).nullable(),
  updatedAt: iso.datetime(),
  transcriptionIds: array(string()).nullable(),
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
