import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { TeamCreationPendingContent } from "@/components/utility/team-creation-pending-content"
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
  title: "Team Creation Pending",
  description: "Your team creation is in progress"
})

interface TeamCreationPendingPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function TeamCreationPendingPage({
  searchParams
}: TeamCreationPendingPageProps) {
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

  if (activeSubscription) {
    // If subscription found, redirect to success page
    const successRedirectUrl = new URLSearchParams()
    successRedirectUrl.set("teamId", validatedSearchParams.teamId.toString())
    successRedirectUrl.set("teamSlug", validatedSearchParams.teamSlug)
    return redirect(`/team-created-success?${successRedirectUrl.toString()}`)
  }

  return <TeamCreationPendingContent />
}
