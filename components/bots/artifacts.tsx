"use client";

import {
  FileCode,
  Headphones,
  Loader,
  Users,
  Video,
  XCircle,
} from "lucide-react";
import type { ComponentType } from "react";
import { FileCard } from "@/components/bots/file-card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { GradientIcon } from "@/components/ui/gradient-icon";
import type { ArtifactWithSignedUrl, BotDetails } from "@/lib/schemas/bots";

interface ArtifactsProps {
  botDetails: BotDetails;
  botUuid: string;
}

const artifactTypeConfig: Record<
  ArtifactWithSignedUrl["type"],
  {
    icon: ComponentType<{ className?: string }>;
    iconColor: string;
  }
> = {
  video: {
    icon: Video,
    iconColor: "var(--color-red-500)",
  },
  audio: {
    icon: Headphones,
    iconColor: "var(--color-blue-500)",
  },
  diarization: {
    icon: Users,
    iconColor: "var(--color-violet-500)",
  },
  raw_transcription: {
    icon: FileCode,
    iconColor: "var(--color-green-500)",
  },
};

export function Artifacts({ botDetails, botUuid }: ArtifactsProps) {
  const artifacts =
    botDetails.artifacts
      ?.filter((artifact) => artifact.uploaded)
      .map((artifact) => {
        const config = artifactTypeConfig[artifact.type];
        if (!config) return null;

        const title = `${botUuid} - ${artifact.type}`;

        const normalizedExtension = artifact.extension
          .replace(/^\./, "")
          .toLowerCase();
        const fileName = `${botUuid} - ${artifact.type}.${normalizedExtension}`;
        return (
          <FileCard
            key={artifact.s3Key}
            icon={config.icon}
            iconColor={config.iconColor}
            title={title}
            date={artifact.uploadedAt}
            url={artifact.signedUrl}
            fileName={fileName}
          />
        );
      })
      .filter(Boolean) ?? [];

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
