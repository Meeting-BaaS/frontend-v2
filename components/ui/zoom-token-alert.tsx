import { AlertCircleIcon } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ZOOM_OBF_TOKEN_BLOG_URL } from "@/lib/external-urls"

export function ZoomTokenAlert() {
  return (
    <Alert
      variant="destructive"
      className="-mx-4 md:-mx-10 lg:-mx-20 -mt-8 mb-8 rounded-none border-t-0 border-x-0 border-b-[0.5px] w-8xl bg-destructive/5 border-destructive/25"
    >
      <AlertCircleIcon />
      <AlertTitle>Zoom bots must be authorized</AlertTitle>
      <AlertDescription>
        <div>
          <span className="font-bold">Beginning March 2 2026</span>, Zoom bots must be authorized.
          Authorize your bots by creating a Zoom marketplace application and using OBF or ZAK
          tokens.{" "}
          <Link
            href={ZOOM_OBF_TOKEN_BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium hover:text-destructive text-foreground"
          >
            Learn more
          </Link>
        </div>
      </AlertDescription>
    </Alert>
  )
}
