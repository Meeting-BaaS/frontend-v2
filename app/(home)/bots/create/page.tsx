import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { CreateBotForm } from "@/components/bots/create/create-bot-form"
import { axiosGetInstance } from "@/lib/api-client"
import { GET_SESSION } from "@/lib/api-routes"
import { createPageMetadata } from "@/lib/metadata"
import { type SessionResponse, sessionResponseSchema } from "@/lib/schemas/session"

export const metadata: Metadata = createPageMetadata({
  title: "Create Bot",
  description: "Send a bot to join a meeting"
})

export default async function CreateBotPage() {
  const cookieStore = await cookies()
  const session = await axiosGetInstance<SessionResponse>(GET_SESSION, sessionResponseSchema, {
    headers: {
      Cookie: cookieStore.toString()
    }
  })

  const redirectSearchParams = new URLSearchParams()
  redirectSearchParams.set("redirectTo", "/bots/create")
  if (!session) {
    return redirect(`/sign-in?${redirectSearchParams.toString()}`)
  }

  return (
    <section>
      <CreateBotForm />
    </section>
  )
}
