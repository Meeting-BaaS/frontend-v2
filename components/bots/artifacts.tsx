"use client";

import {
  CircleX,
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
            key={artifact.s3_key}
            icon={config.icon}
            iconColor={config.iconColor}
            title={title}
            date={artifact.uploaded_at ?? null}
            url={artifact.signed_url ?? null}
            fileName={fileName}
          />
        );
      })
      .filter(Boolean) ?? [];

  if (botDetails.artifacts_deleted) {
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

  if (botDetails.status === "failed") {
    return (
      <Empty className="border rounded-lg">
        <EmptyHeader>
          <EmptyMedia>
            <GradientIcon color="var(--color-red-500)" size="lg">
              <CircleX />
            </GradientIcon>
          </EmptyMedia>
          <EmptyTitle>No artifacts generated</EmptyTitle>
          <EmptyDescription>
            The bot has did not generate any artifacts.{" "}
            {botDetails.status_history &&
            botDetails.status_history.length > 0 ? (
              <div>
                <span className="font-bold">Error:</span>{" "}
                {
                  botDetails.status_history[
                    botDetails.status_history.length - 1
                  ].error_message
                }
              </div>
            ) : (
              ""
            )}
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
