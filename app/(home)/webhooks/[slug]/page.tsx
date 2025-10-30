import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ViewWebhookDetails } from "@/components/webhooks/details";
import { axiosGetInstance } from "@/lib/api-client";
import {
  GET_SESSION,
  GET_WEBHOOK_ENDPOINT_DETAILS,
  LIST_WEBHOOK_EVENTS,
  LIST_WEBHOOK_MESSAGES,
} from "@/lib/api-routes";
import {
  type SessionResponse,
  sessionResponseSchema,
} from "@/lib/schemas/session";
import {
  type GetWebhookEndpointDetailsResponse,
  getWebhookEndpointDetailsResponseSchema,
  type ListWebhookEventsResponse,
  type ListWebhookMessagesResponse,
  listWebhookEventsResponseSchema,
  listWebhookMessagesResponseSchema,
} from "@/lib/schemas/webhooks";

interface WebhookDetailsPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ iterator?: string }>;
}

export default async function WebhookDetailsPage({
  params,
  searchParams,
}: WebhookDetailsPageProps) {
  const { slug } = await params;
  const { iterator } = await searchParams;

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
  redirectSearchParams.set("redirectTo", `/webhooks/${slug}`);
  if (!session) {
    return redirect(`/sign-in?${redirectSearchParams.toString()}`);
  }

  const [webhookDetails, webhookEvents, webhookMessages] = await Promise.all([
    axiosGetInstance<GetWebhookEndpointDetailsResponse>(
      GET_WEBHOOK_ENDPOINT_DETAILS,
      getWebhookEndpointDetailsResponseSchema,
      {
        headers: { Cookie: cookieStore.toString() },
        params: { endpointId: slug },
      },
    ),
    axiosGetInstance<ListWebhookEventsResponse>(
      LIST_WEBHOOK_EVENTS,
      listWebhookEventsResponseSchema,
      { headers: { Cookie: cookieStore.toString() } },
    ),
    axiosGetInstance<ListWebhookMessagesResponse>(
      LIST_WEBHOOK_MESSAGES,
      listWebhookMessagesResponseSchema,
      {
        headers: { Cookie: cookieStore.toString() },
        params: { endpointId: slug, iterator: iterator ?? null },
      },
    ),
  ]);

  return (
    <ViewWebhookDetails
      webhookEndpoint={webhookDetails.data}
      allWebhookEvents={webhookEvents.data}
      webhookMessages={webhookMessages.data || []}
      prevIterator={webhookMessages.prevIterator}
      nextIterator={webhookMessages.nextIterator}
    />
  );
}
