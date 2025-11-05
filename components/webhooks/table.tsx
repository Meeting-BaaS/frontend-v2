import { Lock, Plus } from "lucide-react";
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
import { columns } from "@/components/webhooks/columns";
import { useDataTable } from "@/hooks/use-data-table";
import type { WebhookEndpoint } from "@/lib/schemas/webhooks";

interface WebhooksTableProps {
  webhookEndpoints: WebhookEndpoint[];
  onAddButtonClick: () => void;
}

export function WebhooksTable({
  webhookEndpoints,
  onAddButtonClick,
}: WebhooksTableProps) {
  const { table } = useDataTable({
    data: webhookEndpoints || [],
    columns,
    initialSorting: [{ id: "createdAt", desc: true }],
    getRowId: (row) => row.uuid,
  });

  if (!webhookEndpoints || webhookEndpoints.length === 0) {
    return (
      <Empty className="border rounded-lg mt-8">
        <EmptyHeader>
          <EmptyMedia>
            <GradientIcon color="var(--color-green-300)" size="lg">
              <Lock />
            </GradientIcon>
          </EmptyMedia>
          <EmptyTitle>No webhooks yet</EmptyTitle>
          <EmptyDescription>
            Configure a webhook to receive real-time event updates for bots or
            calendar changes.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="sm" className="font-medium" onClick={onAddButtonClick}>
            <Plus /> Add webhook
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return <DataTable table={table} tableContainerClassName="mt-6" />;
}
