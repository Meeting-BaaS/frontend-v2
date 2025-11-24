import { PlatformFilter } from "@/components/bots/filters/platform-filter";
import { ScheduledBotsDateRangeFilter } from "@/components/scheduled-bots/filters/date-range-filter";
import { ScheduledBotsSearchFilter } from "@/components/scheduled-bots/filters/search-filter";
import { ScheduledBotsStatusFilter } from "@/components/scheduled-bots/filters/status-filter";
import type { ListScheduledBotsRequestQueryParams } from "@/lib/schemas/scheduled-bots";

interface ScheduledBotsTableFiltersProps {
  params: ListScheduledBotsRequestQueryParams;
}

export function ScheduledBotsTableFilters({
  params,
}: ScheduledBotsTableFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mt-4 sm:mt-0 gap-2 w-full flex-col md:flex-row items-center py-4">
      <ScheduledBotsSearchFilter botUuid={params?.botUuid} />
      <ScheduledBotsDateRangeFilter
        scheduledBefore={params?.scheduledBefore}
        scheduledAfter={params?.scheduledAfter}
      />
      <PlatformFilter meetingPlatform={params?.meetingPlatform} />
      <ScheduledBotsStatusFilter status={params?.status} />
    </div>
  );
}
