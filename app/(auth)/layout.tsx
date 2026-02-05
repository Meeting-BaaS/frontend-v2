import * as motion from "motion/react-client"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { ReactNode } from "react"
import { AnimationWrapper } from "@/components/auth/animation-wrapper"
import { GotoV1Button } from "@/components/header/goto-v1-button"
import HeroSection from "@/components/hero"
import { ConfigurationProvider } from "@/contexts/configuration-context"
import { opacityVariant } from "@/lib/animations/opacity"
import { axiosGetInstance } from "@/lib/api-client"
import { GET_SESSION } from "@/lib/api-routes"
import { getConfiguration } from "@/lib/get-configuration"
import { type SessionResponse, sessionResponseSchema } from "@/lib/schemas/session"

export default async function AuthLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  // Redirect if user is already logged in
  const cookieStore = await cookies()
  const session = await axiosGetInstance<SessionResponse>(GET_SESSION, sessionResponseSchema, {
    headers: {
      Cookie: cookieStore.toString()
    }
  })
  if (session) {
    return redirect("/bots")
  }

  const configuration = await getConfiguration()

  return (
    <>
      <div className="container relative mx-auto grid h-dvh grid-cols-1 flex-col items-center justify-center lg:max-w-none lg:grid-cols-5 lg:px-0">
        <ConfigurationProvider configuration={configuration?.data ?? null}>
          <AnimationWrapper>{children}</AnimationWrapper>
        </ConfigurationProvider>
        <HeroSection />
      </div>
      <motion.div {...opacityVariant(1)} className="absolute top-0 left-0 m-4">
        <GotoV1Button />
      </motion.div>
    </>
  )
}
