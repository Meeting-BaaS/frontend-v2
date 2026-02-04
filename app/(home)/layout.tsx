import type { Metadata } from "next"
import { cookies } from "next/headers"
import type { ReactNode } from "react"
import { LayoutContent } from "@/components/layout/layout-content"
import { axiosGetInstance } from "@/lib/api-client"
import { GET_SESSION, GET_TEAM_DETAILS } from "@/lib/api-routes"
import { getConfiguration } from "@/lib/get-configuration"
import { createPageMetadata } from "@/lib/metadata"
import { type SessionResponse, sessionResponseSchema } from "@/lib/schemas/session"
import { type TeamDetailsResponse, teamDetailsResponseSchema } from "@/lib/schemas/teams"

export const metadata: Metadata = createPageMetadata({
  title: "Dashboard",
  description: "Meeting BaaS Dashboard"
})

export default async function HomeLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  const cookieStore = await cookies()
  const session = await axiosGetInstance<SessionResponse>(GET_SESSION, sessionResponseSchema, {
    headers: {
      Cookie: cookieStore.toString()
    }
  })
  if (!session) {
    // Important: This is allowed to pass through
    // Because the expectation is that each individual page will handle the redirection
    // And will have a session check on the page itself
    // As per Next.js, that is the correct approach
    return children
  }

  const [configuration, teamDetails] = await Promise.all([
    getConfiguration(),
    axiosGetInstance<TeamDetailsResponse>(GET_TEAM_DETAILS, teamDetailsResponseSchema, {
      headers: {
        Cookie: cookieStore.toString()
      }
    })
  ])

  const sidebarState =
    cookieStore.get("sidebar_state") === undefined
      ? true
      : cookieStore.get("sidebar_state")?.value === "true"

  return (
    <LayoutContent
      sessionResponse={session}
      teamDetails={teamDetails.data}
      sidebarState={sidebarState}
      configuration={configuration?.data ?? null}
    >
      {children}
    </LayoutContent>
  )
}
