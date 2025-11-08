"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { env } from "@/env";
import { spotlightVariant } from "@/lib/animations/background";
import type { APIError } from "@/lib/api-client";

interface ErrorProps {
  error: APIError & { digest?: string };
  reset: () => void;
}

// This is a generic error message that is shown when the error is not known or has a digest string.
// Most likely, this error occurred due to cookie mismatch or internal server errors.
const genericErrorMessage =
  "There was an unknown error. Please clear the cookies and try again.";

export default function SharedErrorBoundary({ error }: ErrorProps) {
  useEffect(() => {
    console.error("Something went wrong", error);
  }, [error]);

  const errorMessage = useMemo(() => {
    if (error.errorResponse?.code?.startsWith("FST_ERR")) {
      return error.errorResponse.error || genericErrorMessage;
    }
    return genericErrorMessage;
  }, [error.errorResponse]);

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <div className="z-10 w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <Image
            src="/error.svg"
            alt="Illustration showing an application error state"
            width={323}
            height={85}
            className="h-auto w-auto"
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Oops...something went wrong</h3>
          <p className="text-sm text-muted-foreground">{errorMessage}</p>
        </div>
        <p className="text-sm text-muted-foreground">
          If the error persists, please contact us on{" "}
          <Button variant="link" asChild className="h-auto p-0">
            <a href={`mailto:${env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>
              {env.NEXT_PUBLIC_SUPPORT_EMAIL}
            </a>
          </Button>
          .
        </p>
        <Button variant="outline" asChild className="w-full">
          <a href="/bots">Back to Home</a>
        </Button>
      </div>
      <motion.div
        className="-translate-1/2 absolute top-1/2 left-1/2 h-48 w-48 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(0, 219, 205, 0.3) 10%, rgba(0, 219, 205, 0.2) 80%, transparent 100%)",
        }}
        initial={{ opacity: 0 }}
        animate={spotlightVariant}
        aria-hidden="true"
      />
    </div>
  );
}
