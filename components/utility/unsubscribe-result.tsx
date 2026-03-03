"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GradientIcon } from "@/components/ui/gradient-icon"

interface UnsubscribeResultProps {
  success: boolean
  message: string // Not used at the moment but can be in the future if needed
}

export function UnsubscribeResult({ success }: UnsubscribeResultProps) {
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
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">
            {success ? "You've been unsubscribed" : "Something went wrong"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {success
              ? "You will no longer receive product tips and guides from Meeting BaaS. You can re-subscribe anytime from your account settings."
              : "We couldn't process your unsubscribe request. The link may be invalid or expired."}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button variant="primary" asChild className="w-full">
            <Link href="/account">Manage Email Preferences</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/bots">Go to Home</Link>
          </Button>
        </div>
      </div>{" "}
    </div>
  )
}
