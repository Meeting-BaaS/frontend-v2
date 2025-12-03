"use client";

import { EmailFilter } from "@/components/admin/teams/filters/email-filter";
import type { ListAllTeamsRequestQueryParams } from "@/lib/schemas/admin";

interface TableFiltersProps {
  params: ListAllTeamsRequestQueryParams | null;
}

export function AdminTeamsTableFilters({ params }: TableFiltersProps) {
  return (
    <div className="grid grid-cols-1 mt-4 gap-2 w-full flex-col md:flex-row items-center">
      <EmailFilter searchEmail={params?.searchEmail ?? null} />
    </div>
  );
}
