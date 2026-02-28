"use client"

import { Plus } from "lucide-react"
import { useState } from "react"
import { CreateAlertDialog } from "@/components/alerts/create"
import { AlertsTable } from "@/components/alerts/table"
import { PageHeading } from "@/components/layout/page-heading"
import { Button } from "@/components/ui/button"
import type { ListAlertRulesResponse } from "@/lib/schemas/alerts"

interface AlertsViewProps {
  rules: ListAlertRulesResponse
}

export function AlertsView({ rules }: AlertsViewProps) {
  const [open, setOpen] = useState(false)

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
            <Plus /> Add Rule
          </Button>
        </div>
      </div>
      <AlertsTable rules={rules.data || []} onAddButtonClick={() => setOpen(true)} />
      <CreateAlertDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
