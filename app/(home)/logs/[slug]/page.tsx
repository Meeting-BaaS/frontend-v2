import type { Metadata } from "next"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { ViewLogDetails } from "@/components/logs/details"
import { axiosGetInstance } from "@/lib/api-client"
import { GET_API_LOG_DETAILS, GET_SESSION } from "@/lib/api-routes"
import { createPageMetadata } from "@/lib/metadata"
import { type ApiLogDetailsResponse, apiLogDetailsResponseSchema } from "@/lib/schemas/api-logs"
import { type SessionResponse, sessionResponseSchema } from "@/lib/schemas/session"

export const metadata: Metadata = createPageMetadata({
  title: "Log Details",
  description: "View API log details"
})

interface LogDetailsPageProps {
  params: Promise<{ slug: string }>
}

export default async function LogDetailsPage({ params }: LogDetailsPageProps) {
  const requestParams = await params

  // Redirect if user is not logged in
  // It is recommended to verify session on each page
  const cookieStore = await cookies()
  const session = await axiosGetInstance<SessionResponse>(GET_SESSION, sessionResponseSchema, {
    headers: {
      Cookie: cookieStore.toString()
    }
  })
  const redirectSearchParams = new URLSearchParams()
  // We haven't validated the request params yet, so we shouldn't redirect to the specific log details page
  redirectSearchParams.set("redirectTo", "/logs")
  if (!session) {
    return redirect(`/sign-in?${redirectSearchParams.toString()}`)
  }

  // Parse the slug to extract the log ID
  const logId = Number.parseInt(requestParams.slug, 10)
  if (Number.isNaN(logId)) {
    return notFound()
  }

  const logDetailsResponse = await axiosGetInstance<ApiLogDetailsResponse>(
    GET_API_LOG_DETAILS,
    apiLogDetailsResponseSchema,
    {
      headers: { Cookie: cookieStore.toString() },
      params: { id: logId }
    }
  )

  if (!logDetailsResponse) {
    return notFound()
  }

  return <ViewLogDetails logDetails={logDetailsResponse.data} />
}
