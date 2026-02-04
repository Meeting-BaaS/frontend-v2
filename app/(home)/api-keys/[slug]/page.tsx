import type { Metadata } from "next"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { ViewApiKeyDetails } from "@/components/api-keys/details"
import { axiosGetInstance } from "@/lib/api-client"
import { GET_API_KEY_DETAILS, GET_SESSION } from "@/lib/api-routes"
import { createPageMetadata } from "@/lib/metadata"
import {
  type GetApiKeyDetailsResponse,
  getApiKeyDetailsRequestParamsSchema,
  getApiKeyDetailsResponseSchema
} from "@/lib/schemas/api-keys"
import { type SessionResponse, sessionResponseSchema } from "@/lib/schemas/session"

export const metadata: Metadata = createPageMetadata({
  title: "API Key Details",
  description: "View and manage your API key"
})

interface ApiKeyDetailsPageProps {
  params: Promise<{ slug: string }>
}

export default async function ApiKeyDetailsPage({ params }: ApiKeyDetailsPageProps) {
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
  // We haven't validated the request params yet, so we shouldn't redirect to the specific api key details page
  redirectSearchParams.set("redirectTo", "/api-keys")
  if (!session) {
    return redirect(`/sign-in?${redirectSearchParams.toString()}`)
  }

  // Parse and validate the request params
  const { success, data: validatedParams } =
    getApiKeyDetailsRequestParamsSchema.safeParse(requestParams)
  if (!success) {
    return notFound()
  }

  const apiKeyDetails = await axiosGetInstance<GetApiKeyDetailsResponse>(
    GET_API_KEY_DETAILS,
    getApiKeyDetailsResponseSchema,
    {
      headers: {
        Cookie: cookieStore.toString()
      },
      params: {
        timestamp: validatedParams.slug.timestamp,
        id: validatedParams.slug.id
      }
    }
  )

  return <ViewApiKeyDetails apiKeyDetails={apiKeyDetails.data} />
}
