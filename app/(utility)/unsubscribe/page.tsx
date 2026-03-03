import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { UnsubscribeResult } from "@/components/utility/unsubscribe-result"
import { axiosPostInstance } from "@/lib/api-client"
import { GROWTH_UNSUBSCRIBE } from "@/lib/api-routes"
import { createPageMetadata } from "@/lib/metadata"
import {
  unsubscribeResponseSchema,
  unsubscribeSearchParamsSchema
} from "@/lib/schemas/growth"

export const metadata: Metadata = createPageMetadata({
  title: "Unsubscribe",
  description: "Manage your email preferences"
})

interface UnsubscribePageProps {
  searchParams: Promise<{ token?: string | string[]; type?: string | string[] }>
}

export default async function UnsubscribePage({ searchParams }: UnsubscribePageProps) {
  const params = await searchParams

  const { success, data: validatedParams } = unsubscribeSearchParamsSchema.safeParse(params)

  if (!success) {
    return redirect("/bots")
  }

  try {
    const response = await axiosPostInstance(
      GROWTH_UNSUBSCRIBE,
      { token: validatedParams.token },
      unsubscribeResponseSchema
    )

    return (
      <UnsubscribeResult
        success={response?.success ?? false}
        message={response?.message ?? "Unsubscribe request processed"}
      />
    )
  } catch (error) {
    return (
      <UnsubscribeResult
        success={false}
        message={error instanceof Error ? error.message : "An unexpected error occurred"}
      />
    )
  }
}
