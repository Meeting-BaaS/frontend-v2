import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { WebhooksView } from "@/components/webhooks/view"
import { axiosGetInstance } from "@/lib/api-client"
import { GET_SESSION, LIST_WEBHOOK_ENDPOINTS, LIST_WEBHOOK_EVENTS } from "@/lib/api-routes"
import { createPageMetadata } from "@/lib/metadata"
import { type SessionResponse, sessionResponseSchema } from "@/lib/schemas/session"
import {
  type ListWebhookEndpointsResponse,
  type ListWebhookEventsResponse,
  listWebhookEndpointsResponseSchema,
  listWebhookEventsResponseSchema
} from "@/lib/schemas/webhooks"

export const metadata: Metadata = createPageMetadata({
  title: "Webhooks",
  description: "Manage your webhook endpoints"
})

export default async function WebhooksPage({
  searchParams
}: {
  searchParams: Promise<{ new?: string | string[] | undefined }>
}) {
  const params = await searchParams
  const newParam = params.new
  const isNew = newParam === "true" || (Array.isArray(newParam) && newParam[0] === "true")
  // Redirect if user is not logged in
  // It is recommended to verify session on each page
  const cookieStore = await cookies()
  const session = await axiosGetInstance<SessionResponse>(GET_SESSION, sessionResponseSchema, {
    headers: {
      Cookie: cookieStore.toString()
    }
  })
  const redirectSearchParams = new URLSearchParams()
  redirectSearchParams.set("redirectTo", "/webhooks")
  if (!session) {
    return redirect(`/sign-in?${redirectSearchParams.toString()}`)
  }

  const [webhookList, webhookEvents] = await Promise.all([
    axiosGetInstance<ListWebhookEndpointsResponse>(
      LIST_WEBHOOK_ENDPOINTS,
      listWebhookEndpointsResponseSchema,
      {
        headers: {
          Cookie: cookieStore.toString()
        }
      }
    ),
    axiosGetInstance<ListWebhookEventsResponse>(
      LIST_WEBHOOK_EVENTS,
      listWebhookEventsResponseSchema,
      {
        headers: {
          Cookie: cookieStore.toString()
        }
      }
    )
  ])

  return (
    <section>
      <WebhooksView webhookEndpoints={webhookList} webhookEvents={webhookEvents} newKey={isNew} />
    </section>
  )
}
