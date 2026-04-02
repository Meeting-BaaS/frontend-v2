import { Lock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function RestrictedViewer() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-blue-500/10">
            <Lock className="size-8 text-blue-500" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">API-only access enabled</h3>
          <p className="text-sm text-muted-foreground">
            Artifact access is restricted to API only for this account.
            Recordings cannot be viewed from the dashboard.
          </p>
        </div>
        <Button variant="outline" asChild className="w-full">
          <Link href="/bots">Back to Home</Link>
        </Button>
      </div>
    </div>
  )
}
