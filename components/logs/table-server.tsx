import { cookies } from "next/headers";
import { axiosGetInstance } from "@/lib/api-client";
import { LIST_API_LOGS } from "@/lib/api-routes";
import {
  type ApiLogsListResponse,
  apiLogsListResponseSchema,
  type ListApiLogsRequestQueryParams,
} from "@/lib/schemas/api-logs";
import { LogsTable } from "./table";

interface LogsTableServerProps {
  params: ListApiLogsRequestQueryParams | null;
}

export async function LogsTableServer({ params }: LogsTableServerProps) {
  const cookieStore = await cookies();

  const logsList = await axiosGetInstance<ApiLogsListResponse>(
    LIST_API_LOGS,
    apiLogsListResponseSchema,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      params: {
        limit: params?.limit ?? 50,
        cursor: params?.cursor ?? null,
        createdBefore: params?.createdBefore ?? null,
        createdAfter: params?.createdAfter ?? null,
        responseStatus: params?.responseStatus?.join(",") ?? null,
        apiKeyId: params?.apiKeyId ?? null,
      },
    },
  );

  return (
    <LogsTable
      logs={logsList.data}
      prevCursor={logsList.prevCursor}
      nextCursor={logsList.cursor}
      params={params}
    />
  );
}
