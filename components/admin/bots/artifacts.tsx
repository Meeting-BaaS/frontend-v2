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
import type { ComponentType } from "react";
import { FileCard } from "@/components/bots/file-card";
import { Screenshots } from "@/components/bots/screenshots";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { GradientIcon } from "@/components/ui/gradient-icon";
import type { AdminBotDetails } from "@/lib/schemas/admin";

interface AdminArtifactsProps {
  botDetails: AdminBotDetails;
  botUuid: string;
}

const artifactTypeConfig: Record<
  "video" | "audio" | "diarization" | "raw_transcription" | "transcription",
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
  transcription: {
    icon: FileText,
    iconColor: "var(--color-green-500)",
  },
  diarization: {
    icon: Users,
    iconColor: "var(--color-violet-500)",
  },
  raw_transcription: {
    icon: FileCode,
    iconColor: "var(--color-yellow-500)",
  },
};

export function AdminArtifacts({ botDetails, botUuid }: AdminArtifactsProps) {
  const hasTranscription = botDetails.artifacts?.some(
    (artifact) => artifact.type === "transcription",
  );
  const artifacts =
    botDetails.artifacts
      ?.filter((artifact) => artifact.uploaded)
      .map((artifact) => {
        // Type guard: backend filters out screenshots, but TypeScript doesn't know that
        if (artifact.type === "screenshots") return null;
        const config = artifactTypeConfig[artifact.type];
        if (!config) return null;

        const title = `${botUuid} - ${artifact.type}`;

        const normalizedExtension = artifact.extension
          .replace(/^\./, "")
          .toLowerCase();
        const fileName = `${botUuid} - ${artifact.type}.${normalizedExtension}`;
        return (
          <FileCard
            key={artifact.s3_key}
            icon={config.icon}
            iconColor={config.iconColor}
            title={title}
            date={artifact.uploaded_at ?? null}
            url={artifact.signed_url ?? null}
            fileName={fileName}
            botUuid={botUuid}
            hasTranscription={hasTranscription}
            isVideo={artifact.type === "video"}
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

  return (
    <div className="space-y-3">
      {artifacts}
      {botDetails.meetingPlatform !== "zoom" && (
        <Screenshots botUuid={botUuid} endedAt={botDetails.endedAt} />
      )}
    </div>
  );
}
