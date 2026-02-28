import type { Metadata } from "next"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { AlertDetailView } from "@/components/alerts/detail-view"
import { axiosGetInstance } from "@/lib/api-client"
import { GET_ALERT_RULE_DETAILS, GET_SESSION, LIST_ALERT_HISTORY } from "@/lib/api-routes"
import { getConfiguration } from "@/lib/get-configuration"
import { createPageMetadata } from "@/lib/metadata"
import {
  type GetAlertRuleDetailsResponse,
  type ListAlertHistoryResponse,
  getAlertRuleDetailsResponseSchema,
  listAlertHistoryResponseSchema
} from "@/lib/schemas/alerts"
import { slugRequestParamsSchema } from "@/lib/schemas/common"
import { type SessionResponse, sessionResponseSchema } from "@/lib/schemas/session"

export const metadata: Metadata = createPageMetadata({
  title: "Alert Details",
  description: "View alert rule details and history"
})

interface AlertDetailsPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ cursor?: string }>
}

export default async function AlertDetailsPage({
  params,
  searchParams
}: AlertDetailsPageProps) {
  const requestParams = await params
  const { cursor } = await searchParams

  const cookieStore = await cookies()
  const session = await axiosGetInstance<SessionResponse>(GET_SESSION, sessionResponseSchema, {
    headers: {
      Cookie: cookieStore.toString()
    }
  })
  const redirectSearchParams = new URLSearchParams()
  redirectSearchParams.set("redirectTo", "/alerts")
  if (!session) {
    return redirect(`/sign-in?${redirectSearchParams.toString()}`)
  }

  const configuration = await getConfiguration()
  if (!configuration?.data?.features?.stripe) {
    return redirect("/")
  }

  const { success, data: validatedParams } = slugRequestParamsSchema.safeParse(requestParams)
  if (!success) {
    return notFound()
  }

  const [ruleDetails, alertHistory] = await Promise.all([
    axiosGetInstance<GetAlertRuleDetailsResponse>(
      GET_ALERT_RULE_DETAILS,
      getAlertRuleDetailsResponseSchema,
      {
        headers: { Cookie: cookieStore.toString() },
        params: { ruleId: validatedParams.slug }
      }
    ),
    axiosGetInstance<ListAlertHistoryResponse>(
      LIST_ALERT_HISTORY,
      listAlertHistoryResponseSchema,
      {
        headers: { Cookie: cookieStore.toString() },
        params: {
          ruleId: validatedParams.slug,
          cursor: cursor ?? null
        }
      }
    )
  ])

  return (
    <AlertDetailView
      rule={ruleDetails.data}
      history={alertHistory.data || []}
      nextCursor={alertHistory.nextCursor}
    />
  )
}
