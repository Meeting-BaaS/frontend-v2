import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ViewApiKeyDetails } from "@/components/api-keys/details";
import { axiosGetInstance } from "@/lib/api-client";
import { GET_API_KEY_DETAILS, GET_SESSION } from "@/lib/api-routes";
import {
  type GetApiKeyDetailsResponse,
  getApiKeyDetailsResponseSchema,
} from "@/lib/schemas/api-keys";
import {
  type SessionResponse,
  sessionResponseSchema,
} from "@/lib/schemas/session";
import { parseApiKeySlug } from "@/lib/utils";

interface ApiKeyDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ApiKeyDetailsPage({
  params,
}: ApiKeyDetailsPageProps) {
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
  if (!session) {
    return redirect("/sign-in");
  }

  const { slug } = await params;

  // Parse and validate the slug
  const parsed = parseApiKeySlug(slug);
  if (!parsed) {
    notFound();
  }

  const apiKeyDetails = await axiosGetInstance<GetApiKeyDetailsResponse>(
    GET_API_KEY_DETAILS,
    getApiKeyDetailsResponseSchema,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      params: {
        timestamp: parsed.timestamp.toString(),
        id: parsed.id.toString(),
      },
    },
  );

  return <ViewApiKeyDetails apiKeyDetails={apiKeyDetails.data} />;
}
