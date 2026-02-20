"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { GradientIcon } from "@/components/ui/gradient-icon"
import { Spinner } from "@/components/ui/spinner"
import { env } from "@/env"

type UnsubscribeState = "loading" | "success" | "already_unsubscribed" | "invalid" | "error" | "missing_token"

interface UnsubscribeContentProps {
  token: string | undefined
}

export function UnsubscribeContent({ token }: UnsubscribeContentProps) {
  const [state, setState] = useState<UnsubscribeState>(token ? "loading" : "missing_token")

  useEffect(() => {
    if (!token) return

    const processUnsubscribe = async () => {
      try {
        const response = await fetch(
          `${env.NEXT_PUBLIC_API_SERVER_BASEURL}/growth/unsubscribe`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token })
          }
        )

        const data = await response.json()

        if (response.ok && data.success) {
          if (data.message?.includes("already")) {
            setState("already_unsubscribed")
          } else {
            setState("success")
          }
        } else if (response.status === 404) {
          setState("invalid")
        } else {
          setState("error")
        }
      } catch {
        setState("error")
      }
    }

    processUnsubscribe()
  }, [token])

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <GradientIcon color="var(--color-background)" size="xl">
            <div className="relative flex size-10 items-center justify-center overflow-hidden rounded-lg">
              <Image
                src="/logo-2.svg"
                alt="Meeting BaaS logo"
                fill
                sizes="40px"
                className="object-contain"
              />
            </div>
          </GradientIcon>
        </div>

        {state === "loading" && (
          <div className="space-y-4">
            <Spinner />
            <p className="text-sm text-muted-foreground">Processing your request...</p>
          </div>
        )}

        {(state === "success" || state === "already_unsubscribed") && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">
                {state === "already_unsubscribed"
                  ? "You're already unsubscribed"
                  : "You've been unsubscribed"}
              </h1>
              <p className="text-sm text-muted-foreground">
                You will no longer receive marketing and product growth emails
                from Meeting BaaS, including onboarding tips, feature suggestions,
                and win-back messages.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-muted/50 p-4 text-left">
              <p className="text-sm font-medium text-foreground">
                You will still receive essential emails:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>Payment receipts and billing notifications</li>
                <li>Security alerts and password resets</li>
                <li>Account verification and team invitations</li>
                <li>Critical service notifications (outages, token limits)</li>
              </ul>
            </div>

            <p className="text-xs text-muted-foreground">
              Changed your mind? You can re-subscribe anytime from your{" "}
              <Link href="/account" className="text-primary underline underline-offset-2">
                account settings
              </Link>
              .
            </p>
          </div>
        )}

        {state === "invalid" && (
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Invalid unsubscribe link</h1>
            <p className="text-sm text-muted-foreground">
              This unsubscribe link is not valid or has expired. If you want to manage
              your email preferences, please sign in to your account.
            </p>
          </div>
        )}

        {state === "error" && (
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Something went wrong</h1>
            <p className="text-sm text-muted-foreground">
              We couldn't process your unsubscribe request. Please try again
              later or contact us at{" "}
              <Button variant="link" asChild className="h-auto p-0">
                <a href={`mailto:${env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>
                  {env.NEXT_PUBLIC_SUPPORT_EMAIL}
                </a>
              </Button>
              .
            </p>
          </div>
        )}

        {state === "missing_token" && (
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Missing unsubscribe token</h1>
            <p className="text-sm text-muted-foreground">
              This link appears to be incomplete. Please use the unsubscribe link
              from your email, or manage your preferences from your account settings.
            </p>
          </div>
        )}

        <Button variant="outline" asChild className="w-full">
          <Link href="/bots">Back to Home</Link>
        </Button>
      </div>
    </div>
  )
}
