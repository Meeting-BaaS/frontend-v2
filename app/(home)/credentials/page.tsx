import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { CredentialsView } from "@/components/credentials/view"
import { axiosGetInstance } from "@/lib/api-client"
import { GET_SESSION, LIST_ZOOM_CREDENTIALS } from "@/lib/api-routes"
import { createPageMetadata } from "@/lib/metadata"
import {
  type ZoomCredentialListResponse,
  zoomCredentialListResponseSchema
} from "@/lib/schemas/credentials"
import { type SessionResponse, sessionResponseSchema } from "@/lib/schemas/session"

export const metadata: Metadata = createPageMetadata({
  title: "Credentials",
  description: "Manage your Zoom credentials"
})

export default async function CredentialsPage({
  searchParams
}: {
  searchParams: Promise<{ new?: string | string[] | undefined }>
}) {
  const params = await searchParams
  const newParam = params.new
  const isNew = newParam === "true" || (Array.isArray(newParam) && newParam[0] === "true")
  // Redirect if user is not logged in
  const cookieStore = await cookies()
  const session = await axiosGetInstance<SessionResponse>(GET_SESSION, sessionResponseSchema, {
    headers: {
      Cookie: cookieStore.toString()
    }
  })
  const redirectSearchParams = new URLSearchParams()
  redirectSearchParams.set("redirectTo", "/credentials")
  if (!session) {
    return redirect(`/sign-in?${redirectSearchParams.toString()}`)
  }

  const credentials = await axiosGetInstance<ZoomCredentialListResponse>(
    LIST_ZOOM_CREDENTIALS,
    zoomCredentialListResponseSchema,
    {
      headers: {
        Cookie: cookieStore.toString()
      }
    }
  )

  return (
    <section>
      <CredentialsView credentials={credentials?.data ?? []} newCredential={isNew} />
    </section>
  )
}
