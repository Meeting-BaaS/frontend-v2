import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CreateNewTeamContent } from "@/components/utility/create-new-team-content";
import { axiosGetInstance } from "@/lib/api-client";
import { GET_PLANS, GET_SESSION } from "@/lib/api-routes";
import {
  type SessionResponse,
  sessionResponseSchema,
} from "@/lib/schemas/session";
import {
  type PlansResponse,
  plansResponseSchema,
} from "@/lib/schemas/settings";
import { createNewTeamSearchParamsSchema } from "@/lib/validators";

interface CreateNewTeamPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CreateNewTeamPage({
  searchParams,
}: CreateNewTeamPageProps) {
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

  // Fetch plans from server
  const plansResponse = await axiosGetInstance<PlansResponse>(
    GET_PLANS,
    plansResponseSchema,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );

  // Filter out PAYG plan - users must choose a paid plan for additional teams
  const availablePlans = plansResponse.data.plans.filter(
    (plan) => plan.type !== "payg",
  );

  // Validate search params with Zod schema
  const searchParamsObj = await searchParams;
  const { data: validatedSearchParams } =
    createNewTeamSearchParamsSchema.safeParse(searchParamsObj);

  return (
    <CreateNewTeamContent
      plans={availablePlans}
      initialTeamName={validatedSearchParams?.teamName}
      initialPlan={validatedSearchParams?.plan}
    />
  );
}
