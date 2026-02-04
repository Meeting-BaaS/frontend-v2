"use client";

import { ShieldCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { getColumns } from "@/components/admin/admins/columns";
import { DataTable } from "@/components/ui/data-table";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { useDataTable } from "@/hooks/use-data-table";
import type { AdminListUser } from "@/types/admin-users";

interface AdminAdminsTableProps {
  admins: AdminListUser[];
  onSuccess: () => void;
}

export function AdminAdminsTable({ admins, onSuccess }: AdminAdminsTableProps) {
  const searchParams = useSearchParams();
  const columnsWithActions = getColumns(onSuccess);

  const { table } = useDataTable({
    data: admins ?? [],
    columns: columnsWithActions,
    getRowId: (row) => row.id,
    manualPagination: false,
    initialSorting: [{ id: "email", desc: false }],
  });

  if (!searchParams.toString() && (!admins || admins.length === 0)) {
    return (
      <Empty className="border rounded-lg mt-8">
        <EmptyHeader>
          <EmptyMedia>
            <GradientIcon color="var(--color-orange-300)" size="lg">
              <ShieldCheck />
            </GradientIcon>
          </EmptyMedia>
          <EmptyTitle>No admins yet</EmptyTitle>
          <EmptyDescription>
            Add an admin using the Add Admin button above.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <DataTable
      table={table}
      clientSideSearch
      searchColumn="email"
      searchPlaceholder="Search by email..."
    />
  );
}
