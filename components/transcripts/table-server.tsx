import { cookies } from "next/headers";
import { TranscriptsTable } from "@/components/transcripts/table";
import { axiosGetInstance } from "@/lib/api-client";
import { LIST_BOTS } from "@/lib/api-routes";
import {
  type BotsListResponse,
  botsListResponseSchema,
  type ListBotsRequestQueryParams,
} from "@/lib/schemas/bots";

interface TranscriptsTableServerProps {
  params: ListBotsRequestQueryParams | null;
}

export async function TranscriptsTableServer({
  params,
}: TranscriptsTableServerProps) {
  const cookieStore = await cookies();

  const botList = await axiosGetInstance<BotsListResponse>(
    LIST_BOTS,
    botsListResponseSchema,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      params: {
        cursor: params?.cursor ?? null,
        bot_id: params?.botUuid ?? null,
        created_before: params?.createdBefore ?? null,
        created_after: params?.createdAfter ?? null,
        meeting_platform: params?.meetingPlatform?.join(",") ?? null,
        status: "completed", // Only show completed bots with transcriptions
      },
    },
  );

  // Filter to only show bots that have transcriptions
  const botsWithTranscripts = botList.data.filter((bot) =>
    bot.artifacts?.some((artifact) => artifact.type === "transcription"),
  );

  return (
    <TranscriptsTable
      bots={botsWithTranscripts}
      prevCursor={botList.prev_cursor}
      nextCursor={botList.cursor}
      params={params}
    />
  );
}
