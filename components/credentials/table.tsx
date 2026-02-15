import { Plus, ShieldPlus } from "lucide-react"
import { columns } from "@/components/credentials/columns"
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
import type { ZoomCredential } from "@/lib/schemas/credentials"

interface CredentialsTableProps {
  credentials: ZoomCredential[]
  onAddButtonClick: () => void
}

export function CredentialsTable({ credentials, onAddButtonClick }: CredentialsTableProps) {
  const { table } = useDataTable({
    data: credentials || [],
    columns,
    initialSorting: [{ id: "created_at", desc: true }],
    getRowId: (row) => row.credential_id
  })

  if (!credentials || credentials.length === 0) {
    return (
      <Empty className="border rounded-lg mt-8">
        <EmptyHeader>
          <EmptyMedia>
            <GradientIcon color="var(--color-blue-300)" size="lg">
              <ShieldPlus />
            </GradientIcon>
          </EmptyMedia>
          <EmptyTitle>No credentials yet</EmptyTitle>
          <EmptyDescription>
            Add Zoom OAuth credentials to allow bots to join meetings on behalf of users.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="primary" size="sm" className="font-medium" onClick={onAddButtonClick}>
            <Plus /> Add Credential
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
