import { NameValuePair } from "@/components/ui/name-value-pair"
import type { TeamsLoginUtilizationResponse } from "@/lib/schemas/teams-logins"

interface UtilizationStripProps {
  utilization: TeamsLoginUtilizationResponse["data"]
}

export function UtilizationStrip({ utilization }: UtilizationStripProps) {
  return (
    <div className="grid mt-8 grid-cols-2 md:grid-cols-4 gap-4">
      <NameValuePair
        title="Active Accounts"
        value={`${utilization.logins_active} / ${utilization.logins_total}`}
      />
      <NameValuePair
        title="Concurrent Sessions"
        value={`${utilization.concurrent_sessions} / ${utilization.concurrent_capacity}`}
      />
      <NameValuePair title="Utilization" value={`${utilization.utilization_pct}%`} />
      <NameValuePair
        title="Invalid Accounts"
        value={utilization.logins_invalid > 0 ? String(utilization.logins_invalid) : "0"}
      />
    </div>
  )
}
