import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ViewWebhookMessageDetails } from "@/components/webhooks/messages/details";
import { axiosGetInstance } from "@/lib/api-client";
import { GET_SESSION, GET_WEBHOOK_MESSAGE_DETAILS } from "@/lib/api-routes";
import {
  type SessionResponse,
  sessionResponseSchema,
} from "@/lib/schemas/session";
import {
  type GetWebhookMessageDetailsResponse,
  getWebhookMessageDetailsRequestParamsSchema,
  getWebhookMessageDetailsResponseSchema,
} from "@/lib/schemas/webhooks";

interface WebhookMessageDetailsPageProps {
  params: Promise<{ slug: string; message: string }>;
}

export default async function WebhookMessageDetailsPage({
  params,
}: WebhookMessageDetailsPageProps) {
  const requestParams = await params;

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
  // We haven't validated the request params yet, so we shouldn't redirect to the specific message details page
  redirectSearchParams.set("redirectTo", `/webhooks`);
  if (!session) {
    return redirect(`/sign-in?${redirectSearchParams.toString()}`);
  }

  // Parse and validate the request params
  const { success, data: validatedParams } =
    getWebhookMessageDetailsRequestParamsSchema.safeParse(requestParams);
  if (!success) {
    return notFound();
  }

  const webhookMessageDetails =
    await axiosGetInstance<GetWebhookMessageDetailsResponse>(
      GET_WEBHOOK_MESSAGE_DETAILS,
      getWebhookMessageDetailsResponseSchema,
      {
        headers: { Cookie: cookieStore.toString() },
        params: {
          endpointId: validatedParams.slug,
          messageId: validatedParams.message,
        },
      },
    );

  return (
    <ViewWebhookMessageDetails
      webhookMessage={webhookMessageDetails.data}
      endpointId={validatedParams.slug}
      messageId={validatedParams.message}
    />
  );
}
