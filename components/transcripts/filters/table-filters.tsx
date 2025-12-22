import { ProviderFilter } from "@/components/transcripts/filters/provider-filter";
import { SearchFilter } from "@/components/transcripts/filters/search-filter";
import { DateRangeFilter } from "@/components/transcripts/filters/date-range-filter";
import { PlatformFilter } from "@/components/transcripts/filters/platform-filter";
import type { ListBotsRequestQueryParams } from "@/lib/schemas/bots";

interface TranscriptsTableFiltersProps {
  params: ListBotsRequestQueryParams | null;
}

export function TranscriptsTableFilters({
  params,
}: TranscriptsTableFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <SearchFilter currentUuid={params?.botUuid?.[0] ?? null} />
      <ProviderFilter currentProviders={params?.provider ?? []} />
      <PlatformFilter currentPlatforms={params?.meetingPlatform ?? []} />
      <DateRangeFilter
        createdBefore={params?.createdBefore ?? null}
        createdAfter={params?.createdAfter ?? null}
      />
    </div>
  );
}
