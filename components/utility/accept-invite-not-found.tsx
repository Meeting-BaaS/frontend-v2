"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { env } from "@/env";

export function AcceptInviteNotFound() {
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
            We couldn't find your invite
          </h1>
          <p className="text-sm text-muted-foreground">
            The invite link is not valid. It may have been revoked, already
            accepted, or the invite has expired.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Please contact the admin to receive a new invite, or if you need
          assistance, send a message to{" "}
          <Button variant="link" asChild className="h-auto p-0">
            <a href={`mailto:${env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>
              {env.NEXT_PUBLIC_SUPPORT_EMAIL}
            </a>
          </Button>
          .
        </p>
        <Button variant="outline" asChild className="w-full">
          <Link href="/bots">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
