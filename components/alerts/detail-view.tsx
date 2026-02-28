"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { AlertHistoryTable } from "@/components/alerts/alert-history-table"
import { AlertActions } from "@/components/alerts/table-actions"
import { PageHeading } from "@/components/layout/page-heading"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { NameValuePair } from "@/components/ui/name-value-pair"
import {
  ALERT_TYPE_LABELS,
  type AlertHistoryEntry,
  type AlertRule,
  OPERATOR_LABELS
} from "@/lib/schemas/alerts"

interface AlertDetailViewProps {
  rule: AlertRule
  history: AlertHistoryEntry[]
  nextCursor: string | null
}

export function AlertDetailView({ rule, history, nextCursor }: AlertDetailViewProps) {
  const channels = rule.deliveryChannels as {
    email?: { recipients: string[] }
    callback?: { url: string; secret?: string }
  } | null

  return (
    <>
      <div className="flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/alerts">
              <ArrowLeft />
            </Link>
          </Button>
          <PageHeading title={rule.name} containerClassName="md:flex-1" />
        </div>
        <AlertActions rule={rule} buttonVariant="outline" />
      </div>

      <div className="grid mt-10 md:mt-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <NameValuePair
          title="Status"
          value={
            rule.enabled ? (
              <Badge variant="success">Enabled</Badge>
            ) : (
              <Badge variant="disabled">Disabled</Badge>
            )
          }
        />
        <NameValuePair
          title="Metric"
          value={
            <Badge variant="secondary">
              {ALERT_TYPE_LABELS[rule.alertType] || rule.alertType}
            </Badge>
          }
        />
        <NameValuePair
          title="Condition"
          value={`${OPERATOR_LABELS[rule.operator] || rule.operator} ${rule.value}`}
        />
        <NameValuePair
          title="Cooldown"
          value={`${rule.cooldownMinutes} minutes`}
        />
      </div>

      <div className="grid mt-6 grid-cols-1 md:grid-cols-2 gap-4">
        <NameValuePair
          title="Email Recipients"
          value={
            channels?.email?.recipients && channels.email.recipients.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {channels.email.recipients.map((email) => (
                  <Badge key={email} variant="secondary" className="text-xs">
                    {email}
                  </Badge>
                ))}
              </div>
            ) : undefined
          }
        />
        <NameValuePair
          title="Callback URL"
          value={channels?.callback?.url}
          copyText={channels?.callback?.url}
        />
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Alert History</h3>
        <AlertHistoryTable ruleUuid={rule.uuid} history={history} nextCursor={nextCursor} />
      </div>
    </>
  )
}
