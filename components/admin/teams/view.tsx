import { Plus } from "lucide-react";
import { Suspense } from "react";
import { AdminTeamsTableFilters } from "@/components/admin/teams/filters/table-filters";
import { ImportUsersDialog } from "@/components/admin/teams/import-users-dialog";
import { AdminTeamsTableServer } from "@/components/admin/teams/table-server";
import { AdminTeamsTableSkeleton } from "@/components/admin/teams/table-skeleton";
import { PageHeading } from "@/components/layout/page-heading";
import { Button } from "@/components/ui/button";
import type { ListAllTeamsRequestQueryParams } from "@/lib/schemas/admin";

interface AdminTeamsViewProps {
  params: ListAllTeamsRequestQueryParams | null;
}

export function AdminTeamsView({ params }: AdminTeamsViewProps) {
  return (
    <>
      <div className="flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <PageHeading title="All Teams" containerClassName="md:flex-1" />
        <ImportUsersDialog>
          <Button size="sm">
            <Plus /> Import users
          </Button>
        </ImportUsersDialog>
      </div>
      <AdminTeamsTableFilters params={params} />
      <Suspense
        key={JSON.stringify(params) ?? "default"}
        fallback={<AdminTeamsTableSkeleton />}
      >
        <AdminTeamsTableServer params={params} />
      </Suspense>
    </>
  );
}
