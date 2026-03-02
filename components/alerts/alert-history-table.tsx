"use client"

import { Bell } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useMemo } from "react"
import { alertHistoryColumns } from "@/components/alerts/alert-history-columns"
import { DataTable } from "@/components/ui/data-table"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty"
import { GradientIcon } from "@/components/ui/gradient-icon"
import { useDataTable } from "@/hooks/use-data-table"
import type { AlertHistoryEntry } from "@/lib/schemas/alerts"

interface AlertHistoryTableProps {
  ruleUuid: string
  history: AlertHistoryEntry[]
  cursor: string | null
  prevCursor: string | null
}

export function AlertHistoryTable({ ruleUuid, history, cursor, prevCursor }: AlertHistoryTableProps) {
  const searchParams = useSearchParams()
  const currentCursor = searchParams.get("cursor") ?? null

  const { table } = useDataTable({
    data: history || [],
    columns: alertHistoryColumns,
    getRowId: (row) => row.uuid,
    manualPagination: true
  })

  const prevCursorLink = useMemo(() => {
    if (!currentCursor || !prevCursor) return null
    return `/alerts/${ruleUuid}?cursor=${encodeURIComponent(prevCursor)}`
  }, [currentCursor, prevCursor, ruleUuid])

  const nextCursorLink = useMemo(() => {
    if (!cursor) return null
    return `/alerts/${ruleUuid}?cursor=${encodeURIComponent(cursor)}`
  }, [cursor, ruleUuid])

  if (!history || history.length === 0) {
    return (
      <Empty className="border rounded-lg">
        <EmptyHeader>
          <EmptyMedia>
            <GradientIcon color="var(--color-rose-300)" size="lg">
              <Bell />
            </GradientIcon>
          </EmptyMedia>
          <EmptyTitle>No alerts triggered yet</EmptyTitle>
          <EmptyDescription>
            When this alert rule fires, the history will appear here.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <DataTable
      table={table}
      serverSidePagination
      prevIteratorLink={prevCursorLink}
      nextIteratorLink={nextCursorLink}
      tableContainerClassName="mt-2"
    />
  )
}
