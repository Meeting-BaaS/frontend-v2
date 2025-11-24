"use client";

import { Artifacts } from "@/components/bots/artifacts";
import { BotActions } from "@/components/bots/bot-actions";
import { JsonPreview } from "@/components/bots/json-preview";
import { StatusHistory } from "@/components/bots/status-history";
import { GoogleMeetLogo } from "@/components/icons/google-meet";
import { MicrosoftTeamsLogo } from "@/components/icons/microsoft-teams";
import { ZoomLogo } from "@/components/icons/zoom";
import { DocsButton } from "@/components/layout/docs-button";
import { ItemHeading } from "@/components/layout/item-heading";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { NameValuePair } from "@/components/ui/name-value-pair";
import { formatDuration, formatRelativeDate } from "@/lib/date-helpers";
import type { BotDetails } from "@/lib/schemas/bots";
import { readableRecordingMode } from "@/lib/utils";

interface BotDetailsProps {
  botDetails: BotDetails;
  botUuid: string;
}

export function ViewBotDetails({ botDetails, botUuid }: BotDetailsProps) {
  const botDuration = botDetails.duration
    ? parseInt(botDetails.duration, 10)
    : 0;
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
          value={botDetails.total_tokens}
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
    </section>
  );
}
