import type { Metadata } from "next"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { Suspense } from "react"
import { CalendarViewServer } from "@/components/calendars/calendar-view-server"
import { CalendarViewSkeleton } from "@/components/calendars/calendar-view-skeleton"
import { GoogleLogo } from "@/components/icons/google"
import { MicrosoftLogo } from "@/components/icons/microsoft"
import { DocsButton } from "@/components/layout/docs-button"
import { ItemHeading } from "@/components/layout/item-heading"
import { GradientIcon } from "@/components/ui/gradient-icon"
import { axiosGetInstance } from "@/lib/api-client"
import { GET_CALENDAR_DETAILS, GET_SESSION } from "@/lib/api-routes"
import { createPageMetadata } from "@/lib/metadata"
import {
  type CalendarDetailsResponse,
  calendarDetailsResponseSchema
} from "@/lib/schemas/calendars"
import { slugRequestParamsSchema } from "@/lib/schemas/common"
import { type SessionResponse, sessionResponseSchema } from "@/lib/schemas/session"

export const metadata: Metadata = createPageMetadata({
  title: "Calendar Details",
  description: "View and manage your calendar"
})

interface CalendarDetailsPageProps {
  params: Promise<{ slug: string }>
}

// We'll need to fetch calendar details to show the header
// For now, let's create a simple version that just shows the calendar
export default async function CalendarDetailsPage({ params }: CalendarDetailsPageProps) {
  const requestParams = await params

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

  const { success, data: validatedParams } = slugRequestParamsSchema.safeParse(requestParams)
  if (!success) {
    return notFound()
  }

  // Fetch calendar details for the header
  const calendarDetailsResponse = await axiosGetInstance<CalendarDetailsResponse>(
    GET_CALENDAR_DETAILS(validatedParams.slug),
    calendarDetailsResponseSchema,
    {
      headers: { Cookie: cookieStore.toString() }
    }
  ).catch(() => {
    // If calendar not found, return 404
    return null
  })

  if (!calendarDetailsResponse) {
    return notFound()
  }

  const calendarDetails = calendarDetailsResponse.data

  return (
    <section>
      <div className="flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <ItemHeading
          title={calendarDetails.account_email}
          name={validatedParams.slug}
          nameClassName="text-xl"
          containerClassName="md:flex-1"
          gradientIcon={
            <GradientIcon color="var(--color-background)" size="xl">
              {calendarDetails.calendar_platform === "google" ? (
                <GoogleLogo className="size-8 fill-google-blue" />
              ) : (
                <MicrosoftLogo className="size-8" />
              )}
            </GradientIcon>
          }
        />
        <div className="flex w-full sm:w-auto gap-2 flex-row sm:items-center">
          <DocsButton uriSuffix="api-v2/reference/calendars/list-events" />
        </div>
      </div>

      <Suspense fallback={<CalendarViewSkeleton />}>
        <CalendarViewServer calendarId={validatedParams.slug} />
      </Suspense>
    </section>
  )
}
