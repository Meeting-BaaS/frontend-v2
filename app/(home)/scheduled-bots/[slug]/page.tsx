import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ViewScheduledBotDetails } from "@/components/scheduled-bots/details";
import { axiosGetInstance } from "@/lib/api-client";
import { GET_SCHEDULED_BOT_DETAILS, GET_SESSION } from "@/lib/api-routes";
import { slugRequestParamsSchema } from "@/lib/schemas/common";
import {
  type ScheduledBotDetailsResponse,
  scheduledBotDetailsResponseSchema,
} from "@/lib/schemas/scheduled-bots";
import {
  type SessionResponse,
  sessionResponseSchema,
} from "@/lib/schemas/session";

interface ScheduledBotDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ScheduledBotDetailsPage({
  params,
}: ScheduledBotDetailsPageProps) {
  const requestParams = await params;

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
  const redirectSearchParams = new URLSearchParams();
  redirectSearchParams.set("redirectTo", `/scheduled-bots`);
  if (!session) {
    return redirect(`/sign-in?${redirectSearchParams.toString()}`);
  }

  const { success, data: validatedParams } =
    slugRequestParamsSchema.safeParse(requestParams);
  if (!success) {
    return notFound();
  }

  const scheduledBotDetails =
    await axiosGetInstance<ScheduledBotDetailsResponse>(
      GET_SCHEDULED_BOT_DETAILS(validatedParams.slug),
      scheduledBotDetailsResponseSchema,
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
      },
    );

  return <ViewScheduledBotDetails botDetails={scheduledBotDetails.data} />;
}
