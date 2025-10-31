import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BotsView } from "@/components/bots/view";
import { axiosGetInstance } from "@/lib/api-client";
import { GET_SESSION, LIST_BOTS } from "@/lib/api-routes";
import {
  type BotsListResponse,
  botsListResponseSchema,
} from "@/lib/schemas/bots";
import {
  type SessionResponse,
  sessionResponseSchema,
} from "@/lib/schemas/session";

interface BotsPageProps {
  searchParams: Promise<{ cursor?: string | string[] | undefined }>;
}

export default async function BotsPage({ searchParams }: BotsPageProps) {
  const { cursor } = await searchParams;
  if (cursor && Array.isArray(cursor)) {
    throw new Error("Cursor cannot be an array");
  }
  // Redirect if user is not logged in
  // It is recommended to verify session on each page
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
  redirectSearchParams.set("redirectTo", "/bots");
  if (!session) {
    return redirect(`/sign-in?${redirectSearchParams.toString()}`);
  }

  const botList = await axiosGetInstance<BotsListResponse>(
    LIST_BOTS,
    botsListResponseSchema,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      params: {
        cursor: cursor ?? null,
      },
    },
  );

  return (
    <section>
      <BotsView botList={botList} />
    </section>
  );
}
