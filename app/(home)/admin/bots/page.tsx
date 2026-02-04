import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { Spinner } from "@/components/ui/spinner"
import { createPageMetadata } from "@/lib/metadata"
import { listAllBotsRequestQuerySchema } from "@/lib/schemas/admin"

export const metadata: Metadata = createPageMetadata({
  title: "Admin Bots",
  description: "Manage all bots"
})

const AdminBotsView = dynamic(
  () =>
    import("@/components/admin/bots/view").then((mod) => ({
      default: mod.AdminBotsView
    })),
  {
    loading: () => <Spinner />
  }
)

interface AdminBotsPageProps {
  searchParams: Promise<{
    cursor?: string | string[] | undefined
    botName?: string | string[] | undefined
    botId?: string | string[] | undefined
    createdBefore?: string | string[] | undefined
    createdAfter?: string | string[] | undefined
    endedAfter?: string | string[] | undefined
    meetingUrl?: string | string[] | undefined
    meetingPlatform?: string | string[] | undefined
    status?: string | string[] | undefined
    limit?: string | string[] | undefined
    teamName?: string | string[] | undefined
    teamId?: string | string[] | undefined
  }>
}

export default async function AdminBotsPage({ searchParams }: AdminBotsPageProps) {
  const params = await searchParams

  const { success, data: validatedParams } = listAllBotsRequestQuerySchema.safeParse(params)

  if (!success) {
    // If params aren't valid, return bots without any filtering/pagination
    return redirect("/admin/bots")
  }

  return (
    <section>
      <Suspense fallback={<Spinner />}>
        <AdminBotsView params={validatedParams ?? null} />
      </Suspense>
    </section>
  )
}
