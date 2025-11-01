import { Suspense } from "react";
import { TableFilters } from "@/components/bots/filters/table-filters";
import { BotsTableServer } from "@/components/bots/table-server";
import { BotsTableSkeleton } from "@/components/bots/table-skeleton";
import { DocsButton } from "@/components/layout/docs-button";
import { PageHeading } from "@/components/layout/page-heading";
import type { ListBotsRequestQueryParams } from "@/lib/schemas/bots";

interface BotsViewProps {
  params: ListBotsRequestQueryParams | null;
}

export function BotsView({ params }: BotsViewProps) {
  return (
    <>
      <div className="flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <PageHeading title="Bots" containerClassName="md:flex-1" />
        <div className="flex w-full sm:w-auto flex-col gap-2 sm:flex-row sm:items-center">
          <DocsButton />
        </div>
      </div>
      <TableFilters params={params} />
      <Suspense
        key={JSON.stringify(params) ?? "default"}
        fallback={<BotsTableSkeleton />}
      >
        <BotsTableServer params={params} />
      </Suspense>
    </>
  );
}
