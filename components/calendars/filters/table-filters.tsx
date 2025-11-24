import { CalendarsSearchFilter } from "@/components/calendars/filters/search-filter";
import { CalendarsStatusFilter } from "@/components/calendars/filters/status-filter";
import type { ListCalendarsRequestQueryParams } from "@/lib/schemas/calendars";

interface CalendarsTableFiltersProps {
  params: ListCalendarsRequestQueryParams;
}

export function CalendarsTableFilters({ params }: CalendarsTableFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-4 sm:mt-0 gap-2 w-full flex-col md:flex-row items-center py-4">
      <CalendarsSearchFilter email={params?.email} />
      <CalendarsStatusFilter status={params?.status} />
    </div>
  );
}
