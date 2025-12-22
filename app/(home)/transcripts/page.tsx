import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TranscriptsView } from "@/components/transcripts/view";
import { axiosGetInstance } from "@/lib/api-client";
import { GET_SESSION } from "@/lib/api-routes";
import { ListBotsRequestQuerySchema } from "@/lib/schemas/bots";
import {
  type SessionResponse,
  sessionResponseSchema,
} from "@/lib/schemas/session";

interface TranscriptsPageProps {
  searchParams: Promise<{
    cursor?: string | string[] | undefined;
    botUuid?: string | string[] | undefined;
    createdBefore?: string | string[] | undefined;
    createdAfter?: string | string[] | undefined;
    meetingPlatform?: string | string[] | undefined;
    provider?: string | string[] | undefined;
  }>;
}

export default async function TranscriptsPage({
  searchParams,
}: TranscriptsPageProps) {
  const params = await searchParams;

  // Redirect if user is not logged in
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
  redirectSearchParams.set("redirectTo", "/transcripts");
  if (!session) {
    return redirect(`/sign-in?${redirectSearchParams.toString()}`);
  }

  const { success, data: validatedParams } =
    ListBotsRequestQuerySchema.safeParse(params);

  if (!success) {
    return redirect("/transcripts");
  }

  return (
    <section>
      <TranscriptsView params={validatedParams ?? null} />
    </section>
  );
}
