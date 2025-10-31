import { Lock, Plus } from "lucide-react";
import { columns } from "@/components/api-keys/columns";
import { PermissionFilter } from "@/components/api-keys/permission-filter";
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
import { useDataTable } from "@/hooks/use-data-table";
import type { ApiKeyListResponse } from "@/lib/schemas/api-keys";

interface ApiKeysTableProps {
  apiKeys: ApiKeyListResponse;
  onAddButtonClick: () => void;
}

export function ApiKeysTable({ apiKeys, onAddButtonClick }: ApiKeysTableProps) {
  const { table } = useDataTable({
    data: apiKeys || [],
    columns,
    initialSorting: [{ id: "createdAt", desc: true }],
    getRowId: (row) => row.id,
  });

  if (!apiKeys || apiKeys.length === 0) {
    return (
      <Empty className="border rounded-lg mt-8">
        <EmptyHeader>
          <EmptyMedia>
            <GradientIcon color="var(--color-orange-300)" size="lg">
              <Lock />
            </GradientIcon>
          </EmptyMedia>
          <EmptyTitle>No API keys yet</EmptyTitle>
          <EmptyDescription>
            Generate an API key to authenticate requests and send bots through
            the API.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="sm" className="font-medium" onClick={onAddButtonClick}>
            <Plus /> Create API Key
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <DataTable
      table={table}
      searchColumn="name"
      additionalFilters={<PermissionFilter table={table} />}
    />
  );
}
