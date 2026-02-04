"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { V2Zod } from "@meeting-baas/sdk";
import { ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  boolean,
  enum as zodEnum,
  number,
  object,
  type output,
  string,
  url,
} from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { env } from "@/env";
import { genericError } from "@/lib/errors";
import { BRANDING_IMAGE_URL } from "@/lib/external-urls";
import { platformLinks } from "@/lib/platform-links";
import { cn } from "@/lib/utils";

const DEFAULT_BOT_IMAGE =
  env.NEXT_PUBLIC_DEFAULT_BOT_IMAGE || BRANDING_IMAGE_URL;

// ─── SDK-derived types & constants ───────────────────────────────────────────
// The canonical API body type, extracted from the SDK's Zod 3 schema.
// If the SDK adds/removes/changes fields, TypeScript will flag mismatches
// in the `satisfies CreateBotBody` assertion inside handleSendBot.
type CreateBotBody = (typeof V2Zod.createBotBody)["_output"];

// All validation constraints & defaults come from the SDK — no magic numbers.
const {
  createBotBodyBotNameMax: BOT_NAME_MAX,
  createBotBodyEntryMessageMaxOne: ENTRY_MESSAGE_MAX,
  createBotBodyAllowMultipleBotsDefault: ALLOW_MULTIPLE_DEFAULT,
  createBotBodyRecordingModeDefault: RECORDING_MODE_DEFAULT,
  createBotBodyTimeoutConfigWaitingRoomTimeoutDefault:
    WAITING_ROOM_TIMEOUT_DEFAULT,
  createBotBodyTimeoutConfigWaitingRoomTimeoutMin: WAITING_ROOM_TIMEOUT_MIN,
  createBotBodyTimeoutConfigWaitingRoomTimeoutMax: WAITING_ROOM_TIMEOUT_MAX,
  createBotBodyTimeoutConfigNoOneJoinedTimeoutDefault:
    NO_ONE_JOINED_TIMEOUT_DEFAULT,
  createBotBodyTimeoutConfigNoOneJoinedTimeoutMin: NO_ONE_JOINED_TIMEOUT_MIN,
  createBotBodyTimeoutConfigNoOneJoinedTimeoutMax: NO_ONE_JOINED_TIMEOUT_MAX,
  createBotBodyTimeoutConfigSilenceTimeoutDefault: SILENCE_TIMEOUT_DEFAULT,
  createBotBodyTimeoutConfigSilenceTimeoutMin: SILENCE_TIMEOUT_MIN,
  createBotBodyTimeoutConfigSilenceTimeoutMax: SILENCE_TIMEOUT_MAX,
  createBotBodyStreamingConfigAudioFrequencyDefault:
    STREAMING_AUDIO_FREQ_DEFAULT,
  createBotBodyTranscriptionConfigProviderDefault:
    TRANSCRIPTION_PROVIDER_DEFAULT,
  createBotBodyCallbackConfigMethodDefault: CALLBACK_METHOD_DEFAULT,
} = V2Zod;

// ─── Form schema (Zod 4 — constraints from SDK constants) ───────────────────
const sendBotFormSchema = object({
  meeting_url: url("Enter a valid meeting URL"),
  bot_name: string().min(1).max(BOT_NAME_MAX),
  bot_image: string().optional(),
  recording_mode: zodEnum(["audio_only", "speaker_view", "gallery_view"]),
  entry_message: string().max(ENTRY_MESSAGE_MAX).optional(),
  allow_multiple_bots: boolean(),
  // Timeouts — flattened for form ergonomics, nested for API submission
  waiting_room_timeout: number()
    .int()
    .min(WAITING_ROOM_TIMEOUT_MIN)
    .max(WAITING_ROOM_TIMEOUT_MAX),
  no_one_joined_timeout: number()
    .int()
    .min(NO_ONE_JOINED_TIMEOUT_MIN)
    .max(NO_ONE_JOINED_TIMEOUT_MAX),
  silence_timeout: number()
    .int()
    .min(SILENCE_TIMEOUT_MIN)
    .max(SILENCE_TIMEOUT_MAX),
  // Transcription
  transcription_enabled: boolean(),
  transcription_provider: zodEnum(["gladia"]).optional(),
  transcription_api_key: string().optional(),
  // Streaming
  streaming_enabled: boolean(),
  streaming_input_url: string().optional(),
  streaming_output_url: string().optional(),
  streaming_audio_frequency: number().optional(),
  // Callback
  callback_enabled: boolean(),
  callback_url: string().optional(),
  callback_secret: string().optional(),
  callback_method: zodEnum(["POST", "PUT"]).optional(),
});

type SendBotFormValues = output<typeof sendBotFormSchema>;

interface SendBotFormProps {
  apiKey: string;
  onSuccess?: () => void;
}

export function SendBotForm({ apiKey, onSuccess }: SendBotFormProps) {
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const form = useForm<SendBotFormValues>({
    resolver: zodResolver(sendBotFormSchema),
    defaultValues: {
      meeting_url: "",
      bot_name: "Manual Bot",
      bot_image: "",
      recording_mode: RECORDING_MODE_DEFAULT,
      entry_message: "",
      allow_multiple_bots: ALLOW_MULTIPLE_DEFAULT,
      waiting_room_timeout: WAITING_ROOM_TIMEOUT_DEFAULT,
      no_one_joined_timeout: NO_ONE_JOINED_TIMEOUT_DEFAULT,
      silence_timeout: SILENCE_TIMEOUT_DEFAULT,
      transcription_enabled: true,
      transcription_provider: TRANSCRIPTION_PROVIDER_DEFAULT,
      transcription_api_key: "",
      streaming_enabled: false,
      streaming_input_url: "",
      streaming_output_url: "",
      streaming_audio_frequency: STREAMING_AUDIO_FREQ_DEFAULT,
      callback_enabled: false,
      callback_url: "",
      callback_secret: "",
      callback_method: CALLBACK_METHOD_DEFAULT,
    },
  });

  const transcriptionEnabled = form.watch("transcription_enabled");
  const streamingEnabled = form.watch("streaming_enabled");
  const callbackEnabled = form.watch("callback_enabled");

  const handleSendBot = async (values: SendBotFormValues) => {
    if (!apiKey || loading) return;

    try {
      setLoading(true);

      // Build the nested API body, type-checked against the SDK.
      // `satisfies CreateBotBody` ensures every required field is present
      // and every value matches the SDK's expected type. If the SDK adds
      // a new required field, this line will fail to compile.
      const body = {
        bot_name: values.bot_name,
        bot_image: values.bot_image || DEFAULT_BOT_IMAGE,
        meeting_url: values.meeting_url.trim(),
        recording_mode: values.recording_mode,
        allow_multiple_bots: values.allow_multiple_bots,
        entry_message: values.entry_message || null,
        timeout_config: {
          waiting_room_timeout: values.waiting_room_timeout,
          no_one_joined_timeout: values.no_one_joined_timeout,
          silence_timeout: values.silence_timeout,
        },
        transcription_enabled: values.transcription_enabled,
        ...(values.transcription_enabled
          ? {
              transcription_config: {
                provider: (values.transcription_provider ||
                  TRANSCRIPTION_PROVIDER_DEFAULT) as "gladia",
                ...(values.transcription_api_key
                  ? { api_key: values.transcription_api_key }
                  : {}),
              },
            }
          : {}),
        streaming_enabled: values.streaming_enabled,
        ...(values.streaming_enabled
          ? {
              streaming_config: {
                ...(values.streaming_input_url
                  ? { input_url: values.streaming_input_url }
                  : {}),
                ...(values.streaming_output_url
                  ? { output_url: values.streaming_output_url }
                  : {}),
                audio_frequency:
                  values.streaming_audio_frequency ||
                  STREAMING_AUDIO_FREQ_DEFAULT,
              },
            }
          : {}),
        callback_enabled: values.callback_enabled,
        ...(values.callback_enabled && values.callback_url
          ? {
              callback_config: {
                url: values.callback_url,
                method: (values.callback_method ||
                  CALLBACK_METHOD_DEFAULT) as CreateBotBody["callback_config"] extends
                  | { method: infer M }
                  | null
                  | undefined
                  ? M
                  : never,
                ...(values.callback_secret
                  ? { secret: values.callback_secret }
                  : {}),
              },
            }
          : {}),
      } satisfies CreateBotBody;

      const response = await fetch("/api/public/bots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-meeting-baas-api-key": apiKey,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to create bot: ${response.statusText}`,
        );
      }

      await response.json();
      toast.success("Bot sent successfully! It will join the meeting shortly.");
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error sending bot", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSendBot)}
        className="space-y-4 max-h-[70vh] overflow-y-auto pr-1"
      >
        {/* ── Required ── */}
        <FormField
          control={form.control}
          name="meeting_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meeting URL</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://meet.google.com/abc-defg-hij"
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="text-xs text-muted-foreground">
                  Need a meeting?
                </span>
                <TooltipProvider>
                  {platformLinks.map((p) => (
                    <Tooltip key={p.name}>
                      <TooltipTrigger asChild>
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "rounded p-1 transition-colors",
                            p.color,
                          )}
                        >
                          <p.icon className="h-4 w-4" />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>{p.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bot_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bot Name</FormLabel>
              <FormControl>
                <Input placeholder="Manual Bot" disabled={loading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ── Bot Image ── */}
        <FormField
          control={form.control}
          name="bot_image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bot Image URL</FormLabel>
              <div className="flex items-center gap-3">
                <img
                  src={field.value || DEFAULT_BOT_IMAGE}
                  alt="Bot avatar"
                  className="h-10 w-10 rounded-md border dark:border-white/15 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_BOT_IMAGE;
                  }}
                />
                <FormControl>
                  <Input
                    type="url"
                    placeholder={DEFAULT_BOT_IMAGE}
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
              </div>
              <FormDescription className="text-xs">
                Leave empty to use the default image
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ── Entry Message ── */}
        <FormField
          control={form.control}
          name="entry_message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Entry Message</FormLabel>
              <FormControl>
                <Input
                  placeholder="Hi, I'm recording this meeting"
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs">
                Chat message sent when the bot joins (max{" "}
                {ENTRY_MESSAGE_MAX} chars)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ── Transcription toggle ── */}
        <FormField
          control={form.control}
          name="transcription_enabled"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-md border dark:border-white/15 p-3">
              <div className="space-y-0.5">
                <FormLabel className="text-sm">Transcription</FormLabel>
                <FormDescription className="text-xs">
                  Transcribe the meeting audio
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={loading}
                  className="data-[state=checked]:bg-baas-primary-500"
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* ── Advanced toggle ── */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronDown
            className={cn(
              "h-3 w-3 transition-transform",
              showAdvanced && "rotate-180",
            )}
          />
          Advanced options
        </button>

        {showAdvanced && (
          <div className="space-y-4 rounded-md border dark:border-white/15 p-3">
            {/* ── Recording Mode ── */}
            <FormField
              control={form.control}
              name="recording_mode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recording Mode</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="speaker_view">Speaker View</SelectItem>
                      <SelectItem value="gallery_view">Gallery View</SelectItem>
                      <SelectItem value="audio_only">Audio Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Allow Multiple Bots ── */}
            <FormField
              control={form.control}
              name="allow_multiple_bots"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel className="text-sm">
                    Allow Multiple Bots
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                      className="data-[state=checked]:bg-baas-primary-500"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* ── Timeouts ── */}
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Timeouts (seconds, {WAITING_ROOM_TIMEOUT_MIN}&ndash;
                {WAITING_ROOM_TIMEOUT_MAX})
              </p>
              <div className="grid grid-cols-3 gap-2">
                <FormField
                  control={form.control}
                  name="waiting_room_timeout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Waiting Room</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={WAITING_ROOM_TIMEOUT_MIN}
                          max={WAITING_ROOM_TIMEOUT_MAX}
                          disabled={loading}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="no_one_joined_timeout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">No One Joined</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={NO_ONE_JOINED_TIMEOUT_MIN}
                          max={NO_ONE_JOINED_TIMEOUT_MAX}
                          disabled={loading}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="silence_timeout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Silence</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={SILENCE_TIMEOUT_MIN}
                          max={SILENCE_TIMEOUT_MAX}
                          disabled={loading}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* ── Transcription Config (when enabled) ── */}
            {transcriptionEnabled && (
              <div className="space-y-2 rounded-md border dark:border-white/15 p-3">
                <p className="text-sm font-medium">Transcription Config</p>
                <FormField
                  control={form.control}
                  name="transcription_provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Provider</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={loading}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="gladia">Gladia</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="transcription_api_key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">
                        API Key (BYOK, optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Leave empty to use default"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* ── Streaming ── */}
            <FormField
              control={form.control}
              name="streaming_enabled"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">Streaming</FormLabel>
                    <FormDescription className="text-xs">
                      Real-time audio/video streaming
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                      className="data-[state=checked]:bg-baas-primary-500"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {streamingEnabled && (
              <div className="space-y-2 rounded-md border dark:border-white/15 p-3">
                <p className="text-sm font-medium">Streaming Config</p>
                <FormField
                  control={form.control}
                  name="streaming_input_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Input URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="wss://..."
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="streaming_output_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Output URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="wss://..."
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="streaming_audio_frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">
                        Audio Frequency (Hz)
                      </FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(Number(v))}
                        defaultValue={String(field.value)}
                        disabled={loading}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="16000">16,000 Hz</SelectItem>
                          <SelectItem value="24000">24,000 Hz</SelectItem>
                          <SelectItem value="44100">44,100 Hz</SelectItem>
                          <SelectItem value="48000">48,000 Hz</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* ── Callback ── */}
            <FormField
              control={form.control}
              name="callback_enabled"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">Callback</FormLabel>
                    <FormDescription className="text-xs">
                      POST results to a URL when done
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                      className="data-[state=checked]:bg-baas-primary-500"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {callbackEnabled && (
              <div className="space-y-2 rounded-md border dark:border-white/15 p-3">
                <p className="text-sm font-medium">Callback Config</p>
                <FormField
                  control={form.control}
                  name="callback_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://your-server.com/webhook"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="callback_method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Method</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={loading}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="callback_secret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">
                        Secret (optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="HMAC signing secret"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        )}

        {/* ── Submit ── */}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Bot"
          )}
        </Button>
      </form>
    </Form>
  );
}
