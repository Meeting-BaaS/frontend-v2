import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ExploreMore } from "@/components/onboarding/explore-more"
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard"
import { axiosGetInstance } from "@/lib/api-client"
import { GET_SESSION } from "@/lib/api-routes"
import { createPageMetadata } from "@/lib/metadata"
import { type SessionResponse, sessionResponseSchema } from "@/lib/schemas/session"

export const metadata: Metadata = createPageMetadata({
  title: "Onboarding",
  description: "Get started with Meeting BaaS"
})

export default async function OnboardingPage() {
  // Redirect if user is not logged in
  // It is recommended to verify session on each page
  const cookieStore = await cookies()
  const session = await axiosGetInstance<SessionResponse>(GET_SESSION, sessionResponseSchema, {
    headers: {
      Cookie: cookieStore.toString()
    }
  })
  const redirectSearchParams = new URLSearchParams()
  redirectSearchParams.set("redirectTo", "/onboarding")
  if (!session) {
    return redirect(`/sign-in?${redirectSearchParams.toString()}`)
  }

  return (
    <section>
      <OnboardingWizard />
      <div className="mt-12">
        <ExploreMore />
      </div>
    </section>
  )
}
