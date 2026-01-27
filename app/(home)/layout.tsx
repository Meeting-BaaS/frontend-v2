import type { Metadata } from "next"
import { cookies } from "next/headers"
import type { ReactNode } from "react"
import { cache } from "react"
import { LayoutContent } from "@/components/layout/layout-content"
import { axiosGetInstance } from "@/lib/api-client"
import { GET_CONFIGURATION, GET_SESSION, GET_TEAM_DETAILS } from "@/lib/api-routes"
import {
  type ConfigurationResponse,
  configurationResponseSchema
} from "@/lib/schemas/configuration"
import { type SessionResponse, sessionResponseSchema } from "@/lib/schemas/session"
import { type TeamDetailsResponse, teamDetailsResponseSchema } from "@/lib/schemas/teams"

export const metadata: Metadata = {
  title: "Dashboard | Meeting BaaS",
  description: "Meeting BaaS Dashboard"
}

// Cache the configuration fetch to deduplicate requests within the same render
// This uses React's cache() which is the recommended approach for Next.js App Router
// The configuration rarely changes, so this is safe to cache
const getConfiguration = cache(async (): Promise<ConfigurationResponse | null> => {
  try {
    return await axiosGetInstance<ConfigurationResponse>(
      GET_CONFIGURATION,
      configurationResponseSchema
    )
  } catch (error) {
    console.error("Failed to fetch configuration:", error)
    return null
  }
})

export default async function HomeLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  // Fetch configuration (cached, no auth required)
  const configuration = await getConfiguration()

  // Redirect if user is not logged in
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

  const teamDetails = await axiosGetInstance<TeamDetailsResponse>(
    GET_TEAM_DETAILS,
    teamDetailsResponseSchema,
    {
      headers: {
        Cookie: cookieStore.toString()
      }
    }
  )

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
