import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Viewer } from "@/components/viewer";
import type { APIError } from "@/lib/api-client";
import { axiosGetInstance } from "@/lib/api-client";
import { GET_BOT_DETAILS, GET_SESSION } from "@/lib/api-routes";
import { type BotDetails, botDetailsResponseSchema } from "@/lib/schemas/bots";
import { slugSchema } from "@/lib/schemas/common";
import {
  type SessionResponse,
  sessionResponseSchema,
} from "@/lib/schemas/session";

interface ViewerPageProps {
  params: Promise<{ bot_uuid: string }>;
}

export default async function ViewerPage({ params }: ViewerPageProps) {
  const requestParams = await params;
  const { bot_uuid } = requestParams;
  const cookieStore = await cookies();

  // Validate bot_uuid
  const uuidValidation = slugSchema.safeParse(bot_uuid);
  if (!uuidValidation.success) {
    const error = new Error("Invalid bot UUID") as APIError;
    error.errorResponse = {
      success: false,
      error: "Invalid bot UUID",
      code: "INVALID_BOT_UUID",
    };
    throw error;
  }

  // Session check - users must be signed in
  const session = await axiosGetInstance<SessionResponse>(
    GET_SESSION,
    sessionResponseSchema,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );

  if (!session) {
    return redirect("/sign-in");
  }

  // Fetch bot details
  const botDetails = await axiosGetInstance<{
    data: BotDetails;
    success: boolean;
  }>(GET_BOT_DETAILS(bot_uuid), botDetailsResponseSchema, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  // Find video and transcription artifacts
  const videoArtifact = botDetails.data.artifacts?.find(
    (artifact) =>
      artifact.type === "video" && artifact.uploaded && artifact.signed_url,
  );

  const transcriptionArtifact = botDetails.data.artifacts?.find(
    (artifact) =>
      artifact.type === "transcription" &&
      artifact.uploaded &&
      artifact.signed_url,
  );

  // Throw error if either video or transcription is missing
  if (!videoArtifact?.signed_url || !transcriptionArtifact?.signed_url) {
    const missing = [];
    if (!videoArtifact?.signed_url) missing.push("video");
    if (!transcriptionArtifact?.signed_url) missing.push("transcription");

    const error = new Error(
      `Missing required artifacts: ${missing.join(", ")}. The bot may not have completed processing yet.`,
    ) as APIError;
    error.errorResponse = {
      success: false,
      error: `Missing required artifacts: ${missing.join(", ")}`,
      code: "MISSING_ARTIFACTS",
    };
    throw error;
  }

  return (
    <Viewer
      videoUrl={videoArtifact.signed_url}
      transcriptionUrl={transcriptionArtifact.signed_url}
    />
  );
}
