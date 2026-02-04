import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { BotsView } from "@/components/bots/view"
import { axiosGetInstance } from "@/lib/api-client"
import { GET_SESSION } from "@/lib/api-routes"
import { createPageMetadata } from "@/lib/metadata"
import { ListBotsRequestQuerySchema } from "@/lib/schemas/bots"
import { type SessionResponse, sessionResponseSchema } from "@/lib/schemas/session"

export const metadata: Metadata = createPageMetadata({
  title: "Bots",
  description: "Manage your meeting bots"
})

interface BotsPageProps {
  searchParams: Promise<{
    cursor?: string | string[] | undefined
    botUuid?: string | string[] | undefined
    createdBefore?: string | string[] | undefined
    createdAfter?: string | string[] | undefined
    meetingPlatform?: string | string[] | undefined
    status?: string | string[] | undefined
  }>
}

export default async function BotsPage({ searchParams }: BotsPageProps) {
  const params = await searchParams

  // Redirect if user is not logged in
  // It is recommended to verify session on each page
  const cookieStore = await cookies()
  const session = await axiosGetInstance<SessionResponse>(GET_SESSION, sessionResponseSchema, {
    headers: {
      Cookie: cookieStore.toString()
    }
  })
  const redirectSearchParams = new URLSearchParams()
  redirectSearchParams.set("redirectTo", "/bots")
  if (!session) {
    return redirect(`/sign-in?${redirectSearchParams.toString()}`)
  }

  const { success, data: validatedParams } = ListBotsRequestQuerySchema.safeParse(params)

  if (!success) {
    // If params aren't valid, return bots without any filtering/pagination
    return redirect("/bots")
  }

  return (
    <section>
      <BotsView params={validatedParams ?? null} />
    </section>
  )
}
