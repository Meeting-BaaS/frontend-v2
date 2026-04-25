import type { CreateBotFormValues } from "@/lib/schemas/create-bot"

/**
 * Converts flat form values into the nested API request body
 * expected by POST /bff/bots (CreateBotRequestBodySchema).
 */
export function transformCreateBotFormToPayload(values: CreateBotFormValues) {
  const payload: Record<string, unknown> = {
    bot_name: values.bot_name,
    meeting_url: values.meeting_url,
    recording_mode: values.recording_mode,
    allow_multiple_bots: values.allow_multiple_bots,
    timeout_config: {
      waiting_room_timeout: values.waiting_room_timeout,
      no_one_joined_timeout: values.no_one_joined_timeout,
      silence_timeout: values.silence_timeout,
    },
  }

  if (values.entry_message.trim()) {
    payload["entry_message"] = values.entry_message.trim()
  }

  // Parse extra_json
  if (values.extra_json.trim()) {
    try {
      payload["extra"] = JSON.parse(values.extra_json)
    } catch {
      // Transformer shouldn't throw; server will reject invalid JSON
      payload["extra"] = null
    }
  }

  // Transcription config
  payload["transcription_enabled"] = values.transcription_enabled
  if (values.transcription_enabled) {
    const config: Record<string, unknown> = {
      provider: values.transcription_provider,
    }
    if (values.transcription_api_key.trim()) {
      config["api_key"] = values.transcription_api_key.trim()
    }
    if (Object.keys(values.transcription_custom_params).length > 0) {
      config["custom_params"] = values.transcription_custom_params
    }
    payload["transcription_config"] = config
  }

  // Streaming config
  payload["streaming_enabled"] = values.streaming_enabled
  if (values.streaming_enabled) {
    const config: Record<string, unknown> = {
      mode: values.streaming_mode,
      audio_frequency: Number(values.streaming_audio_frequency),
    }
    if (values.streaming_input_url.trim()) {
      config["input_url"] = values.streaming_input_url.trim()
    }
    if (values.streaming_output_url.trim()) {
      config["output_url"] = values.streaming_output_url.trim()
    }
    // Streaming transcription (when mode=transcription)
    if (values.streaming_mode === "transcription") {
      const txConfig: Record<string, unknown> = {
        provider: values.streaming_transcription_provider,
      }
      if (values.streaming_transcription_api_key.trim()) {
        txConfig["api_key"] = values.streaming_transcription_api_key.trim()
      }
      if (Object.keys(values.streaming_transcription_custom_params).length > 0) {
        txConfig["custom_params"] = values.streaming_transcription_custom_params
      }
      config["transcription"] = txConfig
    }
    payload["streaming_config"] = config
  }

  // Callback config
  payload["callback_enabled"] = values.callback_enabled
  if (values.callback_enabled) {
    const config: Record<string, unknown> = {
      url: values.callback_url.trim(),
      method: values.callback_method,
    }
    if (values.callback_secret.trim()) {
      config["secret"] = values.callback_secret.trim()
    }
    payload["callback_config"] = config
  }

  return payload
}
