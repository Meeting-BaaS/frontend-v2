import { cookies } from "next/headers";
import { MembersTable } from "@/components/settings/team/members/members-table";
import { axiosGetInstance } from "@/lib/api-client";
import { LIST_TEAM_MEMBERS } from "@/lib/api-routes";
import {
  type TeamMembersListResponse,
  teamMembersListResponseSchema,
} from "@/lib/schemas/teams";

export async function MembersTableServer() {
  const cookieStore = await cookies();

  const response = await axiosGetInstance<TeamMembersListResponse>(
    LIST_TEAM_MEMBERS,
    teamMembersListResponseSchema,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );

  return <MembersTable members={response.data.members} />;
}
