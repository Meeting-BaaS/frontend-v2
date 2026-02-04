import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { TeamCreatedSuccessContent } from "@/components/utility/team-created-success-content"
import { axiosGetInstance } from "@/lib/api-client"
import { GET_SESSION, LIST_ACTIVE_SUBSCRIPTIONS } from "@/lib/api-routes"
import { createPageMetadata } from "@/lib/metadata"
import { type SessionResponse, sessionResponseSchema } from "@/lib/schemas/session"
import {
  type ListActiveSubscriptionsResponse,
  listActiveSubscriptionsResponseSchema
} from "@/lib/schemas/settings"
import { teamCreatedSuccessSearchParamsSchema } from "@/lib/validators"

export const metadata: Metadata = createPageMetadata({
  title: "Team Created",
  description: "Your team has been created successfully"
})

interface TeamCreatedSuccessPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function TeamCreatedSuccessPage({
  searchParams
}: TeamCreatedSuccessPageProps) {
  // Session check - users must be signed in
  const cookieStore = await cookies()
  const session = await axiosGetInstance<SessionResponse>(GET_SESSION, sessionResponseSchema, {
    headers: {
      Cookie: cookieStore.toString()
    }
  })

  if (!session) {
    return redirect("/sign-in")
  }

  // Validate search params with Zod schema
  const searchParamsObj = await searchParams
  const { data: validatedSearchParams, error } =
    teamCreatedSuccessSearchParamsSchema.safeParse(searchParamsObj)

  if (!validatedSearchParams || error) {
    // Redirect to home if invalid params
    return redirect("/bots")
  }

  // Fetch active subscription for the team
  // If not found, throw error to be caught by error boundary
  const subscriptions = await axiosGetInstance<ListActiveSubscriptionsResponse>(
    `${LIST_ACTIVE_SUBSCRIPTIONS}?referenceId=${validatedSearchParams.teamId}`,
    listActiveSubscriptionsResponseSchema,
    {
      headers: {
        Cookie: cookieStore.toString()
      }
    }
  )

  // Find active subscription (not trial, not already canceled)
  const activeSubscription = subscriptions.find(
    (sub) => (sub.status === "active" || sub.status === "trialing") && sub.stripeSubscriptionId
  )

  // If subscription not found, redirect to pending page
  // This handles cases where the Stripe webhook hasn't arrived yet
  if (!activeSubscription) {
    const pendingRedirectUrl = new URLSearchParams()
    pendingRedirectUrl.set("teamId", validatedSearchParams.teamId.toString())
    pendingRedirectUrl.set("teamSlug", validatedSearchParams.teamSlug)
    return redirect(`/team-creation-pending?${pendingRedirectUrl.toString()}`)
  }

  return (
    <TeamCreatedSuccessContent
      teamId={validatedSearchParams.teamId}
      teamSlug={validatedSearchParams.teamSlug}
    />
  )
}
