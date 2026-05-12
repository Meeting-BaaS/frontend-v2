import { Plus, Users } from "lucide-react"
import { useMemo } from "react"
import { buildLoginColumns } from "@/components/google-workspaces/logins-columns"
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
import type { MeetLogin } from "@/lib/schemas/meet-logins"
import type { MeetWorkspace } from "@/lib/schemas/meet-workspaces"

interface LoginsTableProps {
  logins: MeetLogin[]
  workspace: MeetWorkspace
  onAddButtonClick: () => void
}

export function LoginsTable({ logins, workspace, onAddButtonClick }: LoginsTableProps) {
  const columns = useMemo(() => buildLoginColumns(workspace), [workspace])
  const { table } = useDataTable({
    data: logins || [],
    columns,
    initialSorting: [{ id: "last_used_at", desc: true }],
    getRowId: (row) => row.credential_id
  })

  if (!logins || logins.length === 0) {
    return (
      <Empty className="border rounded-lg mt-8">
        <EmptyHeader>
          <EmptyMedia>
            <GradientIcon color="var(--color-green-300)" size="lg">
              <Users />
            </GradientIcon>
          </EmptyMedia>
          <EmptyTitle>No logins yet</EmptyTitle>
          <EmptyDescription>
            Add a Workspace user identity to start dispatching authenticated bots under this
            workspace. Each login can support up to 20 concurrent sessions.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="primary" size="sm" className="font-medium" onClick={onAddButtonClick}>
            <Plus /> Add Login
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <DataTable
      table={table}
      clientSideSearch
      searchColumn="email"
      searchPlaceholder="Search by email..."
    />
  )
}
