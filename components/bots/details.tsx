"use client";

import {
  AlertTriangle,
  Coins,
  FileAudio,
  FileText,
  Radio,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Artifacts } from "@/components/bots/artifacts";
import { BotActions } from "@/components/bots/bot-actions";
import { JsonPreview } from "@/components/bots/json-preview";
import { RetryCallbackDialog } from "@/components/bots/retry-callback-dialog";
import { StatusHistory } from "@/components/bots/status-history";
import { GoogleMeetLogo } from "@/components/icons/google-meet";
import { MicrosoftTeamsLogo } from "@/components/icons/microsoft-teams";
import { ZoomLogo } from "@/components/icons/zoom";
import { DocsButton } from "@/components/layout/docs-button";
import { ItemHeading } from "@/components/layout/item-heading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { GradientIcon } from "@/components/ui/gradient-icon";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { NameValuePair } from "@/components/ui/name-value-pair";
import { Separator } from "@/components/ui/separator";
import { formatDuration, formatRelativeDate } from "@/lib/date-helpers";
import type { BotDetails } from "@/lib/schemas/bots";
import { readableRecordingMode } from "@/lib/utils";

interface BotDetailsProps {
  botDetails: BotDetails;
  botUuid: string;
}

export function ViewBotDetails({ botDetails, botUuid }: BotDetailsProps) {
  const [openRetryDialog, setOpenRetryDialog] = useState(false);
  const botDuration = botDetails.duration
    ? parseInt(botDetails.duration, 10)
    : 0;

  // Format token values for display (returns precision string as-is)
  const formatTokenValue = (value: string | null | undefined): string => {
    return value ?? "0";
  };

  const recordingTokens = formatTokenValue(botDetails.recording_tokens);
  const transcriptionTokens = formatTokenValue(botDetails.transcription_tokens);
  const byokTranscriptionTokens = formatTokenValue(
    botDetails.byok_transcription_tokens,
  );
  const inputStreamingTokens = formatTokenValue(
    botDetails.streaming_input_tokens,
  );
  const outputStreamingTokens = formatTokenValue(
    botDetails.streaming_output_tokens,
  );
  const totalTokens = formatTokenValue(botDetails.total_tokens);

  // Determine which transcription token to show (only one is used)
  const transcriptionTokenValue =
    transcriptionTokens !== "0" ? transcriptionTokens : byokTranscriptionTokens;

  return (
    <section>
      <div className="flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <ItemHeading
          title={botDetails.bot_name}
          name={botUuid}
          nameClassName="text-xl"
          containerClassName="md:flex-1"
          gradientIcon={
            <GradientIcon color="var(--color-background)" size="xl">
              {botDetails.meeting_platform === "zoom" ? (
                <ZoomLogo className="size-8" />
              ) : botDetails.meeting_platform === "meet" ? (
                <GoogleMeetLogo className="size-8" />
              ) : (
                <MicrosoftTeamsLogo className="size-8" />
              )}
            </GradientIcon>
          }
        />
        <div className="flex w-full sm:w-auto gap-2 flex-row sm:items-center">
          <DocsButton />
          <BotActions
            botDetails={botDetails}
            botUuid={botUuid}
            buttonVariant="outline"
          />
        </div>
      </div>

      {/* Callback Error Alert */}
      {botDetails.callback_error && (
        <Alert variant="destructive" className="mt-6">
          <AlertTriangle />
          <AlertTitle>Callback Error</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>
              We faced an error when trying to hit the configured callback URL.
            </p>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Code:</strong> {botDetails.callback_error.error}
              </p>
              <p>
                <strong>Message:</strong> {botDetails.callback_error.message}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenRetryDialog(true)}
              className="mt-2"
            >
              <RefreshCw className="size-4" /> Retry callback
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Support Tickets Warning Alert */}
      {botDetails.open_support_tickets > 0 && (
        <Alert variant="warning" className="mt-6">
          <AlertTriangle />
          <AlertTitle>Open Support Tickets</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-4">
            <p>
              There {botDetails.open_support_tickets === 1 ? "is" : "are"}{" "}
              {botDetails.open_support_tickets} open support ticket
              {botDetails.open_support_tickets === 1 ? "" : "s"} for this bot.
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/support-center?bot_uuid=${botUuid}`}>
                View tickets
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid mt-10 md:mt-12 md:space-y-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <NameValuePair title="Meeting URL" value={botDetails.meeting_url} />
        <NameValuePair
          title="Recording Mode"
          value={readableRecordingMode(botDetails.recording_mode)}
        />
        <NameValuePair
          title="Created At"
          valueClassName="capitalize"
          value={formatRelativeDate(botDetails.created_at)}
        />
        <NameValuePair
          title="Duration"
          valueClassName="capitalize"
          value={
            botDetails.duration ? (
              formatDuration(botDuration)
            ) : (
              <span className="text-muted-foreground">-</span>
            )
          }
        />
        <NameValuePair
          title="Transcription Provider"
          valueClassName="capitalize"
          value={botDetails.speech_to_text_provider}
        />
        <NameValuePair
          title="Transcription ID"
          valueClassName="capitalize"
          value={botDetails.transcription_ids?.join(", ")}
        />
        <NameValuePair
          title="Consumed Tokens"
          value={
            botDetails.total_tokens ? (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <span className="cursor-help">{totalTokens}</span>
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="space-y-2 px-2">
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <FileAudio className="size-3" />
                      <span>Recording</span>
                      <span className="ml-auto">{recordingTokens}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <FileText className="size-3" />
                      <span>
                        {transcriptionTokenValue
                          ? "Transcription"
                          : "BYOK Transcription"}
                      </span>
                      <span className="ml-auto">{transcriptionTokenValue}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <Radio className="size-3" />
                      <span>Input Streaming</span>
                      <span className="ml-auto">{inputStreamingTokens}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <Radio className="size-3" />
                      <span>Output Streaming</span>
                      <span className="ml-auto">{outputStreamingTokens}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-1 text-sm font-semibold">
                      <Coins className="size-3" />
                      <span>Total</span>
                      <span className="ml-auto">{totalTokens}</span>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ) : (
              "-"
            )
          }
        />
        <NameValuePair
          title="Extra Metadata"
          value={botDetails.extra && <JsonPreview data={botDetails.extra} />}
        />
        <NameValuePair
          containerClassName="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4"
          title="Status History"
          value={
            <StatusHistory statusHistory={botDetails.status_history ?? []} />
          }
        />
        <NameValuePair
          containerClassName="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4"
          title="Artifacts"
          value={<Artifacts botDetails={botDetails} botUuid={botUuid} />}
        />
      </div>
      <RetryCallbackDialog
        botUuid={botUuid}
        open={openRetryDialog}
        onOpenChange={setOpenRetryDialog}
      />
    </section>
  );
}
