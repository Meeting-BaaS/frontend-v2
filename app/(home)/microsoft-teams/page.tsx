import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { MicrosoftTeamsView } from "@/components/microsoft-teams/view"
import { axiosGetInstance } from "@/lib/api-client"
import { GET_SESSION, GET_TEAMS_LOGIN_UTILIZATION, LIST_TEAMS_WORKSPACES } from "@/lib/api-routes"
import { createPageMetadata } from "@/lib/metadata"
import { type SessionResponse, sessionResponseSchema } from "@/lib/schemas/session"
import {
  type TeamsLoginUtilizationResponse,
  teamsLoginUtilizationResponseSchema
} from "@/lib/schemas/teams-logins"
import {
  type TeamsWorkspaceListResponse,
  teamsWorkspaceListResponseSchema
} from "@/lib/schemas/teams-workspaces"

export const metadata: Metadata = createPageMetadata({
  title: "Microsoft Teams",
  description: "Manage Microsoft 365 tenants and accounts for authenticated Teams bots"
})

export default async function MicrosoftTeamsPage({
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
  redirectSearchParams.set("redirectTo", "/microsoft-teams")
  if (!session) {
    return redirect(`/sign-in?${redirectSearchParams.toString()}`)
  }

  const [workspaces, utilization] = await Promise.all([
    axiosGetInstance<TeamsWorkspaceListResponse>(
      LIST_TEAMS_WORKSPACES,
      teamsWorkspaceListResponseSchema,
      { headers: { Cookie: cookieStore.toString() } }
    ),
    axiosGetInstance<TeamsLoginUtilizationResponse>(
      GET_TEAMS_LOGIN_UTILIZATION,
      teamsLoginUtilizationResponseSchema,
      { headers: { Cookie: cookieStore.toString() } }
    )
  ])

  return (
    <section>
      <MicrosoftTeamsView
        workspaces={workspaces?.data ?? []}
        utilization={utilization.data}
        newWorkspace={isNew}
      />
    </section>
  )
}
