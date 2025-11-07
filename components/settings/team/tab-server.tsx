import { cookies } from "next/headers";
import { TeamContent } from "@/components/settings/team/content";
import { axiosGetInstance } from "@/lib/api-client";
import { GET_TEAM_DETAILS } from "@/lib/api-routes";
import {
  type TeamDetailsResponse,
  teamDetailsResponseSchema,
} from "@/lib/schemas/teams";

export async function TeamTab() {
  const cookieStore = await cookies();

  // Fetch team details
  const teamDetails = await axiosGetInstance<TeamDetailsResponse>(
    GET_TEAM_DETAILS,
    teamDetailsResponseSchema,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );

  // Find active team
  const activeTeam = teamDetails.data.find((team) => team.isActive);

  if (!activeTeam) {
    return (
      <div className="text-muted-foreground py-10 text-center">
        No active team found
      </div>
    );
  }

  return <TeamContent team={activeTeam} />;
}
