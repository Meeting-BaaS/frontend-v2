import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { Spinner } from "@/components/ui/spinner"
import { createPageMetadata } from "@/lib/metadata"
import { listAllSupportTicketsRequestQuerySchema } from "@/lib/schemas/admin"

export const metadata: Metadata = createPageMetadata({
  title: "Admin Support",
  description: "Manage all support tickets"
})

const AdminSupportView = dynamic(
  () =>
    import("@/components/admin/support/view").then((mod) => ({
      default: mod.AdminSupportView
    })),
  {
    loading: () => <Spinner />
  }
)

interface AdminSupportPageProps {
  searchParams: Promise<{
    cursor?: string | string[] | undefined
    status?: string | string[] | undefined
    module?: string | string[] | undefined
    type?: string | string[] | undefined
    teamName?: string | string[] | undefined
    teamId?: string | string[] | undefined
    botUuid?: string | string[] | undefined
    limit?: string | string[] | undefined
  }>
}

export default async function AdminSupportPage({ searchParams }: AdminSupportPageProps) {
  const params = await searchParams

  const { success, data: validatedParams } =
    listAllSupportTicketsRequestQuerySchema.safeParse(params)

  if (!success) {
    // If params aren't valid, return tickets without any filtering/pagination
    return redirect("/admin/support")
  }

  return (
    <section>
      <Suspense fallback={<Spinner />}>
        <AdminSupportView params={validatedParams ?? null} />
      </Suspense>
    </section>
  )
}
