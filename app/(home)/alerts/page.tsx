import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AlertsView } from "@/components/alerts/view"
import { axiosGetInstance } from "@/lib/api-client"
import { GET_SESSION, LIST_ALERT_RULES } from "@/lib/api-routes"
import { getConfiguration } from "@/lib/get-configuration"
import { createPageMetadata } from "@/lib/metadata"
import {
  type ListAlertRulesResponse,
  listAlertRulesResponseSchema
} from "@/lib/schemas/alerts"
import { type SessionResponse, sessionResponseSchema } from "@/lib/schemas/session"

export const metadata: Metadata = createPageMetadata({
  title: "Alerts",
  description: "Manage your threshold alert rules"
})

export default async function AlertsPage() {
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

  const alertRules = await axiosGetInstance<ListAlertRulesResponse>(
    LIST_ALERT_RULES,
    listAlertRulesResponseSchema,
    {
      headers: {
        Cookie: cookieStore.toString()
      }
    }
  )

  return (
    <section>
      <AlertsView rules={alertRules} />
    </section>
  )
}
