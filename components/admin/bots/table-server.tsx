import { cookies } from "next/headers";
import { AdminBotsTable } from "@/components/admin/bots/table";
import { axiosGetInstance } from "@/lib/api-client";
import { ADMIN_LIST_BOTS } from "@/lib/api-routes";
import {
  type ListAllBotsRequestQueryParams,
  type ListAllBotsResponse,
  listAllBotsResponseSchema,
} from "@/lib/schemas/admin";

interface AdminBotsTableServerProps {
  params: ListAllBotsRequestQueryParams | null;
}

export async function AdminBotsTableServer({
  params,
}: AdminBotsTableServerProps) {
  const cookieStore = await cookies();

  const botList = await axiosGetInstance<ListAllBotsResponse>(
    ADMIN_LIST_BOTS,
    listAllBotsResponseSchema,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      params: {
        cursor: params?.cursor ?? null,
        botId: params?.botId ?? null,
        botName: params?.botName ?? null,
        createdBefore: params?.createdBefore ?? null,
        createdAfter: params?.createdAfter ?? null,
        endedAfter: params?.endedAfter ?? null,
        meetingUrl: params?.meetingUrl ?? null,
        meetingPlatform: params?.meetingPlatform?.join(",") ?? null,
        status: params?.status?.join(",") ?? null,
        teamName: params?.teamName ?? null,
        teamId: params?.teamId ?? null,
        limit: params?.limit ?? 50,
      },
    },
  );

  return (
    <AdminBotsTable
      bots={botList.data}
      prevCursor={botList.prev_cursor}
      nextCursor={botList.cursor}
      params={params}
    />
  );
}
