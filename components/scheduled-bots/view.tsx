import { Suspense } from "react";
import { DocsButton } from "@/components/layout/docs-button";
import { PageHeading } from "@/components/layout/page-heading";
import { ScheduledBotsTableFilters } from "@/components/scheduled-bots/filters/table-filters";
import { ScheduledBotsTableServer } from "@/components/scheduled-bots/table-server";
import { ScheduledBotsTableSkeleton } from "@/components/scheduled-bots/table-skeleton";
import type { ListScheduledBotsRequestQueryParams } from "@/lib/schemas/scheduled-bots";

interface ScheduledBotsViewProps {
  params: ListScheduledBotsRequestQueryParams | null;
}

export function ScheduledBotsView({ params }: ScheduledBotsViewProps) {
  return (
    <>
      <div className="flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <PageHeading title="Scheduled Bots" containerClassName="md:flex-1" />
        <div className="flex w-full sm:w-auto flex-col gap-2 sm:flex-row sm:items-center">
          <DocsButton uriSuffix="api-v2/reference/bots/list-scheduled-bots" />
        </div>
      </div>

      <ScheduledBotsTableFilters params={params} />

      <Suspense
        key={JSON.stringify(params) ?? "scheduled-default"}
        fallback={<ScheduledBotsTableSkeleton />}
      >
        <ScheduledBotsTableServer params={params} />
      </Suspense>
    </>
  );
}
