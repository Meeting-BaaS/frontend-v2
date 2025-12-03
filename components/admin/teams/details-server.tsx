import { cookies } from "next/headers";
import { AdminTeamDetails } from "@/components/admin/teams/details";
import { axiosGetInstance } from "@/lib/api-client";
import { ADMIN_GET_TEAM_DETAILS } from "@/lib/api-routes";
import {
  type GetAdminTeamDetailsResponse,
  getAdminTeamDetailsResponseSchema,
} from "@/lib/schemas/admin";

interface AdminTeamDetailsServerProps {
  teamId: number;
}

export async function AdminTeamDetailsServer({
  teamId,
}: AdminTeamDetailsServerProps) {
  const cookieStore = await cookies();

  const teamDetails = await axiosGetInstance<GetAdminTeamDetailsResponse>(
    ADMIN_GET_TEAM_DETAILS(teamId),
    getAdminTeamDetailsResponseSchema,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );

  return <AdminTeamDetails teamDetails={teamDetails.data} teamId={teamId} />;
}
