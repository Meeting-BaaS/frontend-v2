import { Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { columns } from "@/components/alerts/columns";
import { useDataTable } from "@/hooks/use-data-table";
import type { AlertRule } from "@/lib/schemas/alerts";

interface AlertRulesTableProps {
  alertRules: AlertRule[];
  onAddButtonClick: () => void;
}

export function AlertRulesTable({
  alertRules,
  onAddButtonClick,
}: AlertRulesTableProps) {
  const { table } = useDataTable({
    data: alertRules || [],
    columns,
    initialSorting: [{ id: "createdAt", desc: true }],
    getRowId: (row) => row.id,
  });

  if (!alertRules || alertRules.length === 0) {
    return (
      <Empty className="border rounded-lg mt-8">
        <EmptyHeader>
          <EmptyMedia>
            <GradientIcon color="var(--color-green-300)" size="lg">
              <Bell />
            </GradientIcon>
          </EmptyMedia>
          <EmptyTitle>No alert rules yet</EmptyTitle>
          <EmptyDescription>
            Create alert rules to get notified when usage thresholds are reached
            or when bot events occur.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            variant="primary"
            size="sm"
            className="font-medium"
            onClick={onAddButtonClick}
          >
            <Plus /> Add alert rule
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return <DataTable table={table} tableContainerClassName="mt-6" />;
}
