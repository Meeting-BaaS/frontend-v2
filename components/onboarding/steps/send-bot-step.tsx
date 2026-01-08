"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { genericError } from "@/lib/errors";
import { BRANDING_IMAGE_URL } from "@/lib/external-urls";
import {
  type SendBotFormValues,
  sendBotFormSchema,
} from "@/lib/schemas/onboarding";
import { cn } from "@/lib/utils";

interface SendBotStepProps {
  step: number;
  isActive: boolean;
  isEnabled: boolean;
  apiKey: string | null;
}

export function SendBotStep({
  step,
  isActive,
  isEnabled,
  apiKey,
}: SendBotStepProps) {
  const [loading, setLoading] = useState(false);
  const form = useForm<SendBotFormValues>({
    resolver: zodResolver(sendBotFormSchema),
    defaultValues: {
      meeting_url: "",
    },
  });

  const handleSendBot = async (values: SendBotFormValues) => {
    if (!apiKey || loading) return;

    try {
      setLoading(true);

      // Just an onboarding bot, we don't need to create a bot config for it
      const response = await fetch("/api/public/bots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-meeting-baas-api-key": apiKey,
        },
        body: JSON.stringify({
          bot_name: "My First Bot",
          bot_image: BRANDING_IMAGE_URL,
          meeting_url: values.meeting_url.trim(),
          recording_mode: "speaker_view",
          allow_multiple_bots: true,
          transcription_enabled: true,
          transcription_config: {
            provider: "gladia",
          },
          streaming_enabled: false,
          callback_enabled: false,
        }),
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
    } catch (error) {
      console.error("Error sending bot", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex items-start gap-6 border-l-2 pb-8 pl-6 transition-colors",
        isActive ? "border-primary" : "border-border",
        isEnabled
          ? "opacity-100 pointer-events-auto"
          : "opacity-30 pointer-events-none",
      )}
    >
      <div className="flex-shrink-0">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full",
            isEnabled
              ? isActive
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
              : "bg-muted/50 text-muted-foreground/50",
          )}
        >
          <span className="text-sm font-semibold">{step}</span>
        </div>
      </div>
      <div className="flex-1 space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Send a Bot</h3>
          <p className="text-sm text-muted-foreground">
            Enter your meeting URL and send a bot to join it.
          </p>
        </div>
        {isEnabled ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSendBot)}
              className="space-y-3"
            >
              <FormField
                control={form.control}
                name="meeting_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting URL</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://zoom.us/j/123456789 or https://meet.google.com/abc-defg-hij"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
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
        ) : (
          <p className="text-sm text-muted-foreground">
            Complete the previous steps to continue.
          </p>
        )}
      </div>
    </div>
  );
}
