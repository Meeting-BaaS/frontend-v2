import { DataTable } from "@/components/ui/data-table";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { columns } from "@/components/webhooks/messages/columns";
import { useDataTable } from "@/hooks/use-data-table";
import type { WebhookMessage } from "@/lib/schemas/webhooks";

interface MessagesTableProps {
  webhookMessages: WebhookMessage[];
  endpointId: string;
}

export function MessagesTable({
  webhookMessages,
  endpointId,
}: MessagesTableProps) {
  const { table } = useDataTable({
    data: webhookMessages || [],
    columns: columns(endpointId),
    initialSorting: [{ id: "createdAt", desc: true }],
    getRowId: (row) => row.id,
  });

  if (!webhookMessages || webhookMessages.length === 0) {
    return (
      <Empty className="border rounded-lg mt-8">
        <EmptyHeader>
          <EmptyTitle>No webhook events yet</EmptyTitle>
          <EmptyDescription>
            Once you start sending bots (or calendar changes), you will see the
            events here.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return <DataTable table={table} enableSearch={false} />;
}
