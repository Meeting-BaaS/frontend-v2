"use client";

import {
  FileCode,
  FileText,
  Headphones,
  Loader,
  Users,
  Video,
  XCircle,
} from "lucide-react";
import { FileCard } from "@/components/bots/file-card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { GradientIcon } from "@/components/ui/gradient-icon";
import type { BotDetails } from "@/lib/schemas/bots";

interface ArtifactsProps {
  botDetails: BotDetails;
  botUuid: string;
}

const artifactConfig = [
  {
    key: "videoUrl" as const,
    icon: Video,
    iconColor: "var(--color-red-500)",
    label: "Video",
    extension: "mp4",
  },
  {
    key: "audioUrl" as const,
    icon: Headphones,
    iconColor: "var(--color-blue-500)",
    label: "Audio",
    extension: "wav",
  },
  {
    key: "diarizationUrl" as const,
    icon: Users,
    iconColor: "var(--color-violet-500)",
    label: "Diarization",
    extension: "json",
  },
  {
    key: "transcriptUrl" as const,
    icon: FileText,
    iconColor: "var(--color-green-500)",
    label: "Transcript",
    extension: "txt",
  },
  {
    key: "rawTranscriptUrl" as const,
    icon: FileCode,
    iconColor: "var(--color-amber-500)",
    label: "Raw Transcript",
    extension: "json",
  },
] as const;

export function Artifacts({ botDetails, botUuid }: ArtifactsProps) {
  const artifacts = artifactConfig
    .filter((config) => botDetails[config.key])
    .map((config) => {
      const url = botDetails[config.key];
      if (!url) return null;

      const fileName = `${botDetails.name}-${botUuid}.${config.extension}`;
      const title = `${botDetails.name} - ${config.label}`;

      return (
        <FileCard
          key={config.key}
          icon={config.icon}
          iconColor={config.iconColor}
          title={title}
          date={botDetails.endedAt}
          url={url}
          fileName={fileName}
        />
      );
    })
    .filter(Boolean);

  if (botDetails.artifactsDeleted) {
    return (
      <Empty className="border rounded-lg">
        <EmptyHeader>
          <EmptyMedia>
            <GradientIcon color="var(--color-red-500)" size="lg">
              <XCircle />
            </GradientIcon>
          </EmptyMedia>
          <EmptyTitle>Artifacts deleted</EmptyTitle>
          <EmptyDescription>
            The artifacts for this bot have been deleted as per our data
            retention policy or upon request.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (artifacts.length === 0) {
    return (
      <Empty className="border rounded-lg">
        <EmptyHeader>
          <EmptyMedia>
            <GradientIcon color="var(--color-orange-300)" size="lg">
              <Loader />
            </GradientIcon>
          </EmptyMedia>
          <EmptyTitle>No artifacts yet</EmptyTitle>
          <EmptyDescription>
            The bot has not generated any artifacts yet. Please check once the
            bot has completed.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return <div className="space-y-3">{artifacts}</div>;
}
