import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ApiKeysView } from "@/components/api-keys/view";
import { axiosGetInstance } from "@/lib/api-client";
import { GET_SESSION, LIST_API_KEYS } from "@/lib/api-routes";
import {
  type ApiKeyListResponse,
  apiKeyListResponseSchema,
} from "@/lib/schemas/api-keys";
import {
  type SessionResponse,
  sessionResponseSchema,
} from "@/lib/schemas/session";

export default async function ApiKeysPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const newParam = params.new;
  const isNew =
    newParam === "true" || (Array.isArray(newParam) && newParam[0] === "true");
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
  redirectSearchParams.set("redirectTo", "/api-keys");
  if (!session) {
    return redirect(`/sign-in?${redirectSearchParams.toString()}`);
  }

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
      <ApiKeysView apiKeys={apiKeys} newKey={isNew} />
    </section>
  );
}
