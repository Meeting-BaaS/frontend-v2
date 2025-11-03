import { ApiKeyFilter } from "@/components/logs/filters/api-key-filter";
import { DateRangeFilter } from "@/components/logs/filters/date-range-filter";
import { StatusFilter } from "@/components/logs/filters/status-filter";
import type { ApiKey } from "@/lib/schemas/api-keys";
import type { ListApiLogsRequestQueryParams } from "@/lib/schemas/api-logs";

interface TableFiltersProps {
  params: ListApiLogsRequestQueryParams;
  apiKeys: ApiKey[];
}

export function TableFilters({ params, apiKeys }: TableFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 sm:mt-0 gap-2 w-full flex-col md:flex-row items-center py-4">
      <DateRangeFilter
        createdBefore={params?.createdBefore}
        createdAfter={params?.createdAfter}
      />
      <StatusFilter responseStatus={params?.responseStatus} />
      <ApiKeyFilter apiKeyId={params?.apiKeyId} apiKeys={apiKeys} />
    </div>
  );
}
