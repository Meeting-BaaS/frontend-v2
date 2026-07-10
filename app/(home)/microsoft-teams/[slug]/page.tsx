import type { Metadata } from "next"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { TeamsWorkspaceDetailView } from "@/components/microsoft-teams/detail-view"
import { axiosGetInstance } from "@/lib/api-client"
import { GET_SESSION, GET_TEAMS_WORKSPACE, LIST_TEAMS_LOGINS } from "@/lib/api-routes"
import { createPageMetadata } from "@/lib/metadata"
import { slugRequestParamsSchema } from "@/lib/schemas/common"
import { type SessionResponse, sessionResponseSchema } from "@/lib/schemas/session"
import {
  type TeamsLoginListResponse,
  teamsLoginListResponseSchema
} from "@/lib/schemas/teams-logins"
import {
  type TeamsWorkspaceSingleResponse,
  teamsWorkspaceSingleResponseSchema
} from "@/lib/schemas/teams-workspaces"

export const metadata: Metadata = createPageMetadata({
  title: "Workspace Details",
  description: "View and manage a Microsoft 365 tenant and its accounts"
})

interface WorkspaceDetailsPageProps {
  params: Promise<{ slug: string }>
}

export default async function TeamsWorkspaceDetailsPage({ params }: WorkspaceDetailsPageProps) {
  const requestParams = await params

  const cookieStore = await cookies()
  const session = await axiosGetInstance<SessionResponse>(GET_SESSION, sessionResponseSchema, {
    headers: { Cookie: cookieStore.toString() }
  })
  const redirectSearchParams = new URLSearchParams()
  redirectSearchParams.set("redirectTo", "/microsoft-teams")
  if (!session) {
    return redirect(`/sign-in?${redirectSearchParams.toString()}`)
  }

  const { success, data: validatedParams } = slugRequestParamsSchema.safeParse(requestParams)
  if (!success) {
    return notFound()
  }

  const [workspace, allLogins] = await Promise.all([
    axiosGetInstance<TeamsWorkspaceSingleResponse>(
      GET_TEAMS_WORKSPACE(validatedParams.slug),
      teamsWorkspaceSingleResponseSchema,
      { headers: { Cookie: cookieStore.toString() } }
    ),
    axiosGetInstance<TeamsLoginListResponse>(LIST_TEAMS_LOGINS, teamsLoginListResponseSchema, {
      headers: { Cookie: cookieStore.toString() }
    })
  ])

  // The v2 list endpoint returns all logins for the team and doesn't accept a
  // workspace_id query param yet — filter client-side. Acceptable while teams
  // have a small number of accounts; revisit with a server-side filter param if
  // we see customers with hundreds.
  const workspaceLogins = (allLogins?.data ?? []).filter(
    (login) => login.workspace_id === workspace.data.workspace_id
  )

  return <TeamsWorkspaceDetailView workspace={workspace.data} logins={workspaceLogins} />
}
