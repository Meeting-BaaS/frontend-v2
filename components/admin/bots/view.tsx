import { Suspense } from "react";
import { AdminBotsTableFilters } from "@/components/admin/bots/filters/table-filters";
import { AdminBotsTableServer } from "@/components/admin/bots/table-server";
import { AdminBotsTableSkeleton } from "@/components/admin/bots/table-skeleton";
import { PageHeading } from "@/components/layout/page-heading";
import type { ListAllBotsRequestQueryParams } from "@/lib/schemas/admin";

interface AdminBotsViewProps {
  params: ListAllBotsRequestQueryParams | null;
}

export function AdminBotsView({ params }: AdminBotsViewProps) {
  return (
    <>
      <div className="flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <PageHeading title="All Bots" containerClassName="md:flex-1" />
      </div>
      <AdminBotsTableFilters params={params} />
      <Suspense
        key={JSON.stringify(params) ?? "default"}
        fallback={<AdminBotsTableSkeleton />}
      >
        <AdminBotsTableServer params={params} />
      </Suspense>
    </>
  );
}
