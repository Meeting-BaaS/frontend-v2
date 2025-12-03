"use client";

import { Plus } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CreateAPIKeyDialog } from "@/components/api-keys/create";
import { ApiKeysTable } from "@/components/api-keys/table";
import { DocsButton } from "@/components/layout/docs-button";
import { PageHeading } from "@/components/layout/page-heading";
import { Button } from "@/components/ui/button";
import type { ApiKey } from "@/lib/schemas/api-keys";

interface ApiKeysViewProps {
  apiKeys: ApiKey[];
  newKey?: boolean;
}

export function ApiKeysView({ apiKeys, newKey }: ApiKeysViewProps) {
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
        <PageHeading title="API Keys" containerClassName="md:flex-1" />
        <div className="flex w-full sm:w-auto flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            size="sm"
            className="w-full sm:w-auto font-medium"
            onClick={handleCreateButtonClick}
          >
            <Plus /> Create API key
          </Button>
          <DocsButton uriSuffix="api-v2/api-keys" />
        </div>
      </div>
      <ApiKeysTable
        apiKeys={apiKeys}
        onAddButtonClick={handleCreateButtonClick}
      />
      <CreateAPIKeyDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
