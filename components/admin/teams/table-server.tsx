import { cookies } from "next/headers";
import { AdminTeamsTable } from "@/components/admin/teams/table";
import { axiosGetInstance } from "@/lib/api-client";
import { ADMIN_LIST_TEAMS } from "@/lib/api-routes";
import {
  type ListAllTeamsRequestQueryParams,
  type ListAllTeamsResponse,
  listAllTeamsResponseSchema,
} from "@/lib/schemas/admin";

interface AdminTeamsTableServerProps {
  params: ListAllTeamsRequestQueryParams | null;
}

export async function AdminTeamsTableServer({
  params,
}: AdminTeamsTableServerProps) {
  const cookieStore = await cookies();

  const teamsList = await axiosGetInstance<ListAllTeamsResponse>(
    ADMIN_LIST_TEAMS,
    listAllTeamsResponseSchema,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      params: {
        searchEmail: params?.searchEmail ?? null,
      },
    },
  );

  return <AdminTeamsTable teams={teamsList.data} />;
}
