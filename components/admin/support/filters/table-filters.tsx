"use client";

import { AdminModuleFilter } from "@/components/admin/support/filters/module-filter";
import { AdminStatusFilter } from "@/components/admin/support/filters/status-filter";
import type { ListAllSupportTicketsRequestQueryParams } from "@/lib/schemas/admin";

interface AdminSupportTableFiltersProps {
  params: ListAllSupportTicketsRequestQueryParams | null;
}

export function AdminSupportTableFilters({
  params,
}: AdminSupportTableFiltersProps) {
  return (
    <div className="flex gap-2 w-full md:w-auto flex-col md:flex-row mt-4 sm:mt-0 py-4">
      <AdminStatusFilter status={params?.status ?? null} />
      <AdminModuleFilter module={params?.module ?? null} />
    </div>
  );
}
