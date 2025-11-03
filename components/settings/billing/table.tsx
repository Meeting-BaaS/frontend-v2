"use client";

import { columns } from "@/components/settings/billing/columns";
import { DataTable } from "@/components/ui/data-table";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { useDataTable } from "@/hooks/use-data-table";
import type { Invoice } from "@/lib/schemas/settings";

interface InvoiceTableProps {
  invoices: Invoice[];
}

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  const { table } = useDataTable({
    data: invoices,
    columns,
    getRowId: (row) => row.id,
    initialSorting: [
      {
        id: "created",
        desc: true,
      },
    ],
  });

  if (!invoices || invoices.length === 0) {
    return (
      <Empty className="border rounded-lg">
        <EmptyHeader>
          <EmptyTitle>No invoices found</EmptyTitle>
          <EmptyDescription>
            Invoices will appear here once they are generated.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return <DataTable table={table} />;
}
