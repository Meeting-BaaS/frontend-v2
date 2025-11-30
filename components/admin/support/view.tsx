import { Suspense } from "react";
import { AdminSupportTableFilters } from "@/components/admin/support/filters/table-filters";
import { AdminSupportTableServer } from "@/components/admin/support/table-server";
import { AdminSupportTableSkeleton } from "@/components/admin/support/table-skeleton";
import { PageHeading } from "@/components/layout/page-heading";
import type { ListAllSupportTicketsRequestQueryParams } from "@/lib/schemas/admin";

interface AdminSupportViewProps {
  params: ListAllSupportTicketsRequestQueryParams | null;
}

export function AdminSupportView({ params }: AdminSupportViewProps) {
  return (
    <>
      <div className="flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <PageHeading title="Support Panel" containerClassName="md:flex-1" />
      </div>
      <AdminSupportTableFilters params={params} />
      <Suspense
        key={JSON.stringify(params) ?? "default"}
        fallback={<AdminSupportTableSkeleton />}
      >
        <AdminSupportTableServer params={params} />
      </Suspense>
    </>
  );
}
