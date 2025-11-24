import { Suspense } from "react";
import { CalendarsTableFilters } from "@/components/calendars/filters/table-filters";
import { CalendarsTableServer } from "@/components/calendars/table-server";
import { CalendarsTableSkeleton } from "@/components/calendars/table-skeleton";
import { DocsButton } from "@/components/layout/docs-button";
import { PageHeading } from "@/components/layout/page-heading";
import type { ListCalendarsRequestQueryParams } from "@/lib/schemas/calendars";

interface CalendarsViewProps {
  params: ListCalendarsRequestQueryParams | null;
}

export function CalendarsView({ params }: CalendarsViewProps) {
  return (
    <>
      <div className="flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <PageHeading title="Calendars" containerClassName="md:flex-1" />
        <div className="flex w-full sm:w-auto flex-col gap-2 sm:flex-row sm:items-center">
          <DocsButton />
        </div>
      </div>

      <CalendarsTableFilters params={params} />

      <Suspense
        key={JSON.stringify(params) ?? "calendars-default"}
        fallback={<CalendarsTableSkeleton />}
      >
        <CalendarsTableServer params={params} />
      </Suspense>
    </>
  );
}
