import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LogsView } from "@/components/logs/view";
import { axiosGetInstance } from "@/lib/api-client";
import { GET_SESSION, LIST_API_KEYS } from "@/lib/api-routes";
import {
  type ApiKeyListResponse,
  apiKeyListResponseSchema,
} from "@/lib/schemas/api-keys";
import { ListApiLogsRequestQuerySchema } from "@/lib/schemas/api-logs";
import {
  type SessionResponse,
  sessionResponseSchema,
} from "@/lib/schemas/session";

interface LogsPageProps {
  searchParams: Promise<{
    cursor?: string | string[] | undefined;
    createdBefore?: string | string[] | undefined;
    createdAfter?: string | string[] | undefined;
    responseStatus?: string | string[] | undefined;
    apiKeyId?: string | string[] | undefined;
  }>;
}

export default async function LogsPage({ searchParams }: LogsPageProps) {
  const params = await searchParams;

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
  redirectSearchParams.set("redirectTo", "/logs");
  if (!session) {
    return redirect(`/sign-in?${redirectSearchParams.toString()}`);
  }

  const { success, data: validatedParams } =
    ListApiLogsRequestQuerySchema.safeParse(params);

  if (!success) {
    // If params aren't valid, return logs without any filtering/pagination
    return redirect("/logs");
  }

  // Fetch API keys for the filter dropdown
  const apiKeys = await axiosGetInstance<ApiKeyListResponse>(
    LIST_API_KEYS,
    apiKeyListResponseSchema,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );

  return (
    <section>
      <LogsView params={validatedParams ?? null} apiKeys={apiKeys ?? []} />
    </section>
  );
}
