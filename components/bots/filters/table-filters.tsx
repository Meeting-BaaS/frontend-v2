import { DateRangeFilter } from "@/components/bots/filters/date-range-filter";
import { PlatformFilter } from "@/components/bots/filters/platform-filter";
import { SearchFilter } from "@/components/bots/filters/search-filter";
import { StatusFilter } from "@/components/bots/filters/status-filter";
import type { ListBotsRequestQueryParams } from "@/lib/schemas/bots";

interface TableFiltersProps {
  params: ListBotsRequestQueryParams;
}

export function TableFilters({ params }: TableFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mt-4 sm:mt-0 gap-2 w-full flex-col md:flex-row items-center py-4">
      <SearchFilter botUuid={params?.botUuid} />
      <DateRangeFilter
        createdBefore={params?.createdBefore}
        createdAfter={params?.createdAfter}
      />
      <PlatformFilter meetingPlatform={params?.meetingPlatform} />
      <StatusFilter status={params?.status} />
    </div>
  );
}
