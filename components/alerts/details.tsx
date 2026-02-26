"use client";

import { ArrowLeft, Bell } from "lucide-react";
import Link from "next/link";
import { ItemHeading } from "@/components/layout/item-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { NameValuePair } from "@/components/ui/name-value-pair";
import { AlertActions } from "@/components/alerts/alert-actions";
import { AlertHistoryTable } from "@/components/alerts/history/table";
import { formatRelativeDate } from "@/lib/date-helpers";
import type { AlertHistoryRecord, AlertRule } from "@/lib/schemas/alerts";
import {
  THRESHOLD_RESOURCE_LABELS,
  THRESHOLD_OPERATOR_LABELS,
  ALERT_EVENT_TYPE_LABELS,
} from "@/lib/schemas/alerts";

interface ViewAlertRuleDetailsProps {
  alertRule: AlertRule;
  alertHistory: AlertHistoryRecord[];
}

function getConditionDescription(rule: AlertRule): string {
  if (rule.type === "threshold") {
    const resource =
      THRESHOLD_RESOURCE_LABELS[rule.resource ?? ""] ?? rule.resource;
    const operator =
      THRESHOLD_OPERATOR_LABELS[rule.operator ?? ""] ?? rule.operator;
    return `${resource} ${operator} ${rule.threshold}`;
  }
  return ALERT_EVENT_TYPE_LABELS[rule.eventType ?? ""] ?? rule.eventType ?? "";
}

function getChannelsSummary(rule: AlertRule): string {
  const parts: string[] = [];
  if (rule.channels.email && rule.channels.email.length > 0) {
    parts.push(
      `Email (${rule.channels.email.length} ${rule.channels.email.length === 1 ? "address" : "addresses"})`,
    );
  }
  if (rule.channels.webhook) {
    parts.push("Webhook");
  }
  return parts.join(", ") || "None";
}

function formatCooldown(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function ViewAlertRuleDetails({
  alertRule,
  alertHistory,
}: ViewAlertRuleDetailsProps) {
  return (
    <section>
      <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2 text-muted-foreground">
        <Link href="/alerts">
          <ArrowLeft className="size-4 mr-1" />
          Back to alerts
        </Link>
      </Button>
      <div className="flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <ItemHeading
          title={alertRule.name}
          name={getConditionDescription(alertRule)}
          nameClassName="text-xl"
          containerClassName="md:flex-1"
          gradientIcon={
            <GradientIcon
              color={
                alertRule.enabled
                  ? "var(--color-green-300)"
                  : "var(--color-gray-300)"
              }
              size="xl"
            >
              <Bell size={32} />
            </GradientIcon>
          }
        />
        <div className="flex w-full sm:w-auto gap-2 flex-row sm:items-center">
          <AlertActions alertRule={alertRule} buttonVariant="outline" />
        </div>
      </div>

      <div className="grid mt-10 md:mt-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <NameValuePair
          title="Type"
          value={
            <Badge variant="secondary" className="capitalize">
              {alertRule.type}
            </Badge>
          }
        />
        <NameValuePair
          title="Status"
          value={
            alertRule.enabled ? (
              <Badge variant="success">Enabled</Badge>
            ) : (
              <Badge variant="disabled">Disabled</Badge>
            )
          }
        />
        <NameValuePair
          title="Channels"
          value={getChannelsSummary(alertRule)}
        />
        <NameValuePair
          title="Cooldown"
          value={formatCooldown(alertRule.cooldownMinutes)}
        />
        <NameValuePair
          title="Suppressed"
          value={`${alertRule.suppressedCount} alert${alertRule.suppressedCount !== 1 ? "s" : ""}`}
        />
        <NameValuePair
          title="Last Triggered"
          valueClassName="capitalize"
          value={
            alertRule.lastTriggeredAt
              ? formatRelativeDate(alertRule.lastTriggeredAt)
              : "Never"
          }
        />
        <NameValuePair
          title="Created"
          valueClassName="capitalize"
          value={formatRelativeDate(alertRule.createdAt)}
        />
        <NameValuePair
          title="Updated"
          valueClassName="capitalize"
          value={formatRelativeDate(alertRule.updatedAt)}
        />
      </div>

      <AlertHistoryTable alertHistory={alertHistory} />
    </section>
  );
}
