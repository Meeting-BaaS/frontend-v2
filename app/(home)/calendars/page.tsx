import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { CalendarsView } from "@/components/calendars/view"
import { axiosGetInstance } from "@/lib/api-client"
import { GET_SESSION } from "@/lib/api-routes"
import { createPageMetadata } from "@/lib/metadata"
import { ListCalendarsRequestQuerySchema } from "@/lib/schemas/calendars"
import { type SessionResponse, sessionResponseSchema } from "@/lib/schemas/session"

export const metadata: Metadata = createPageMetadata({
  title: "Calendars",
  description: "Manage your connected calendars"
})

interface CalendarsPageProps {
  searchParams: Promise<{
    cursor?: string | string[] | undefined
    email?: string | string[] | undefined
    calendarPlatform?: string | string[] | undefined
    status?: string | string[] | undefined
  }>
}

export default async function CalendarsPage({ searchParams }: CalendarsPageProps) {
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
  redirectSearchParams.set("redirectTo", "/calendars")
  if (!session) {
    return redirect(`/sign-in?${redirectSearchParams.toString()}`)
  }

  const { success, data: validatedParams } = ListCalendarsRequestQuerySchema.safeParse(params)

  if (!success) {
    // If params aren't valid, return calendars without any filtering/pagination
    return redirect("/calendars")
  }

  return (
    <section>
      <CalendarsView params={validatedParams ?? null} />
    </section>
  )
}
