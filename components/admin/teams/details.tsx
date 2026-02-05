"use client";

import { Gift, Infinity as InfinityIcon, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { adminMembersColumns } from "@/components/admin/teams/members-columns";
import { RateLimitsDialog } from "@/components/admin/teams/rate-limits-dialog";
import { TokenOperationsDialog } from "@/components/admin/teams/token-operations-dialog";
import { ItemHeading } from "@/components/layout/item-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NameValuePair } from "@/components/ui/name-value-pair";
import { TeamAvatar } from "@/components/ui/team-avatar";
import { useDataTable } from "@/hooks/use-data-table";
import { formatRelativeDate } from "@/lib/date-helpers";
import type { AdminTeamDetails as AdminTeamDetailsType } from "@/lib/schemas/admin";
import type { TeamMember } from "@/lib/schemas/teams";

interface AdminTeamDetailsProps {
  teamDetails: AdminTeamDetailsType;
  teamId: number;
}

export function AdminTeamDetails({
  teamDetails,
  teamId,
}: AdminTeamDetailsProps) {
  const [rateLimitsOpen, setRateLimitsOpen] = useState(false);
  const [tokenOperationsOpen, setTokenOperationsOpen] = useState(false);

  // Transform admin members to TeamMember format for the table component
  const members: TeamMember[] = useMemo(
    () =>
      teamDetails.members.map((member) => ({
        id: member.userId,
        invitationId: null,
        userId: member.userId,
        email: member.userEmail,
        role: member.role as TeamMember["role"],
        banned: null,
        createdAt: member.createdAt,
        invitationStatus: null,
        expiresAt: null,
      })),
    [teamDetails.members],
  );

  return (
    <section>
      <div className="flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <ItemHeading
          title={`${teamDetails.teamName} (ID: ${teamDetails.teamId})`}
          name={teamDetails.teamSlug}
          nameClassName="text-xl"
          containerClassName="md:flex-1"
          gradientIcon={
            teamDetails.teamLogo ? (
              <div className="relative flex aspect-square size-16 items-center justify-center overflow-hidden rounded-lg">
                <Image
                  src={teamDetails.teamLogo}
                  alt={teamDetails.teamName}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
            ) : (
              <TeamAvatar
                name={teamDetails.teamName}
                size="lg"
                className="size-16"
                textClassName="text-2xl"
              />
            )
          }
        />
        <div className="flex w-full sm:w-auto gap-2 flex-row sm:items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setRateLimitsOpen(true)}>
                <InfinityIcon /> Change Rate Limits
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTokenOperationsOpen(true)}>
                <Gift /> Refund/Gift Tokens
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid mt-10 md:mt-12 md:space-y-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <NameValuePair
          title="Subscription Plan"
          value={
            <Badge className="capitalize">{teamDetails.subscriptionPlan}</Badge>
          }
        />
        <NameValuePair
          title="Created At"
          valueClassName="capitalize"
          value={formatRelativeDate(teamDetails.createdAt)}
        />
        <NameValuePair
          title="Running Bots"
          value={teamDetails.runningBotsCount.toString()}
        />
        <NameValuePair
          title="Available Tokens"
          value={Number.parseFloat(teamDetails.availableTokens).toFixed(2)}
        />
        <NameValuePair
          title="Reserved Tokens"
          value={Number.parseFloat(teamDetails.reservedTokens).toFixed(2)}
        />
        <NameValuePair
          title="Total Tokens Purchased"
          value={Number.parseFloat(teamDetails.totalTokensPurchased).toFixed(2)}
        />
        <NameValuePair
          title="Rate Limit (per second)"
          value={teamDetails.rateLimitPerSecond.toString()}
        />
        <NameValuePair
          title="Daily Bot Cap"
          value={teamDetails.dailyBotCap.toString()}
        />
        <NameValuePair
          title="Calendar Integrations Limit"
          value={teamDetails.calendarIntegrationsLimit.toString()}
        />
        <NameValuePair
          title="Data Retention Days"
          value={teamDetails.dataRetentionDays.toString()}
        />
        <NameValuePair title="SVIX App ID" value={teamDetails.svixAppId} />
        <NameValuePair
          title="Stripe Customer ID"
          value={teamDetails.stripeCustomerId ?? "-"}
        />
        <NameValuePair
          containerClassName="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4"
          title="Team Members"
          value={<AdminMembersTable members={members} />}
        />
      </div>

      <RateLimitsDialog
        teamId={teamId}
        currentLimits={{
          rateLimitPerSecond: teamDetails.rateLimitPerSecond,
          dailyBotCap: teamDetails.dailyBotCap,
          calendarIntegrationsLimit: teamDetails.calendarIntegrationsLimit,
          dataRetentionDays: teamDetails.dataRetentionDays,
        }}
        open={rateLimitsOpen}
        onOpenChange={setRateLimitsOpen}
      />
      <TokenOperationsDialog
        teamId={teamId}
        currentBalance={Number.parseFloat(teamDetails.availableTokens)}
        open={tokenOperationsOpen}
        onOpenChange={setTokenOperationsOpen}
      />
    </section>
  );
}

// Read-only members table for admin view (no actions)
function AdminMembersTable({ members }: { members: TeamMember[] }) {
  const { table } = useDataTable({
    data: members,
    columns: adminMembersColumns,
    getRowId: (row) => row.email,
    initialSorting: [{ id: "email", desc: false }],
  });

  if (members.length === 0) {
    return <div className="text-muted-foreground py-4">No members found</div>;
  }

  return <DataTable table={table} />;
}
