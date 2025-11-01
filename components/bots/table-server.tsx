import { cookies } from "next/headers";
import { axiosGetInstance } from "@/lib/api-client";
import { LIST_BOTS } from "@/lib/api-routes";
import {
  type BotsListResponse,
  botsListResponseSchema,
  type ListBotsRequestQueryParams,
} from "@/lib/schemas/bots";
import { BotsTable } from "./table";

interface BotsTableServerProps {
  params: ListBotsRequestQueryParams | null;
}

export async function BotsTableServer({ params }: BotsTableServerProps) {
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
        botUuid: params?.botUuid ?? null,
        createdBefore: params?.createdBefore ?? null,
        createdAfter: params?.createdAfter ?? null,
        meetingPlatform: params?.meetingPlatform?.join(",") ?? null,
        status: params?.status?.join(",") ?? null,
      },
    },
  );

  return (
    <BotsTable
      bots={botList.data}
      prevCursor={botList.prevCursor}
      nextCursor={botList.cursor}
      params={params}
    />
  );
}
