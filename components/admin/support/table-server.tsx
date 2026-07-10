import { cookies } from "next/headers";
import { AdminSupportTable } from "@/components/admin/support/table";
import { axiosGetInstance } from "@/lib/api-client";
import { ADMIN_LIST_SUPPORT_TICKETS } from "@/lib/api-routes";
import {
  type ListAllSupportTicketsRequestQueryParams,
  type ListAllSupportTicketsResponse,
  listAllSupportTicketsResponseSchema,
} from "@/lib/schemas/admin";

interface AdminSupportTableServerProps {
  params: ListAllSupportTicketsRequestQueryParams | null;
}

export async function AdminSupportTableServer({
  params,
}: AdminSupportTableServerProps) {
  const cookieStore = await cookies();

  const ticketsList = await axiosGetInstance<ListAllSupportTicketsResponse>(
    ADMIN_LIST_SUPPORT_TICKETS,
    listAllSupportTicketsResponseSchema,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      params: {
        cursor: params?.cursor ?? null,
        status: params?.status?.join(",") ?? null,
        module: params?.module?.join(",") ?? null,
        type: params?.type?.join(",") ?? null,
        teamName: params?.teamName ?? null,
        teamId: params?.teamId ?? null,
        botUuid: params?.botUuid ?? null,
        ticketId: params?.ticketId ?? null,
        sortBy: params?.sortBy ?? "createdAt",
        limit: params?.limit ?? 50,
      },
    },
  );

  return (
    <AdminSupportTable
      tickets={ticketsList.data}
      prevCursor={ticketsList.prev_cursor}
      nextCursor={ticketsList.cursor}
      params={params}
    />
  );
}
