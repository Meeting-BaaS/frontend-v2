import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CreateTeamContent } from "@/components/utility/create-team-content";
import { axiosGetInstance } from "@/lib/api-client";
import { GET_SESSION, GET_TEAM_DETAILS } from "@/lib/api-routes";
import {
  type SessionResponse,
  sessionResponseSchema,
} from "@/lib/schemas/session";
import {
  type TeamDetailsResponse,
  teamDetailsResponseSchema,
} from "@/lib/schemas/teams";

export default async function CreateTeamPage() {
  // Session check - users must be signed in
  const cookieStore = await cookies();
  const session = await axiosGetInstance<SessionResponse>(
    GET_SESSION,
    sessionResponseSchema,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );

  if (!session) {
    return redirect("/sign-in");
  }

  const teamDetails = await axiosGetInstance<TeamDetailsResponse>(
    GET_TEAM_DETAILS,
    teamDetailsResponseSchema,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );

  if (teamDetails.data.length > 0) {
    return redirect("/bots");
  }

  return <CreateTeamContent />;
}
