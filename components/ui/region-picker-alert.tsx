import { Globe } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

/**
 * Announcement banner for the new bot exit-country (region) picker. Green /
 * informational, full-width like the other dashboard banners.
 */
export function RegionPickerAlert() {
  return (
    <Alert className="-mx-4 md:-mx-10 lg:-mx-20 -mt-8 mb-8 rounded-none border-t-0 border-x-0 border-b-[0.5px] w-8xl bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-100 [&>svg]:text-emerald-600">
      <Globe />
      <AlertTitle>New: pick a region for your bots</AlertTitle>
      <AlertDescription>
        <div>
          <span className="font-bold">Choose which countries your bots join from.</span> Pin your
          bots' network exit to one or more regions — pick several and they'll fall through to a
          working one during a provider outage.{" "}
          <Link
            href="/settings/team"
            className="underline font-medium text-emerald-700 dark:text-emerald-300"
          >
            Set it in Team Settings
          </Link>
        </div>
      </AlertDescription>
    </Alert>
  )
}
