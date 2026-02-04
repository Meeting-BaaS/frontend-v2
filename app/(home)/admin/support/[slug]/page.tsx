import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { AdminTicketDetailsServer } from "@/components/admin/support/details-server"
import { Spinner } from "@/components/ui/spinner"
import { createPageMetadata } from "@/lib/metadata"
import { ticketSlugRequestParamsSchema } from "@/lib/schemas/support"

export const metadata: Metadata = createPageMetadata({
  title: "Admin Ticket Details",
  description: "View support ticket details"
})

interface AdminTicketDetailsPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function AdminTicketDetailsPage({ params }: AdminTicketDetailsPageProps) {
  const requestParams = await params

  // Parse and validate the request params
  const { success, data: validatedParams } = ticketSlugRequestParamsSchema.safeParse(requestParams)
  if (!success) {
    return notFound()
  }

  return (
    <section>
      <Suspense fallback={<Spinner />}>
        <AdminTicketDetailsServer ticketId={validatedParams.slug} />
      </Suspense>
    </section>
  )
}
