import type { Metadata } from "next"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { ViewAlertRuleDetails } from "@/components/alerts/details"
import { axiosGetInstance } from "@/lib/api-client"
import { GET_SESSION, GET_ALERT_RULE_DETAILS, LIST_ALERT_HISTORY } from "@/lib/api-routes"
import { createPageMetadata } from "@/lib/metadata"
import { slugRequestParamsSchema } from "@/lib/schemas/common"
import { type SessionResponse, sessionResponseSchema } from "@/lib/schemas/session"
import {
  type GetAlertRuleDetailsResponse,
  getAlertRuleDetailsResponseSchema,
  type ListAlertHistoryResponse,
  listAlertHistoryResponseSchema,
} from "@/lib/schemas/alerts"

export const metadata: Metadata = createPageMetadata({
  title: "Alert Rule Details",
  description: "View and manage your alert rule",
})

interface AlertRuleDetailsPageProps {
  params: Promise<{ slug: string }>
}

export default async function AlertRuleDetailsPage({
  params,
}: AlertRuleDetailsPageProps) {
  const requestParams = await params

  const cookieStore = await cookies()
  const session = await axiosGetInstance<SessionResponse>(
    GET_SESSION,
    sessionResponseSchema,
    { headers: { Cookie: cookieStore.toString() } },
  )

  const redirectSearchParams = new URLSearchParams()
  redirectSearchParams.set("redirectTo", "/alerts")
  if (!session) {
    return redirect(`/sign-in?${redirectSearchParams.toString()}`)
  }

  const { success, data: validatedParams } =
    slugRequestParamsSchema.safeParse(requestParams)
  if (!success) {
    return notFound()
  }

  const [ruleDetails, alertHistory] = await Promise.all([
    axiosGetInstance<GetAlertRuleDetailsResponse>(
      GET_ALERT_RULE_DETAILS,
      getAlertRuleDetailsResponseSchema,
      {
        headers: { Cookie: cookieStore.toString() },
        params: { ruleId: validatedParams.slug },
      },
    ),
    axiosGetInstance<ListAlertHistoryResponse>(
      LIST_ALERT_HISTORY,
      listAlertHistoryResponseSchema,
      {
        headers: { Cookie: cookieStore.toString() },
        params: { ruleId: validatedParams.slug, limit: 50, offset: 0 },
      },
    ),
  ])

  return (
    <ViewAlertRuleDetails
      alertRule={ruleDetails.data}
      alertHistory={alertHistory.data}
    />
  )
}
