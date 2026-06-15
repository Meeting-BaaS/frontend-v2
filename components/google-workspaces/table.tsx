import { Building2, Plus } from "lucide-react"
import { columns } from "@/components/google-workspaces/columns"
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
import type { MeetWorkspace } from "@/lib/schemas/meet-workspaces"

interface WorkspacesTableProps {
  workspaces: MeetWorkspace[]
  onAddButtonClick: () => void
}

export function WorkspacesTable({ workspaces, onAddButtonClick }: WorkspacesTableProps) {
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
            Add a Google Workspace to enable SAML SSO authentication for your Meet bots and bypass
            the high-risk lobby queue.
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
