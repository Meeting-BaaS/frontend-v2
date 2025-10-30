import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
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
  prevIterator: string | null;
  nextIterator: string | null;
}

export function MessagesTable({
  webhookMessages,
  endpointId,
  prevIterator,
  nextIterator,
}: MessagesTableProps) {
  // const router = useRouter();
  const searchParams = useSearchParams();
  const iterator = searchParams.get("iterator") ?? null;
  const { table } = useDataTable({
    data: webhookMessages || [],
    columns: columns(endpointId),
    getRowId: (row) => row.id,
    manualPagination: true,
  });

  const prevIteratorLink = useMemo(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (iterator !== null && prevIterator) {
      newSearchParams.set("iterator", prevIterator);
      return `/webhooks/${endpointId}?${newSearchParams.toString()}`;
    }
    return null;
  }, [iterator, prevIterator, endpointId, searchParams]);

  const nextIteratorLink = useMemo(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (nextIterator) {
      newSearchParams.set("iterator", nextIterator);
      return `/webhooks/${endpointId}?${newSearchParams.toString()}`;
    }
    return null;
  }, [nextIterator, endpointId, searchParams]);

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

  return (
    <DataTable
      table={table}
      enableSearch={false}
      serverSidePagination
      rowCellClassName="py-1"
      prevIteratorLink={prevIteratorLink}
      nextIteratorLink={nextIteratorLink}
    />
  );
}
