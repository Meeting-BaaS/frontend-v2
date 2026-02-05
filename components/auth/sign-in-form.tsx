"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, LogIn } from "lucide-react"
import { motion } from "motion/react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { CallbackError } from "@/components/auth/callback-error"
import { FormFields } from "@/components/auth/form-fields"
import type { ProviderName } from "@/components/auth/providers"
import { getProvidersForConfig } from "@/components/auth/providers"
import { SocialButton } from "@/components/auth/social-button"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { env } from "@/env"
import { useConfiguration } from "@/hooks/use-configuration"
import { itemVariant } from "@/lib/animations/auth-forms"
import { authClient } from "@/lib/auth-client"
import { type errorDescription, genericError } from "@/lib/errors"
import { type SignInFormData, SignInSchema } from "@/lib/validators"

export default function SignInForm({
  redirectTo,
  error
}: {
  redirectTo: string | undefined
  error: string | undefined
}) {
  const form = useForm<SignInFormData>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })
  const [socialLoading, setSocialLoading] = useState<string | undefined>(undefined)
  const [callbackError, setCallbackError] = useState(error)
  const [isSignInLoading, setIsSignInLoading] = useState(false)
  const { configuration } = useConfiguration()
  const showEmailPassword = configuration?.features?.email ?? true
  const providers = getProvidersForConfig(configuration)
  const hasSignInMethods = showEmailPassword || providers.length > 0

  useEffect(() => setCallbackError(error), [error])
  const loading = Boolean(socialLoading) || isSignInLoading
  const callbackURL = redirectTo || "/bots"

  const onProviderSignIn = async (provider: ProviderName) => {
    if (socialLoading) return
    try {
      await authClient.signIn.social(
        {
          provider,
          callbackURL: `${env.NEXT_PUBLIC_FRONTEND_BASEURL}${callbackURL}`,
          errorCallbackURL: `${env.NEXT_PUBLIC_FRONTEND_BASEURL}/sign-in`
        },
        {
          onRequest: (_ctx) => {
            setSocialLoading(provider)
            setCallbackError(undefined)
          },
          onResponse: (_ctx) => {
            setSocialLoading(undefined)
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || genericError)
          }
        }
      )
    } catch (error) {
      console.error("Error signing in with provider", error, provider)
      setSocialLoading(undefined)
      toast.error(genericError)
    }
  }

  const onSubmit = async (data: SignInFormData) => {
    setIsSignInLoading(true)
    try {
      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
          callbackURL: `${env.NEXT_PUBLIC_FRONTEND_BASEURL}${callbackURL}`
        },
        {
          onRequest: () => {
            setCallbackError(undefined)
          },
          onResponse: () => {
            setIsSignInLoading(false)
          },
          onError: (ctx) => {
            if (ctx.error.code === "EMAIL_NOT_VERIFIED") {
              toast.error("Email not verified. Please check your email for a verification link.")
            } else if (
              ctx.error.code === "NOT_INVITED" ||
              ctx.error.message?.includes("NOT_INVITED")
            ) {
              setCallbackError("NOT_INVITED")
            } else {
              toast.error(ctx.error.message || genericError)
            }
          }
        }
      )
    } catch (error) {
      console.error("Error signing in", error)
      toast.error(genericError)
      setIsSignInLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 pt-6">
        <FormFields loading={loading} formType="sign-in" showEmailPassword={showEmailPassword} />
        <CallbackError error={callbackError as keyof typeof errorDescription} />
        {!hasSignInMethods ? (
          <p className="text-sm text-muted-foreground">
            No sign-in methods configured. Contact your administrator.
          </p>
        ) : (
          <motion.div
            className="flex flex-col gap-3"
            variants={itemVariant}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {showEmailPassword && (
              <Button
                type="submit"
                size="sm"
                disabled={loading}
                aria-label={loading ? "Signing in..." : "Sign in"}
                aria-busy={isSignInLoading}
                aria-disabled={isSignInLoading}
              >
                {isSignInLoading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <LogIn />
                  </>
                )}
              </Button>
            )}
            {showEmailPassword && providers.length > 0 && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
            )}
            {providers.length > 0 && (
              <div className="flex gap-2">
                {providers.map((provider) => (
                  <SocialButton
                    key={provider.name}
                    {...provider}
                    loading={loading}
                    socialLoading={socialLoading}
                    type="button"
                    onClick={() => onProviderSignIn(provider.name)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </form>
    </Form>
  )
}
