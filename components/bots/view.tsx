"use client";

import { BotsTable } from "@/components/bots/table";
import { DocsButton } from "@/components/layout/docs-button";
import { PageHeading } from "@/components/layout/page-heading";
import type { BotsListResponse } from "@/lib/schemas/bots";

interface BotsViewProps {
  botList: BotsListResponse;
}

export function BotsView({ botList }: BotsViewProps) {
  return (
    <>
      <div className="flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <PageHeading title="Bots" containerClassName="md:flex-1" />
        <div className="flex w-full sm:w-auto flex-col gap-2 sm:flex-row sm:items-center">
          <DocsButton />
        </div>
      </div>
      <BotsTable
        bots={botList.data}
        prevCursor={botList.prevCursor}
        nextCursor={botList.cursor}
      />
    </>
  );
}
