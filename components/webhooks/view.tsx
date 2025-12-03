"use client";

import { Plus } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DocsButton } from "@/components/layout/docs-button";
import { PageHeading } from "@/components/layout/page-heading";
import { Button } from "@/components/ui/button";
import { CreateWebhookDialog } from "@/components/webhooks/create";
import { WebhooksTable } from "@/components/webhooks/table";
import type {
  ListWebhookEndpointsResponse,
  ListWebhookEventsResponse,
} from "@/lib/schemas/webhooks";

interface WebhooksViewProps {
  webhookEndpoints: ListWebhookEndpointsResponse;
  webhookEvents: ListWebhookEventsResponse;
  newKey?: boolean;
}

export function WebhooksView({
  webhookEndpoints,
  webhookEvents,
  newKey,
}: WebhooksViewProps) {
  const [open, setOpen] = useState(newKey ?? false);
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleCreateButtonClick = () => {
    setOpen(true);

    // Add new=true to searchParams when dialog opens
    if (searchParams.get("new") !== "true") {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("new", "true");
      const newUrl = `${pathname}?${newSearchParams.toString()}`;
      window.history.pushState(null, "", newUrl);
    }
  };

  return (
    <>
      <div className="flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <PageHeading title="Webhooks" containerClassName="md:flex-1" />
        <div className="flex w-full sm:w-auto flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            size="sm"
            className="w-full sm:w-auto font-medium"
            onClick={handleCreateButtonClick}
          >
            <Plus /> Add webhook
          </Button>
          <DocsButton name="Docs" keyBinding="D" uriSuffix="api-v2/webhooks" />
        </div>
      </div>
      <WebhooksTable
        webhookEndpoints={webhookEndpoints.data || []}
        onAddButtonClick={handleCreateButtonClick}
      />
      <CreateWebhookDialog
        open={open}
        onOpenChange={setOpen}
        allEventTypes={webhookEvents.data}
      />
    </>
  );
}
