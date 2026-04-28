import { boolean, number, object, type output, record, string, enum as zodEnum, unknown as zodUnknown } from "zod"
import { BATCH_PROVIDERS, STREAMING_PROVIDERS } from "@meeting-baas/voice-router/providers"

// Derived from voice-router — single source of truth for provider lists
export const batchTranscriptionProviderSchema = zodEnum(BATCH_PROVIDERS)
export const streamingTranscriptionProviderSchema = zodEnum(STREAMING_PROVIDERS)

export type BatchTranscriptionProvider = output<typeof batchTranscriptionProviderSchema>
export type StreamingTranscriptionProvider = output<typeof streamingTranscriptionProviderSchema>

export const recordingModeSchema = zodEnum([
  "audio_only",
  "speaker_view",
  "gallery_view",
])

export const streamingModeSchema = zodEnum(["audio", "transcription"])

export const callbackMethodSchema = zodEnum(["POST", "PUT"])

export const audioFrequencySchema = zodEnum(["16000", "24000", "32000", "48000"])

export const createBotFormSchema = object({
  // Basic info
  bot_name: string().min(1, "Bot name is required").max(255),
  meeting_url: string().min(1, "Meeting URL is required").url("Must be a valid URL"),
  recording_mode: recordingModeSchema,

  // Transcription
  transcription_enabled: boolean(),
  transcription_provider: batchTranscriptionProviderSchema,
  transcription_region: string(),
  transcription_api_key: string(),
  transcription_custom_params: record(string(), zodUnknown()),

  // Streaming
  streaming_enabled: boolean(),
  streaming_mode: streamingModeSchema,
  streaming_input_url: string(),
  streaming_output_url: string(),
  streaming_audio_frequency: audioFrequencySchema,
  // Streaming transcription (when mode=transcription)
  streaming_transcription_provider: streamingTranscriptionProviderSchema,
  streaming_transcription_region: string(),
  streaming_transcription_api_key: string(),
  streaming_transcription_custom_params: record(string(), zodUnknown()),

  // Callback
  callback_enabled: boolean(),
  callback_url: string(),
  callback_secret: string(),
  callback_method: callbackMethodSchema,

  // Advanced
  entry_message: string().max(500),
  allow_multiple_bots: boolean(),
  waiting_room_timeout: number().min(120).max(1800),
  no_one_joined_timeout: number().min(120).max(1800),
  silence_timeout: number().min(120).max(1800),
  extra_json: string(),
}).refine(
  (data) => !data.callback_enabled || data.callback_url.trim().length > 0,
  { message: "Callback URL is required when callback is enabled", path: ["callback_url"] },
).refine(
  (data) => !data.streaming_enabled || data.streaming_mode !== "audio" || data.streaming_output_url.trim().length > 0,
  { message: "Output URL is required for audio streaming", path: ["streaming_output_url"] },
)

export type CreateBotFormValues = output<typeof createBotFormSchema>
