import type { Metadata } from "next"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { WorkspaceDetailView } from "@/components/google-workspaces/detail-view"
import { axiosGetInstance } from "@/lib/api-client"
import { GET_MEET_WORKSPACE, GET_SESSION, LIST_MEET_LOGINS } from "@/lib/api-routes"
import { createPageMetadata } from "@/lib/metadata"
import { slugRequestParamsSchema } from "@/lib/schemas/common"
import { type MeetLoginListResponse, meetLoginListResponseSchema } from "@/lib/schemas/meet-logins"
import {
  type MeetWorkspaceSingleResponse,
  meetWorkspaceSingleResponseSchema
} from "@/lib/schemas/meet-workspaces"
import { type SessionResponse, sessionResponseSchema } from "@/lib/schemas/session"

export const metadata: Metadata = createPageMetadata({
  title: "Workspace Details",
  description: "View and manage a Google Workspace and its logins"
})

interface WorkspaceDetailsPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ created?: string | string[] | undefined }>
}

export default async function WorkspaceDetailsPage({
  params,
  searchParams
}: WorkspaceDetailsPageProps) {
  const requestParams = await params
  const { created: createdParam } = await searchParams
  const justCreated =
    createdParam === "true" || (Array.isArray(createdParam) && createdParam[0] === "true")

  const cookieStore = await cookies()
  const session = await axiosGetInstance<SessionResponse>(GET_SESSION, sessionResponseSchema, {
    headers: { Cookie: cookieStore.toString() }
  })
  const redirectSearchParams = new URLSearchParams()
  redirectSearchParams.set("redirectTo", "/google-workspaces")
  if (!session) {
    return redirect(`/sign-in?${redirectSearchParams.toString()}`)
  }

  const { success, data: validatedParams } = slugRequestParamsSchema.safeParse(requestParams)
  if (!success) {
    return notFound()
  }

  const [workspace, allLogins] = await Promise.all([
    axiosGetInstance<MeetWorkspaceSingleResponse>(
      GET_MEET_WORKSPACE(validatedParams.slug),
      meetWorkspaceSingleResponseSchema,
      { headers: { Cookie: cookieStore.toString() } }
    ),
    axiosGetInstance<MeetLoginListResponse>(LIST_MEET_LOGINS, meetLoginListResponseSchema, {
      headers: { Cookie: cookieStore.toString() }
    })
  ])

  // The v2 list endpoint returns all logins for the team and doesn't accept a
  // workspace_id query param yet — filter client-side. Acceptable while teams
  // have a small number of logins; revisit with a server-side filter param if
  // we see customers with hundreds.
  const workspaceLogins = (allLogins?.data ?? []).filter(
    (login) => login.workspace_id === workspace.data.workspace_id
  )

  return (
    <WorkspaceDetailView
      workspace={workspace.data}
      logins={workspaceLogins}
      justCreated={justCreated}
    />
  )
}
