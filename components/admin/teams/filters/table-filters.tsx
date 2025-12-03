"use client";

import { EmailFilter } from "@/components/admin/teams/filters/email-filter";
import { TeamNameFilter } from "@/components/admin/teams/filters/team-name-filter";
import type { ListAllTeamsRequestQueryParams } from "@/lib/schemas/admin";

interface TableFiltersProps {
  params: ListAllTeamsRequestQueryParams | null;
}

export function AdminTeamsTableFilters({ params }: TableFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 mt-4 sm:mt-0 gap-2 w-full flex-col md:flex-row items-center py-4">
      <EmailFilter searchEmail={params?.searchEmail ?? null} />
      <TeamNameFilter searchTeamName={params?.searchTeamName ?? null} />
    </div>
  );
}
