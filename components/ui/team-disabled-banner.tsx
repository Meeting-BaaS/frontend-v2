"use client"

import { ShieldOff } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useUser } from "@/hooks/use-user"

/**
 * Full-width, impossible-to-miss warning shown on every dashboard page when the
 * active team has been disabled by a Meeting BaaS administrator. While disabled,
 * every API request returns 403 and scheduled bots are frozen.
 */
export function TeamDisabledBanner() {
  const { activeTeam } = useUser()

  if (!activeTeam.disabled) {
    return null
  }

  return (
    <Alert
      variant="destructive"
      className="-mx-4 md:-mx-10 lg:-mx-20 -mt-8 mb-8 rounded-none border-t-0 border-x-0 border-b-2 w-8xl bg-destructive/15 border-destructive"
    >
      <ShieldOff />
      <AlertTitle className="text-base font-bold uppercase tracking-wide">
        ⛔ This team has been disabled by a Meeting BaaS administrator
      </AlertTitle>
      <AlertDescription>
        <div className="space-y-1">
          <p>
            All API access is blocked and scheduled bots are frozen — every API request will
            return <span className="font-mono font-semibold">403 TEAM_DISABLED</span> until this
            is resolved.
          </p>
          {activeTeam.disabledReason && (
            <p>
              <span className="font-semibold">Reason:</span> {activeTeam.disabledReason}
            </p>
          )}
          <p>
            Contact{" "}
            <a href="mailto:support@meetingbaas.com" className="underline font-medium">
              support@meetingbaas.com
            </a>{" "}
            to resolve.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  )
}
