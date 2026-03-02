"use client"

import { Bell } from "lucide-react"
import { AlertHistoryTable } from "@/components/alerts/alert-history-table"
import { AlertActions } from "@/components/alerts/table-actions"
import { ItemHeading } from "@/components/layout/item-heading"
import { Badge } from "@/components/ui/badge"
import { GradientIcon } from "@/components/ui/gradient-icon"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { NameValuePair } from "@/components/ui/name-value-pair"
import { SecretField } from "@/components/ui/secret-field"
import {
  ALERT_TYPE_LABELS,
  type AlertHistoryEntry,
  type AlertRule,
  OPERATOR_LABELS
} from "@/lib/schemas/alerts"

interface AlertDetailViewProps {
  rule: AlertRule
  history: AlertHistoryEntry[]
  cursor: string | null
  prevCursor: string | null
}

export function AlertDetailView({ rule, history, cursor, prevCursor }: AlertDetailViewProps) {
  const channels = rule.deliveryChannels as {
    email?: { recipients: string[] }
    callback?: { url: string; secret?: string }
  } | null

  return (
    <>
      <div className="flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <ItemHeading
          title="Alert rule"
          name={rule.name}
          nameClassName="text-xl"
          containerClassName="md:flex-1"
          gradientIcon={
            <GradientIcon color="var(--color-rose-300)" size="xl">
              <Bell size={32} />
            </GradientIcon>
          }
        />
        <div className="flex w-full sm:w-auto gap-2 flex-row sm:items-center">
          <AlertActions rule={rule} buttonVariant="outline" />
        </div>
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
            <Badge variant="secondary">{ALERT_TYPE_LABELS[rule.alertType] || rule.alertType}</Badge>
          }
        />
        <NameValuePair
          title="Condition"
          value={`${OPERATOR_LABELS[rule.operator] || rule.operator} ${rule.value}`}
        />
        <NameValuePair title="Cooldown" value={`${rule.cooldownMinutes} minutes`} />
        <NameValuePair
          title="Email Recipients"
          value={
            channels?.email?.recipients && channels.email.recipients.length > 0 ? (
              <HoverCard openDelay={0}>
                <HoverCardTrigger asChild>
                  <Badge variant="secondary" className="cursor-default">
                    {channels.email.recipients.length}{" "}
                    {channels.email.recipients.length === 1 ? "recipient" : "recipients"}
                  </Badge>
                </HoverCardTrigger>
                <HoverCardContent className="w-64 p-1">
                  {channels.email.recipients.map((recipient) => (
                    <div
                      key={recipient}
                      className="text-xs text-foreground/80 bg-muted rounded-md p-2 my-1"
                    >
                      {recipient}
                    </div>
                  ))}
                </HoverCardContent>
              </HoverCard>
            ) : undefined
          }
        />
        <NameValuePair
          title="Callback URL"
          containerClassName="col-span-1 md:col-span-2"
          value={channels?.callback?.url}
          copyText={channels?.callback?.url}
        />
        <NameValuePair
          title="Callback Secret"
          value={
            channels?.callback?.secret ? (
              <SecretField
                value={channels.callback.secret}
                name="callback-secret"
                placeholder="Callback secret"
              />
            ) : undefined
          }
        />
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Alert History</h3>
        <AlertHistoryTable ruleUuid={rule.uuid} history={history} cursor={cursor} prevCursor={prevCursor} />
      </div>
    </>
  )
}
