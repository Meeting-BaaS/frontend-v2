import { Suspense } from "react";
import { PageHeading } from "@/components/layout/page-heading";
import { TableFilters } from "@/components/logs/filters/table-filters";
import { LogsTableServer } from "@/components/logs/table-server";
import { LogsTableSkeleton } from "@/components/logs/table-skeleton";
import type { ApiKey } from "@/lib/schemas/api-keys";
import type { ListApiLogsRequestQueryParams } from "@/lib/schemas/api-logs";

interface LogsViewProps {
  params: ListApiLogsRequestQueryParams | null;
  apiKeys: ApiKey[];
}

export function LogsView({ params, apiKeys }: LogsViewProps) {
  return (
    <>
      <div className="flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <PageHeading title="API Logs" containerClassName="md:flex-1" />
      </div>
      <TableFilters params={params} apiKeys={apiKeys} />
      <Suspense
        key={JSON.stringify(params) ?? "default"}
        fallback={<LogsTableSkeleton />}
      >
        <LogsTableServer params={params} />
      </Suspense>
    </>
  );
}
