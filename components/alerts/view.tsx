"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { PageHeading } from "@/components/layout/page-heading";
import { Button } from "@/components/ui/button";
import { CreateAlertRuleDialog } from "@/components/alerts/create";
import { AlertRulesTable } from "@/components/alerts/table";
import type { ListAlertRulesResponse } from "@/lib/schemas/alerts";

interface AlertsViewProps {
  alertRules: ListAlertRulesResponse;
}

export function AlertsView({ alertRules }: AlertsViewProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <PageHeading title="Alerts" containerClassName="md:flex-1" />
        <div className="flex w-full sm:w-auto flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            size="sm"
            className="w-full sm:w-auto font-medium"
            onClick={() => setOpen(true)}
          >
            <Plus /> Add alert rule
          </Button>
        </div>
      </div>
      <AlertRulesTable
        alertRules={alertRules.data || []}
        onAddButtonClick={() => setOpen(true)}
      />
      <CreateAlertRuleDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
