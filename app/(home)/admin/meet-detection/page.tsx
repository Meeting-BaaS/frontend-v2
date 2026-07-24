import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import { Spinner } from "@/components/ui/spinner"
import { createPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createPageMetadata({
  title: "Meet Detection",
  description: "Google Meet bot-detection telemetry"
})

const AdminMeetDetectionView = dynamic(
  () =>
    import("@/components/admin/meet-detection/view").then((mod) => ({
      default: mod.AdminMeetDetectionView
    })),
  {
    loading: () => <Spinner />
  }
)

export default function AdminMeetDetectionPage() {
  return (
    <section>
      <Suspense fallback={<Spinner />}>
        <AdminMeetDetectionView />
      </Suspense>
    </section>
  )
}
