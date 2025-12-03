"use client";

import { BotIdFilter } from "@/components/admin/bots/filters/bot-id-filter";
import { AdminDateRangeFilter } from "@/components/admin/bots/filters/date-range-filter";
import { AdminPlatformFilter } from "@/components/admin/bots/filters/platform-filter";
import { AdminStatusFilter } from "@/components/admin/bots/filters/status-filter";
import { TeamNameFilter } from "@/components/admin/bots/filters/team-name-filter";
import type { ListAllBotsRequestQueryParams } from "@/lib/schemas/admin";

interface TableFiltersProps {
  params: ListAllBotsRequestQueryParams | null;
}

export function AdminBotsTableFilters({ params }: TableFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mt-4 sm:mt-0 gap-2 w-full flex-col md:flex-row items-center py-4">
      <BotIdFilter botId={params?.botId ?? null} />
      <TeamNameFilter teamName={params?.teamName ?? null} />
      <AdminDateRangeFilter
        createdBefore={params?.createdBefore}
        createdAfter={params?.createdAfter}
      />
      <AdminPlatformFilter meetingPlatform={params?.meetingPlatform} />
      <AdminStatusFilter status={params?.status} />
    </div>
  );
}
