import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Viewer } from "@/components/viewer";
import type { APIError } from "@/lib/api-client";
import { axiosGetInstance } from "@/lib/api-client";
import {
  ADMIN_GET_BOT_DETAILS,
  GET_BOT_DETAILS,
  GET_SESSION,
} from "@/lib/api-routes";
import {
  type GetAdminBotDetailsResponse,
  getAdminBotDetailsResponseSchema,
} from "@/lib/schemas/admin";
import {
  type ArtifactWithSignedUrl,
  type BotDetails,
  botDetailsResponseSchema,
} from "@/lib/schemas/bots";
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

  const isAdmin = session.user.role === "admin";

  // Fetch bot details - use admin API if user is admin, otherwise use regular API
  let videoArtifact: ArtifactWithSignedUrl | undefined;
  let transcriptionArtifact: ArtifactWithSignedUrl | undefined;

  if (isAdmin) {
    const adminBotDetails = await axiosGetInstance<GetAdminBotDetailsResponse>(
      ADMIN_GET_BOT_DETAILS(bot_uuid),
      getAdminBotDetailsResponseSchema,
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
      },
    );

    // Find video and transcription artifacts from admin response
    videoArtifact = adminBotDetails.data.artifacts?.find(
      (artifact) =>
        artifact.type === "video" && artifact.uploaded && artifact.signed_url,
    );

    transcriptionArtifact = adminBotDetails.data.artifacts?.find(
      (artifact) =>
        artifact.type === "transcription" &&
        artifact.uploaded &&
        artifact.signed_url,
    );
  } else {
    const botDetails = await axiosGetInstance<{
      data: BotDetails;
      success: boolean;
    }>(GET_BOT_DETAILS(bot_uuid), botDetailsResponseSchema, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    // Find video and transcription artifacts from regular response
    videoArtifact = botDetails.data.artifacts?.find(
      (artifact) =>
        artifact.type === "video" && artifact.uploaded && artifact.signed_url,
    );

    transcriptionArtifact = botDetails.data.artifacts?.find(
      (artifact) =>
        artifact.type === "transcription" &&
        artifact.uploaded &&
        artifact.signed_url,
    );
  }

  // Throw error only if video is missing (video is required)
  if (!videoArtifact?.signed_url) {
    const error = new Error(
      "Missing required video artifact. The bot may not have completed processing yet.",
    ) as APIError;
    error.errorResponse = {
      success: false,
      error: "Missing required video artifact",
      code: "MISSING_ARTIFACTS",
    };
    throw error;
  }

  return (
    <Viewer
      videoUrl={videoArtifact.signed_url}
      transcriptionUrl={transcriptionArtifact?.signed_url ?? null}
    />
  );
}
