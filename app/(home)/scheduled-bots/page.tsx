import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ScheduledBotsView } from "@/components/scheduled-bots/view"
import { axiosGetInstance } from "@/lib/api-client"
import { GET_SESSION } from "@/lib/api-routes"
import { createPageMetadata } from "@/lib/metadata"
import { ListScheduledBotsRequestQuerySchema } from "@/lib/schemas/scheduled-bots"
import { type SessionResponse, sessionResponseSchema } from "@/lib/schemas/session"

export const metadata: Metadata = createPageMetadata({
  title: "Scheduled Bots",
  description: "Manage your scheduled bots"
})

interface ScheduledBotsPageProps {
  searchParams: Promise<{
    cursor?: string | string[] | undefined
    botUuid?: string | string[] | undefined
    meetingUrl?: string | string[] | undefined
    scheduledBefore?: string | string[] | undefined
    scheduledAfter?: string | string[] | undefined
    meetingPlatform?: string | string[] | undefined
    status?: string | string[] | undefined
  }>
}

export default async function ScheduledBotsPage({ searchParams }: ScheduledBotsPageProps) {
  const params = await searchParams

  const cookieStore = await cookies()
  const session = await axiosGetInstance<SessionResponse>(GET_SESSION, sessionResponseSchema, {
    headers: {
      Cookie: cookieStore.toString()
    }
  })
  const redirectSearchParams = new URLSearchParams()
  redirectSearchParams.set("redirectTo", "/scheduled-bots")
  if (!session) {
    return redirect(`/sign-in?${redirectSearchParams.toString()}`)
  }

  const { success, data: validatedParams } = ListScheduledBotsRequestQuerySchema.safeParse(params)

  if (!success) {
    return redirect("/scheduled-bots")
  }

  return (
    <section>
      <ScheduledBotsView params={validatedParams ?? null} />
    </section>
  )
}
