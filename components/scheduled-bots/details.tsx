"use client";

import { GoogleMeetLogo } from "@/components/icons/google-meet";
import { MicrosoftTeamsLogo } from "@/components/icons/microsoft-teams";
import { ZoomLogo } from "@/components/icons/zoom";
import { DocsButton } from "@/components/layout/docs-button";
import { ItemHeading } from "@/components/layout/item-heading";
import { scheduledStatusVariants } from "@/components/scheduled-bots/columns";
import { Badge } from "@/components/ui/badge";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { NameValuePair } from "@/components/ui/name-value-pair";
import { formatISODateString, formatRelativeDate } from "@/lib/date-helpers";
import { formatScheduledBotStatus } from "@/lib/formatters/scheduled-bots";
import type { ScheduledBotDetails } from "@/lib/schemas/scheduled-bots";
import { readableRecordingMode } from "@/lib/utils";

interface ViewScheduledBotDetailsProps {
  botDetails: ScheduledBotDetails;
}

export function ViewScheduledBotDetails({
  botDetails,
}: ViewScheduledBotDetailsProps) {
  const platformIcon =
    botDetails.meeting_platform === "zoom" ? (
      <ZoomLogo className="size-8" />
    ) : botDetails.meeting_platform === "meet" ? (
      <GoogleMeetLogo className="size-8" />
    ) : (
      <MicrosoftTeamsLogo className="size-8" />
    );

  return (
    <section>
      <div className="flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <ItemHeading
          title={botDetails.bot_name}
          name={botDetails.bot_id}
          nameClassName="text-xl"
          containerClassName="md:flex-1"
          gradientIcon={
            <GradientIcon color="var(--color-background)" size="xl">
              {platformIcon}
            </GradientIcon>
          }
        />
        <div className="flex w-full sm:w-auto gap-2 flex-row sm:items-center">
          <DocsButton uriSuffix="api-v2/reference/bots/get-scheduled-bot-details" />
        </div>
      </div>

      <div className="grid mt-10 md:mt-12 md:space-y-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <NameValuePair title="Meeting URL" value={botDetails.meeting_url} />
        <NameValuePair
          title="Recording Mode"
          value={readableRecordingMode(botDetails.recording_mode)}
        />
        <NameValuePair
          title="Join Time"
          value={formatISODateString(botDetails.join_at, "MMM d, yyyy hh:mm a")}
        />
        <NameValuePair
          title="Status"
          value={
            <Badge
              className={scheduledStatusVariants({ status: botDetails.status })}
            >
              {formatScheduledBotStatus(botDetails.status)}
            </Badge>
          }
        />
        <NameValuePair
          title="Last Updated At"
          value={formatRelativeDate(botDetails.updated_at)}
        />
        <NameValuePair
          title="Transcription Provider"
          value={
            botDetails.transcription_config
              ? botDetails.transcription_config.provider
              : "Disabled"
          }
          valueClassName="capitalize"
        />
        <NameValuePair
          title="Streaming"
          value={botDetails.streaming_config?.enabled ? "Enabled" : "Disabled"}
        />
        <NameValuePair
          title="Callback"
          value={botDetails.callback_config?.enabled ? "Configured" : null}
        />
      </div>
    </section>
  );
}
