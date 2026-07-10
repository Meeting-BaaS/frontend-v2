import { Building2, Plus } from "lucide-react"
import { columns } from "@/components/microsoft-teams/columns"
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
import type { TeamsWorkspace } from "@/lib/schemas/teams-workspaces"

interface TeamsWorkspacesTableProps {
  workspaces: TeamsWorkspace[]
  onAddButtonClick: () => void
}

export function TeamsWorkspacesTable({ workspaces, onAddButtonClick }: TeamsWorkspacesTableProps) {
  const { table } = useDataTable({
    data: workspaces || [],
    columns,
    initialSorting: [{ id: "created_at", desc: true }],
    getRowId: (row) => row.workspace_id
  })

  if (!workspaces || workspaces.length === 0) {
    return (
      <Empty className="border rounded-lg mt-8">
        <EmptyHeader>
          <EmptyMedia>
            <GradientIcon color="var(--color-blue-300)" size="lg">
              <Building2 />
            </GradientIcon>
          </EmptyMedia>
          <EmptyTitle>No workspaces yet</EmptyTitle>
          <EmptyDescription>
            Add a Microsoft 365 tenant to enable authenticated Teams bots that sign in with a real
            account and bypass the lobby.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="primary" size="sm" className="font-medium" onClick={onAddButtonClick}>
            <Plus /> Add Workspace
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <DataTable
      table={table}
      clientSideSearch
      searchColumn="name"
      searchPlaceholder="Search by name..."
    />
  )
}
