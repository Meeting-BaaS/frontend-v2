import type { Metadata } from "next"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { Suspense } from "react"
import { BillingTab } from "@/components/settings/billing/tab-server"
import { IntegrationsTab } from "@/components/settings/integrations/tab-server"
import { TeamTab } from "@/components/settings/team/tab-server"
import { UsageTab } from "@/components/settings/usage/tab-server"
import { Spinner } from "@/components/ui/spinner"
import { axiosGetInstance } from "@/lib/api-client"
import { GET_SESSION } from "@/lib/api-routes"
import { getConfiguration } from "@/lib/get-configuration"
import { createPageMetadata } from "@/lib/metadata"
import { type SessionResponse, sessionResponseSchema } from "@/lib/schemas/session"
import { settingsPageTabsSchema } from "@/lib/schemas/settings"

export const metadata: Metadata = createPageMetadata({
  title: "Settings",
  description: "Manage your account and team settings"
})

interface SettingsTabPageProps {
  params: Promise<{ tab: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SettingsTabPage({ params, searchParams }: SettingsTabPageProps) {
  const { tab } = await params
  const searchParamsObj = await searchParams

  // Validate tab using Zod
  const validation = settingsPageTabsSchema.safeParse(tab)
  if (!validation.success) {
    return notFound()
  }

  // Redirect if user is not logged in
  const cookieStore = await cookies()
  const session = await axiosGetInstance<SessionResponse>(GET_SESSION, sessionResponseSchema, {
    headers: {
      Cookie: cookieStore.toString()
    }
  })
  const redirectSearchParams = new URLSearchParams()
  redirectSearchParams.set("redirectTo", `/settings/${tab}`)
  if (!session) {
    return redirect(`/sign-in?${redirectSearchParams.toString()}`)
  }

  // Redirect billing tab to usage when Stripe is disabled
  if (tab === "billing") {
    const configuration = await getConfiguration()
    if (!configuration?.data?.features?.stripe) {
      return redirect("/settings/usage")
    }
  }

  let TabContent: React.ReactNode

  switch (tab) {
    case "usage":
      TabContent = <UsageTab searchParams={searchParamsObj} />
      break
    case "billing":
      TabContent = <BillingTab searchParams={searchParamsObj} />
      break
    case "team":
      TabContent = <TeamTab />
      break
    case "integrations":
      TabContent = <IntegrationsTab />
      break
    default:
      return notFound()
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-10">
          <Spinner className="size-6" />
        </div>
      }
    >
      {TabContent}
    </Suspense>
  )
}
