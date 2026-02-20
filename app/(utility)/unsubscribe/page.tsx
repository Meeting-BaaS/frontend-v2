import type { Metadata } from "next"
import { UnsubscribeContent } from "@/components/utility/unsubscribe-content"
import { createPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createPageMetadata({
  title: "Unsubscribe",
  description: "Manage your email preferences"
})

interface UnsubscribePageProps {
  searchParams: Promise<{ token?: string | string[] | undefined }>
}

export default async function UnsubscribePage({ searchParams }: UnsubscribePageProps) {
  const params = await searchParams
  const token = typeof params.token === "string" ? params.token : undefined

  return <UnsubscribeContent token={token} />
}
