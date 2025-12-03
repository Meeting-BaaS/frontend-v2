"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { columns } from "@/components/settings/billing/columns";
import { DataTable } from "@/components/ui/data-table";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { useDataTable } from "@/hooks/use-data-table";
import type {
  Invoice,
  ListInvoicesRequestQueryParams,
} from "@/lib/schemas/settings";

interface InvoiceTableProps {
  invoices: Invoice[];
  hasMore: boolean;
  params: ListInvoicesRequestQueryParams;
}

export function InvoiceTable({ invoices, hasMore, params }: InvoiceTableProps) {
  const searchParams = useSearchParams();

  const { table } = useDataTable({
    data: invoices || [],
    columns,
    getRowId: (row) => row.id,
    initialSorting: [
      {
        id: "created",
        desc: true,
      },
    ],
    manualPagination: true,
  });

  const hasNoParams = !params.starting_after && !params.ending_before;

  const prevIteratorLink = useMemo(() => {
    // Disable if on first page (no params) OR if going backward (ending_before) and no more pages
    if (hasNoParams || (!!params.ending_before && !hasMore)) {
      return null;
    }

    if (invoices.length > 0) {
      const firstInvoiceId = invoices[0]?.id;
      if (firstInvoiceId) {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.delete("starting_after");
        newSearchParams.set("ending_before", firstInvoiceId);
        return `/settings/billing?${newSearchParams.toString()}`;
      }
    }
    return null;
  }, [invoices, params.ending_before, hasMore, hasNoParams, searchParams]);

  const nextIteratorLink = useMemo(() => {
    // Disable if going forward (starting_after) and no more pages, OR if on first page and no more pages
    if ((!!params.starting_after && !hasMore) || (hasNoParams && !hasMore)) {
      return null;
    }

    if (invoices.length > 0) {
      const lastInvoiceId = invoices[invoices.length - 1]?.id;
      if (lastInvoiceId) {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.delete("ending_before");
        newSearchParams.set("starting_after", lastInvoiceId);
        return `/settings/billing?${newSearchParams.toString()}`;
      }
    }
    return null;
  }, [invoices, params.starting_after, hasMore, hasNoParams, searchParams]);

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

  return (
    <DataTable
      table={table}
      rowCellClassName="py-1"
      serverSidePagination
      prevIteratorLink={prevIteratorLink}
      nextIteratorLink={nextIteratorLink}
      scrollOnPageChange={false}
    />
  );
}
