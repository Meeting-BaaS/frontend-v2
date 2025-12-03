import { cookies } from "next/headers";
import { ScheduledBotsTable } from "@/components/scheduled-bots/table";
import { axiosGetInstance } from "@/lib/api-client";
import { LIST_SCHEDULED_BOTS } from "@/lib/api-routes";
import {
  type ListScheduledBotsRequestQueryParams,
  type ScheduledBotsListResponse,
  scheduledBotsListResponseSchema,
} from "@/lib/schemas/scheduled-bots";

interface ScheduledBotsTableServerProps {
  params: ListScheduledBotsRequestQueryParams | null;
}

export async function ScheduledBotsTableServer({
  params,
}: ScheduledBotsTableServerProps) {
  const cookieStore = await cookies();

  const scheduledBotsResponse =
    await axiosGetInstance<ScheduledBotsListResponse>(
      LIST_SCHEDULED_BOTS,
      scheduledBotsListResponseSchema,
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
        params: {
          cursor: params?.cursor ?? null,
          bot_id: params?.botUuid ?? null,
          meeting_url: params?.meetingUrl ?? null,
          scheduled_before: params?.scheduledBefore ?? null,
          scheduled_after: params?.scheduledAfter ?? null,
          meeting_platform: params?.meetingPlatform?.join(",") ?? null,
          status: params?.status?.join(",") ?? null,
        },
      },
    );

  return (
    <ScheduledBotsTable
      bots={scheduledBotsResponse.data}
      prevCursor={scheduledBotsResponse.prev_cursor}
      nextCursor={scheduledBotsResponse.cursor}
      params={params}
    />
  );
}
