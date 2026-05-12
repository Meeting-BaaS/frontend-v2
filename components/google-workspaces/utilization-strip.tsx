import { NameValuePair } from "@/components/ui/name-value-pair"
import type { MeetLoginUtilizationResponse } from "@/lib/schemas/meet-logins"

interface UtilizationStripProps {
  utilization: MeetLoginUtilizationResponse["data"]
}

export function UtilizationStrip({ utilization }: UtilizationStripProps) {
  return (
    <div className="grid mt-8 grid-cols-2 md:grid-cols-4 gap-4">
      <NameValuePair
        title="Active Logins"
        value={`${utilization.logins_active} / ${utilization.logins_total}`}
      />
      <NameValuePair
        title="Concurrent Sessions"
        value={`${utilization.concurrent_sessions} / ${utilization.concurrent_capacity}`}
      />
      <NameValuePair title="Utilization" value={`${utilization.utilization_pct}%`} />
      <NameValuePair
        title="Invalid Logins"
        value={utilization.logins_invalid > 0 ? String(utilization.logins_invalid) : "0"}
      />
    </div>
  )
}
