import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { GoogleWorkspacesView } from "@/components/google-workspaces/view"
import { axiosGetInstance } from "@/lib/api-client"
import { GET_MEET_LOGIN_UTILIZATION, GET_SESSION, LIST_MEET_WORKSPACES } from "@/lib/api-routes"
import { createPageMetadata } from "@/lib/metadata"
import {
  type MeetLoginUtilizationResponse,
  meetLoginUtilizationResponseSchema
} from "@/lib/schemas/meet-logins"
import {
  type MeetWorkspaceListResponse,
  meetWorkspaceListResponseSchema
} from "@/lib/schemas/meet-workspaces"
import { type SessionResponse, sessionResponseSchema } from "@/lib/schemas/session"

export const metadata: Metadata = createPageMetadata({
  title: "Google Workspaces",
  description: "Manage SAML SSO workspaces for authenticated Google Meet bots"
})

export default async function GoogleWorkspacesPage({
  searchParams
}: {
  searchParams: Promise<{ new?: string | string[] | undefined }>
}) {
  const params = await searchParams
  const newParam = params.new
  const isNew = newParam === "true" || (Array.isArray(newParam) && newParam[0] === "true")

  const cookieStore = await cookies()
  const session = await axiosGetInstance<SessionResponse>(GET_SESSION, sessionResponseSchema, {
    headers: { Cookie: cookieStore.toString() }
  })
  const redirectSearchParams = new URLSearchParams()
  redirectSearchParams.set("redirectTo", "/google-workspaces")
  if (!session) {
    return redirect(`/sign-in?${redirectSearchParams.toString()}`)
  }

  const [workspaces, utilization] = await Promise.all([
    axiosGetInstance<MeetWorkspaceListResponse>(
      LIST_MEET_WORKSPACES,
      meetWorkspaceListResponseSchema,
      { headers: { Cookie: cookieStore.toString() } }
    ),
    axiosGetInstance<MeetLoginUtilizationResponse>(
      GET_MEET_LOGIN_UTILIZATION,
      meetLoginUtilizationResponseSchema,
      { headers: { Cookie: cookieStore.toString() } }
    )
  ])

  return (
    <section>
      <GoogleWorkspacesView
        workspaces={workspaces?.data ?? []}
        utilization={utilization.data}
        newWorkspace={isNew}
      />
    </section>
  )
}
