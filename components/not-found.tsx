import * as motion from "motion/react-client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { spotlightVariant } from "@/lib/animations/background";

export default function SharedNotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <div className="z-10 w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <Image
            src="/not-found.svg"
            alt="Illustration showing a 404 - page not found"
            width={242}
            height={161}
            className="h-auto w-auto"
          />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Page not found</h1>
          <p className="text-sm text-muted-foreground">
            Looks like you found a page that doesn&apos;t yet exist. Let&apos;s
            get you back to something fishy!
          </p>
        </div>
        <Button variant="outline" asChild className="w-full">
          <Link href="/bots">Back to Home</Link>
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
