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
  nextCursor: string | null
}

export function AlertHistoryTable({ ruleUuid, history, nextCursor }: AlertHistoryTableProps) {
  const searchParams = useSearchParams()
  const cursor = searchParams.get("cursor") ?? null

  const { table } = useDataTable({
    data: history || [],
    columns: alertHistoryColumns,
    getRowId: (row) => row.uuid,
    manualPagination: true
  })

  const prevCursorLink = useMemo(() => {
    if (cursor) {
      // If we have a cursor, going "back" means going to the base URL (first page)
      return `/alerts/${ruleUuid}`
    }
    return null
  }, [cursor, ruleUuid])

  const nextCursorLink = useMemo(() => {
    if (nextCursor) {
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.set("cursor", nextCursor)
      return `/alerts/${ruleUuid}?${newSearchParams.toString()}`
    }
    return null
  }, [nextCursor, ruleUuid, searchParams])

  if (!history || history.length === 0) {
    return (
      <Empty className="border rounded-lg">
        <EmptyHeader>
          <EmptyMedia>
            <GradientIcon color="var(--color-yellow-300)" size="lg">
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
