import { Bell, Plus } from "lucide-react"
import { columns } from "@/components/alerts/columns"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty"
import { GradientIcon } from "@/components/ui/gradient-icon"
import { useDataTable } from "@/hooks/use-data-table"
import type { AlertRule } from "@/lib/schemas/alerts"

interface AlertsTableProps {
  rules: AlertRule[]
  onAddButtonClick: () => void
}

export function AlertsTable({ rules, onAddButtonClick }: AlertsTableProps) {
  const { table } = useDataTable({
    data: rules || [],
    columns,
    initialSorting: [{ id: "createdAt", desc: true }],
    getRowId: (row) => row.uuid
  })

  if (!rules || rules.length === 0) {
    return (
      <Empty className="border rounded-lg mt-8">
        <EmptyHeader>
          <EmptyMedia>
            <GradientIcon color="var(--color-amber-300)" size="lg">
              <Bell />
            </GradientIcon>
          </EmptyMedia>
          <EmptyTitle>No alert rules yet</EmptyTitle>
          <EmptyDescription>
            Create a threshold alert to get notified when your resource usage reaches a limit.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="primary" size="sm" className="font-medium" onClick={onAddButtonClick}>
            <Plus /> Add Rule
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  return <DataTable table={table} tableContainerClassName="mt-6" />
}
