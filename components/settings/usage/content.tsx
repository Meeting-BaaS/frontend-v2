"use client";

import { Info } from "lucide-react";
import { PlansDialog } from "@/components/settings/usage/plans-dialog";
import { TokenUsageRatesSheet } from "@/components/settings/usage/token-usage-rates-sheet";
import { Button } from "@/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import { CircularProgress } from "@/components/ui/circular-progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatRelativeDate } from "@/lib/date-helpers";
import type { UsageStats } from "@/lib/schemas/settings";

interface UsageContentProps {
  usageStats: UsageStats;
}

export function UsageContent({ usageStats }: UsageContentProps) {
  const planName =
    usageStats.plan.name === "payg" ? "Pay as You Go" : usageStats.plan.name;
  // const isEnterprise = usageStats.plan.type === "Enterprise";

  return (
    <div className="flex flex-col gap-8 mt-10">
      {/* API Plan Section */}
      <div className="flex flex-col border-b pb-8 md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg md:text-xl font-semibold">API Plan</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Choose a plan that fits your needs.
          </p>
          <div>
            <PlansDialog>
              <Button variant="secondary" size="sm" className="mt-2 capitalize">
                {usageStats.plan.name === "payg" ? "Upgrade" : "Manage"}
              </Button>
            </PlansDialog>
          </div>
        </div>
        <div className="flex flex-col md:w-md lg:w-lg xl:w-xl [&>div]:flex [&>div]:flex-row [&>div]:items-center [&>div]:gap-2 [&>div]:py-4 [&>div]:border-b [&>div:last-child]:border-0">
          <h3 className="text-md md:text-lg font-semibold mb-4 capitalize">
            {planName}
          </h3>
          <div>
            <div className="flex items-center gap-2 grow">
              <CircularProgress
                value={
                  usageStats.plan.dailyBotCap
                    ? usageStats.usage.botsCreatedToday
                    : 0
                }
                max={usageStats.plan.dailyBotCap ?? 0}
                size={24}
                strokeWidth={4}
                showLabel={false}
              />
              <span className="text-sm">Daily Bot Limit</span>
            </div>
            <div>
              {usageStats.plan.dailyBotCap ? (
                <span className="text-sm">
                  {usageStats.usage.botsCreatedToday} /{" "}
                  {usageStats.plan.dailyBotCap}
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">Unlimited</span>
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 grow">
              <CircularProgress
                value={
                  usageStats.plan.calendarIntegrationsLimit
                    ? usageStats.usage.calendarIntegrations
                    : 0
                }
                max={usageStats.plan.calendarIntegrationsLimit ?? 0}
                size={24}
                strokeWidth={4}
                showLabel={false}
              />
              <span className="text-sm">Calendar Integrations</span>
            </div>
            <div>
              {usageStats.plan.calendarIntegrationsLimit ? (
                <span className="text-sm">
                  {usageStats.usage.calendarIntegrations} /{" "}
                  {usageStats.plan.calendarIntegrationsLimit}
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">Unlimited</span>
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 grow">
              <CircularProgress
                value={usageStats.plan.byokTranscriptionEnabled ? 1 : 0}
                max={1}
                size={24}
                strokeWidth={4}
                showLabel={false}
                alwaysGreen
              />
              <span className="text-sm">Bring Your Own Transcription Key</span>
            </div>
            <div>
              <span className="text-sm">
                {usageStats.plan.byokTranscriptionEnabled
                  ? "Enabled"
                  : "Upgrade to enable"}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Token Section */}
      <div className="flex flex-col border-b pb-8 md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg md:text-xl font-semibold">Tokens</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Turn on auto-purchase to make sure you never run out of tokens.{" "}
            <TokenUsageRatesSheet />
          </p>
          <div className="mt-2">
            <ButtonGroup>
              <Button variant="secondary" size="sm">
                {usageStats.plan.autoPurchaseEnabled
                  ? "Manage auto-purchase"
                  : "Enable auto-purchase"}
              </Button>
              <ButtonGroupSeparator />
              <Button variant="secondary" size="sm">
                Buy tokens
              </Button>
            </ButtonGroup>
          </div>
        </div>
        <div className="flex flex-col md:w-md lg:w-lg xl:w-xl [&>div]:flex [&>div]:flex-row [&>div]:items-center [&>div]:gap-2 [&>div]:py-2 [&>div]:border-b [&>div:last-child]:border-0">
          <h3 className="text-md md:text-lg font-semibold mb-4">
            Token Balance
          </h3>
          <div>
            <div className="flex items-center gap-2 grow">
              <span className="text-sm">Last Token Purchase</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground capitalize">
                {formatRelativeDate(usageStats.lastTokenPurchase.createdAt)}
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 grow">
              <span className="text-sm">Tokens Consumed</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">
                {usageStats.tokens.totalUsed.toFixed(2)}
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 grow">
              <span className="text-sm">Reserved Tokens</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <strong>Reserved tokens</strong> are tokens that are
                    reserved by the active bots. Upon the creation of a bot, it
                    reserves 0.5 tokens which is released when it completes.
                    Please contact support if you notice reserved tokens not
                    being released.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">
                {usageStats.tokens.reserved.toFixed(2)}
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 grow">
              <span className="text-sm">Available Tokens</span>
            </div>
            <div>
              <span className="text-sm">
                {usageStats.tokens.available.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Limits Section */}
      <div className="flex flex-col pb-8 md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg md:text-xl font-semibold">Limits</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Understand the limits and data retention policy for your plan.
          </p>
        </div>
        <div className="flex flex-col md:w-md lg:w-lg xl:w-xl [&>div]:flex [&>div]:flex-row [&>div]:items-center [&>div]:gap-2 [&>div]:py-4 [&>div]:border-b [&>div:last-child]:border-0">
          <h3 className="text-md md:text-lg font-semibold mb-4 capitalize">
            {planName}
          </h3>
          <div>
            <div className="flex items-center gap-2 grow">
              <CircularProgress
                value={0}
                max={usageStats.plan.rateLimitPerSecond ?? 0}
                size={24}
                strokeWidth={4}
                showLabel={false}
              />
              <span className="text-sm">Rate Limit</span>
            </div>
            <div>
              {usageStats.plan.rateLimitPerSecond ? (
                <span className="text-sm">
                  {usageStats.plan.rateLimitPerSecond} request
                  {usageStats.plan.rateLimitPerSecond > 1 ? "s" : ""} / second
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">Unlimited</span>
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 grow">
              <CircularProgress
                value={0}
                max={usageStats.plan.dataRetentionDays ?? 0}
                size={24}
                strokeWidth={4}
                showLabel={false}
              />
              <span className="text-sm flex items-center gap-2">
                Data Retention{" "}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      After the retention period, the meeting data is deleted.
                      Please ensure that you are downloading the data before the
                      retention period ends. You can also request for early
                      deletion by calling the delete endpoint.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>
            </div>
            <div>
              {usageStats.plan.dataRetentionDays ? (
                <span className="text-sm">
                  {usageStats.plan.dataRetentionDays} days
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">Unlimited</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
