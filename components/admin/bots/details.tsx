"use client";

import {
  AlertTriangle,
  Coins,
  Download,
  FileAudio,
  FileText,
  LogOut,
  Radio,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AdminArtifacts } from "@/components/admin/bots/artifacts";
import { JsonPreview } from "@/components/bots/json-preview";
import { StatusHistory } from "@/components/bots/status-history";
import { GoogleMeetLogo } from "@/components/icons/google-meet";
import { MicrosoftTeamsLogo } from "@/components/icons/microsoft-teams";
import { ZoomLogo } from "@/components/icons/zoom";
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
import { axiosPostInstance } from "@/lib/api-client";
import { ADMIN_LEAVE_BOT } from "@/lib/api-routes";
import { formatDuration, formatRelativeDate } from "@/lib/date-helpers";
import { genericError } from "@/lib/errors";
import type { AdminBotDetails as AdminBotDetailsType } from "@/lib/schemas/admin";
import { readableRecordingMode } from "@/lib/utils";

interface AdminBotDetailsProps {
  botDetails: AdminBotDetailsType;
  botUuid: string;
}

export function AdminBotDetails({ botDetails, botUuid }: AdminBotDetailsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLeaveBot = async () => {
    if (loading) return;

    try {
      setLoading(true);
      await axiosPostInstance(ADMIN_LEAVE_BOT(botUuid), null, undefined);
      toast.success("Bot leave request sent successfully");
      router.refresh();
    } catch (error) {
      console.error("Error leaving bot", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  const botDuration = botDetails.duration ?? 0;

  // Format token values for display (returns precision string as-is)
  const formatTokenValue = (value: string | null | undefined): string => {
    return value ?? "0";
  };

  const recordingTokens = formatTokenValue(botDetails.recordingTokens);
  const transcriptionTokens = formatTokenValue(botDetails.transcriptionTokens);
  const byokTranscriptionTokens = formatTokenValue(
    botDetails.byokTranscriptionTokens,
  );
  const inputStreamingTokens = formatTokenValue(
    botDetails.streamingInputTokens,
  );
  const outputStreamingTokens = formatTokenValue(
    botDetails.streamingOutputTokens,
  );
  const totalTokens = formatTokenValue(botDetails.totalTokens);

  // Determine which transcription token to show (only one is used)
  const transcriptionTokenValue =
    transcriptionTokens !== "0" ? transcriptionTokens : byokTranscriptionTokens;

  return (
    <section>
      <div className="flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <ItemHeading
          title={botDetails.botName}
          name={botUuid}
          nameClassName="text-xl"
          containerClassName="md:flex-1"
          gradientIcon={
            <GradientIcon color="var(--color-background)" size="xl">
              {botDetails.meetingPlatform === "zoom" ? (
                <ZoomLogo className="size-8" />
              ) : botDetails.meetingPlatform === "meet" ? (
                <GoogleMeetLogo className="size-8" />
              ) : (
                <MicrosoftTeamsLogo className="size-8" />
              )}
            </GradientIcon>
          }
        />
        <div className="flex w-full sm:w-auto gap-2 flex-row sm:items-center">
          <Button variant="outline" onClick={handleLeaveBot} disabled={loading}>
            <LogOut /> Make bot leave
          </Button>
        </div>
      </div>

      {/* Callback Error Alert */}
      {botDetails.callbackError && (
        <Alert variant="destructive" className="mt-6">
          <AlertTriangle />
          <AlertTitle>Callback Error</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>
              An error occurred when trying to hit the configured callback URL.
            </p>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Code:</strong> {botDetails.callbackError.error}
              </p>
              <p>
                <strong>Message:</strong> {botDetails.callbackError.message}
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Support Tickets Warning Alert */}
      {botDetails.openSupportTickets > 0 && (
        <Alert variant="warning" className="mt-6">
          <AlertTriangle />
          <AlertTitle>Open Support Tickets</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-4">
            <p>
              There {botDetails.openSupportTickets === 1 ? "is" : "are"}{" "}
              {botDetails.openSupportTickets} open support ticket
              {botDetails.openSupportTickets === 1 ? "" : "s"} for this bot.
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/support?botUuid=${botUuid}`}>
                View tickets
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid mt-10 md:mt-12 md:space-y-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <NameValuePair title="Meeting URL" value={botDetails.meetingUrl} />
        <NameValuePair
          title="Recording Mode"
          value={readableRecordingMode(botDetails.recordingMode)}
        />
        <NameValuePair
          title="Created At"
          valueClassName="capitalize"
          value={formatRelativeDate(botDetails.createdAt)}
        />
        <NameValuePair
          title="Duration"
          valueClassName="capitalize"
          value={botDetails.duration ? formatDuration(botDuration) : null}
        />
        <NameValuePair
          title="Transcription Provider"
          valueClassName="capitalize"
          value={botDetails.speechToTextProvider}
        />
        <NameValuePair
          title="Consumed Tokens"
          value={
            botDetails.totalTokens ? (
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
          title="Logs"
          value={
            botDetails.logFileUrl ? (
              <Button
                variant="link"
                asChild
                className="px-0 has-[>svg]:px-0 py-0 h-auto"
              >
                <Link href={botDetails.logFileUrl} target="_blank">
                  <Download className="size-4" />
                  Download logs
                </Link>
              </Button>
            ) : (
              "-"
            )
          }
        />
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-6">Bot Config</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <NameValuePair
            title="Team"
            value={
              <Button variant="link" asChild className="p-0 h-auto">
                <Link
                  href={`/admin/teams/${botDetails.teamId}`}
                  className="decoration-dashed underline hover:decoration-baas-primary-500 hover:decoration-solid"
                >
                  {botDetails.teamName}
                </Link>
              </Button>
            }
          />
          <NameValuePair
            title="Allow Multiple Bots"
            value={botDetails.allowMultipleBots ? "Yes" : "No"}
          />
          <NameValuePair
            title="Audio Frequency"
            value={
              botDetails.audioFrequency
                ? `${botDetails.audioFrequency} Hz`
                : null
            }
          />
          <NameValuePair
            title="BYOK Configured"
            value={botDetails.speechToTextApiKeyConfigured ? "Yes" : "No"}
          />
          <NameValuePair
            title="Entry Message"
            value={botDetails.entryMessage}
          />
          <NameValuePair
            title="Waiting Room Timeout"
            value={
              botDetails.waitingRoomTimeout
                ? `${botDetails.waitingRoomTimeout} seconds`
                : null
            }
          />
          <NameValuePair
            title="No One Joined Timeout"
            value={
              botDetails.noOneJoinedTimeout
                ? `${botDetails.noOneJoinedTimeout} seconds`
                : null
            }
          />
          <NameValuePair
            title="Zoom Access Token URL"
            value={botDetails.zoomAccessTokenUrl}
          />
          <NameValuePair
            title="Extra Metadata"
            value={botDetails.extra && <JsonPreview data={botDetails.extra} />}
          />
          <NameValuePair
            title="Transcription Custom Params"
            value={
              botDetails.transcriptionCustomParams && (
                <JsonPreview data={botDetails.transcriptionCustomParams} />
              )
            }
          />
        </div>
      </div>

      <div className="grid mt-10 md:mt-12 md:space-y-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <NameValuePair
          containerClassName="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4"
          title="Status History"
          value={
            <StatusHistory statusHistory={botDetails.statusHistory ?? []} />
          }
        />
        <NameValuePair
          containerClassName="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4"
          title="Artifacts"
          value={<AdminArtifacts botDetails={botDetails} botUuid={botUuid} />}
        />
      </div>
    </section>
  );
}
