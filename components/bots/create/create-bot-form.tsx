"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronDown, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { TranscriptionConfigFields } from "@/components/bots/create/transcription-config-fields"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { type APIError, axiosPostInstance } from "@/lib/api-client"
import { CREATE_BOT } from "@/lib/api-routes"
import { genericError } from "@/lib/errors"
import {
  type CreateBotFormValues,
  createBotFormSchema,
} from "@/lib/schemas/create-bot"
import { transformCreateBotFormToPayload } from "@/lib/utils/transform-create-bot"
import { cn } from "@/lib/utils"

// Response schema is simple: { success: true, data: { bot_id: string } }
interface CreateBotResponse {
  success: boolean
  data: { bot_id: string }
}

export function CreateBotForm() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [advancedOpen, setAdvancedOpen] = useState(false)

  const form = useForm<CreateBotFormValues>({
    resolver: zodResolver(createBotFormSchema),
    defaultValues: {
      bot_name: "",
      meeting_url: "",
      recording_mode: "speaker_view",
      transcription_enabled: true,
      transcription_provider: "gladia",
      transcription_api_key: "",
      transcription_region: "",
      transcription_custom_params: {},
      streaming_enabled: false,
      streaming_mode: "transcription",
      streaming_input_url: "",
      streaming_output_url: "",
      streaming_audio_frequency: "24000",
      streaming_transcription_provider: "gladia",
      streaming_transcription_api_key: "",
      streaming_transcription_region: "",
      streaming_transcription_custom_params: {},
      callback_enabled: false,
      callback_url: "",
      callback_secret: "",
      callback_method: "POST",
      entry_message: "",
      allow_multiple_bots: true,
      waiting_room_timeout: 600,
      no_one_joined_timeout: 600,
      silence_timeout: 600,
      extra_json: "",
    },
  })

  const transcriptionEnabled = form.watch("transcription_enabled")
  const streamingEnabled = form.watch("streaming_enabled")
  const streamingMode = form.watch("streaming_mode")
  const callbackEnabled = form.watch("callback_enabled")

  const onSubmit = async (values: CreateBotFormValues) => {
    if (submitting) return
    setSubmitting(true)

    try {
      const payload = transformCreateBotFormToPayload(values)
      const response = await axiosPostInstance<
        Record<string, unknown>,
        CreateBotResponse
      >(CREATE_BOT, payload)

      if (response?.data?.bot_id) {
        toast.success("Bot created successfully!")
        router.push(`/bots/${response.data.bot_id}`)
      } else {
        toast.success("Bot created!")
        router.push("/bots")
      }
    } catch (error) {
      const message =
        (error as APIError).errorResponse?.message ??
        (error instanceof Error ? error.message : genericError)
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  const errorCount = Object.keys(form.formState.errors).length

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Sticky submit bar */}
        <div className="sticky -top-8 z-10 -mx-4 md:-mx-10 lg:-mx-20 -mt-8 px-4 md:px-10 lg:px-20 py-3 bg-background/80 backdrop-blur-sm border-b flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-base sm:text-lg font-semibold">Create Bot</h2>
            {errorCount > 0 && (
              <span className="text-xs text-destructive">
                {errorCount} {errorCount === 1 ? "error" : "errors"} to fix
              </span>
            )}
          </div>
          <Button type="submit" disabled={submitting} className="text-sm sm:text-base">
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Bot"
            )}
          </Button>
        </div>

        {/* Basic Info */}
        <section className="space-y-4 pb-8 border-b">
          <div>
            <h3 className="text-base font-medium">Basic Info</h3>
            <p className="text-sm text-muted-foreground">
              Name your bot and specify the meeting to join
            </p>
          </div>
          <FormField
            control={form.control}
            name="bot_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bot Name <span className="text-baas-primary-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="My Meeting Bot" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="meeting_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meeting URL <span className="text-baas-primary-500">*</span></FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://zoom.us/j/... or meet.google.com/..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="recording_mode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recording Mode</FormLabel>
                <FormControl>
                  <div className="flex flex-wrap gap-1.5">
                    {([
                      { value: "speaker_view", label: "Speaker View" },
                      { value: "gallery_view", label: "Gallery View" },
                      { value: "audio_only", label: "Audio Only" },
                    ] as const).map((opt) => (
                      <button key={opt.value} type="button" onClick={() => field.onChange(opt.value)}>
                        <Badge variant={field.value === opt.value ? "primary" : "outline"} className="cursor-pointer">
                          {opt.label}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* Post-Meeting Transcription */}
        <section className="space-y-4 pb-8 border-b">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-medium">Post-Meeting Transcription</h3>
              <p className="text-sm text-muted-foreground">
                Transcribe the recording after the meeting ends
              </p>
            </div>
            <FormField
              control={form.control}
              name="transcription_enabled"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          {transcriptionEnabled && (
            <TranscriptionConfigFields
              control={form.control}
              providerName="transcription_provider"
              apiKeyName="transcription_api_key"
              regionName="transcription_region"
              customParamsName="transcription_custom_params"
            />
          )}
        </section>

        {/* Live Streaming */}
        <section className="space-y-4 pb-8 border-b">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-medium">Live Streaming</h3>
              <p className="text-sm text-muted-foreground">
                Stream real-time transcription or raw audio during the meeting
              </p>
            </div>
            <FormField
              control={form.control}
              name="streaming_enabled"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          {streamingEnabled && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="streaming_mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Streaming Mode</FormLabel>
                    <FormControl>
                      <div className="flex flex-wrap gap-1.5">
                        {([
                          { value: "transcription", label: "Transcription" },
                          { value: "audio", label: "Audio" },
                        ] as const).map((opt) => (
                          <button key={opt.value} type="button" onClick={() => field.onChange(opt.value)}>
                            <Badge variant={field.value === opt.value ? "primary" : "outline"} className="cursor-pointer">
                              {opt.label}
                            </Badge>
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormDescription>
                      {streamingMode === "audio"
                        ? "Streams raw audio to output_url via WebSocket"
                        : "Runs real-time STT and POSTs transcript events to output_url"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="streaming_input_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Input URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="wss://... (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        WebSocket URL to receive audio sent to the bot
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="streaming_output_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Output URL {streamingMode === "transcription" && <span className="text-baas-primary-500">*</span>}</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder={
                            streamingMode === "audio"
                              ? "wss://..."
                              : "https://..."
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {streamingMode === "audio"
                          ? "WebSocket URL where the bot sends raw audio"
                          : "HTTP URL where transcript events are POSTed"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="streaming_audio_frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Audio Frequency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="16000">16,000 Hz</SelectItem>
                        <SelectItem value="24000">
                          24,000 Hz (default)
                        </SelectItem>
                        <SelectItem value="32000">32,000 Hz</SelectItem>
                        <SelectItem value="48000">48,000 Hz</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Streaming transcription config (when mode=transcription) */}
              {streamingMode === "transcription" && (
                <div className="space-y-4 rounded-lg border p-2 sm:p-4">
                  <h4 className="text-sm font-medium">
                    Streaming Transcription Provider
                  </h4>
                  <TranscriptionConfigFields
                    control={form.control}
                    providerName="streaming_transcription_provider"
                    apiKeyName="streaming_transcription_api_key"
                    regionName="streaming_transcription_region"
                    customParamsName="streaming_transcription_custom_params"
                    mode="streaming"
                  />
                </div>
              )}
            </div>
          )}
        </section>

        {/* Callback */}
        <section className="space-y-4 pb-8 border-b">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-medium">Callback</h3>
              <p className="text-sm text-muted-foreground">
                Receive a webhook when the bot completes or fails
              </p>
            </div>
            <FormField
              control={form.control}
              name="callback_enabled"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          {callbackEnabled && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="callback_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Callback URL <span className="text-baas-primary-500">*</span></FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://your-server.com/webhook"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="callback_secret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secret</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Optional shared secret"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Sent in x-mb-secret header for verification
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="callback_method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>HTTP Method</FormLabel>
                      <FormControl>
                        <div className="flex flex-wrap gap-1.5">
                          {(["POST", "PUT"] as const).map((method) => (
                            <button key={method} type="button" onClick={() => field.onChange(method)}>
                              <Badge variant={field.value === method ? "primary" : "outline"} className="cursor-pointer font-mono">
                                {method}
                              </Badge>
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
        </section>

        {/* Advanced */}
        <section className="space-y-4 pb-8">
          <button
            type="button"
            onClick={() => setAdvancedOpen(!advancedOpen)}
            className="flex w-full items-center justify-between gap-2 text-left"
          >
            <div>
              <h3 className="text-base font-medium">Advanced</h3>
              <p className="text-sm text-muted-foreground">
                Entry message, timeouts, and extra configuration
              </p>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                advancedOpen && "rotate-180",
              )}
            />
          </button>
          {advancedOpen && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="entry_message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entry Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Message sent to meeting chat when bot joins (max 500 chars)"
                        className="min-h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="allow_multiple_bots"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <FormLabel>Allow Multiple Bots</FormLabel>
                      <FormDescription>
                        Allow sending multiple bots to the same meeting
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="waiting_room_timeout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Waiting Room Timeout</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={120}
                          max={1800}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>120-1800 seconds</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="no_one_joined_timeout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No One Joined Timeout</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={120}
                          max={1800}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>120-1800 seconds</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="silence_timeout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Silence Timeout</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={120}
                          max={1800}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>120-1800 seconds</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="extra_json"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Extra JSON</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='{"key": "value"}'
                        className="min-h-20 font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Arbitrary JSON passed through to callbacks. Must be a
                      valid JSON object.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </section>

      </form>
    </Form>
  )
}
