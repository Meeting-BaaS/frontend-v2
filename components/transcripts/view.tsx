import { Suspense } from "react";
import { TranscriptsTableFilters } from "@/components/transcripts/filters/table-filters";
import { TranscriptsTableServer } from "@/components/transcripts/table-server";
import { TranscriptsTableSkeleton } from "@/components/transcripts/table-skeleton";
import { DocsButton } from "@/components/layout/docs-button";
import { PageHeading } from "@/components/layout/page-heading";
import type { ListBotsRequestQueryParams } from "@/lib/schemas/bots";

interface TranscriptsViewProps {
  params: ListBotsRequestQueryParams | null;
}

export function TranscriptsView({ params }: TranscriptsViewProps) {
  return (
    <>
      <div className="flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <PageHeading title="Transcripts" containerClassName="md:flex-1" />
        <div className="flex w-full sm:w-auto flex-col gap-2 sm:flex-row sm:items-center">
          <DocsButton uriSuffix="api-v2/reference/bots/list-bots" />
        </div>
      </div>
      <TranscriptsTableFilters params={params} />
      <Suspense
        key={JSON.stringify(params) ?? "default"}
        fallback={<TranscriptsTableSkeleton />}
      >
        <TranscriptsTableServer params={params} />
      </Suspense>
    </>
  );
}
