"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/webhooks/messages/attempts-columns";
import { useDataTable } from "@/hooks/use-data-table";
import type { WebhookMessageAttempt } from "@/lib/schemas/webhooks";

interface AttemptsTableProps {
  attempts: WebhookMessageAttempt[];
}

export function AttemptsTable({ attempts }: AttemptsTableProps) {
  const { table } = useDataTable({
    data: attempts,
    columns,
    getRowId: (row) => row.id,
    manualPagination: true,
  });

  if (attempts.length === 0) return null;

  return (
    <div className="mt-10 flex flex-col gap-2">
      <div className="text-muted-foreground text-xs uppercase">
        Delivery Attempts
      </div>
      <DataTable table={table} rowCellClassName="py-1" />
    </div>
  );
}
