import { History } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { historyColumns } from "@/components/alerts/history/columns";
import { useDataTable } from "@/hooks/use-data-table";
import type { AlertHistoryRecord } from "@/lib/schemas/alerts";

interface AlertHistoryTableProps {
  alertHistory: AlertHistoryRecord[];
}

export function AlertHistoryTable({ alertHistory }: AlertHistoryTableProps) {
  const { table } = useDataTable({
    data: alertHistory || [],
    columns: historyColumns,
    initialSorting: [{ id: "triggeredAt", desc: true }],
    getRowId: (row) => row.id,
  });

  if (!alertHistory || alertHistory.length === 0) {
    return (
      <Empty className="border rounded-lg mt-8">
        <EmptyHeader>
          <EmptyMedia>
            <GradientIcon color="var(--color-gray-300)" size="lg">
              <History />
            </GradientIcon>
          </EmptyMedia>
          <EmptyTitle>No alert history</EmptyTitle>
          <EmptyDescription>
            Alerts triggered by this rule will appear here.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="mt-10">
      <h3 className="text-lg font-semibold mb-4">Alert History</h3>
      <DataTable table={table} />
    </div>
  );
}
