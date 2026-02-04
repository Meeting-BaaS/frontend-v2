import type { Metadata } from "next"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { ViewBotDetails } from "@/components/bots/details"
import { axiosGetInstance } from "@/lib/api-client"
import { GET_BOT_DETAILS, GET_SESSION } from "@/lib/api-routes"
import { createPageMetadata } from "@/lib/metadata"
import { type BotDetailsResponse, botDetailsResponseSchema } from "@/lib/schemas/bots"
import { slugRequestParamsSchema } from "@/lib/schemas/common"
import { type SessionResponse, sessionResponseSchema } from "@/lib/schemas/session"

export const metadata: Metadata = createPageMetadata({
  title: "Bot Details",
  description: "View and manage your bot details"
})

interface BotDetailsPageProps {
  params: Promise<{ slug: string }>
}

export default async function BotDetailsPage({ params }: BotDetailsPageProps) {
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
  redirectSearchParams.set("redirectTo", "/bots")
  if (!session) {
    return redirect(`/sign-in?${redirectSearchParams.toString()}`)
  }

  // Parse and validate the request params
  const { success, data: validatedParams } = slugRequestParamsSchema.safeParse(requestParams)
  if (!success) {
    return notFound()
  }

  const botDetailsResponse = await axiosGetInstance<BotDetailsResponse>(
    GET_BOT_DETAILS(validatedParams.slug),
    botDetailsResponseSchema,
    {
      headers: { Cookie: cookieStore.toString() }
    }
  )

  return <ViewBotDetails botDetails={botDetailsResponse.data} botUuid={validatedParams.slug} />
}
