import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ViewWebhookMessageDetails } from "@/components/webhooks/messages/details";
import { axiosGetInstance } from "@/lib/api-client";
import { GET_SESSION, GET_WEBHOOK_MESSAGE_DETAILS } from "@/lib/api-routes";
import {
  type SessionResponse,
  sessionResponseSchema,
} from "@/lib/schemas/session";
import {
  type GetWebhookMessageDetailsResponse,
  getWebhookMessageDetailsResponseSchema,
} from "@/lib/schemas/webhooks";

interface WebhookMessageDetailsPageProps {
  params: Promise<{ slug: string; message: string }>;
}

export default async function WebhookMessageDetailsPage({
  params,
}: WebhookMessageDetailsPageProps) {
  const { slug, message } = await params;

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
  redirectSearchParams.set("redirectTo", `/webhooks/${slug}/${message}`);
  if (!session) {
    return redirect(`/sign-in?${redirectSearchParams.toString()}`);
  }

  const webhookMessageDetails =
    await axiosGetInstance<GetWebhookMessageDetailsResponse>(
      GET_WEBHOOK_MESSAGE_DETAILS,
      getWebhookMessageDetailsResponseSchema,
      {
        headers: { Cookie: cookieStore.toString() },
        params: { endpointId: slug, messageId: message },
      },
    );

  return (
    <ViewWebhookMessageDetails
      webhookMessage={webhookMessageDetails.data}
      endpointId={slug}
      messageId={message}
    />
  );
}
