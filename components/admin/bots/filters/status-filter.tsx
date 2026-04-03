"use client"

import { ChevronDown, Circle } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { botColorVariants, formatStatusLabel } from "@/components/bots/columns"
import { ALL_STATUSES, STATUS_GROUPS } from "@/components/bots/filters/status-filter"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface AdminStatusFilterProps {
  status?: string[] | null
}

export function AdminStatusFilter({ status }: AdminStatusFilterProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const hasStatusFilter = status && status.length > 0
  const initialStatuses = hasStatusFilter ? status : ALL_STATUSES

  const [localStatuses, setLocalStatuses] = useState<string[]>(initialStatuses as string[])

  const updateURL = (newStatuses: string[]) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.delete("cursor")

    if (newStatuses.length > 0) {
      newSearchParams.set("status", newStatuses.join(","))
    } else {
      newSearchParams.delete("status")
    }

    router.replace(`${pathname}?${newSearchParams.toString()}`)
  }

  const handleStatusToggle = (status: string) => {
    const isSelected = localStatuses.includes(status)
    const newState = isSelected
      ? localStatuses.filter((s) => s !== status)
      : [...localStatuses, status]

    setLocalStatuses(newState)
    updateURL(newState)
  }

  const handleSelectAll = () => {
    const allSelected = localStatuses.length === ALL_STATUSES.length

    if (allSelected) {
      const newState: string[] = []
      setLocalStatuses(newState)
      updateURL(newState)
    } else {
      const all = [...ALL_STATUSES]
      setLocalStatuses(all)
      updateURL(all)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="col-span-1 justify-between">
          <span className="truncate">
            {localStatuses.length === 0 || ALL_STATUSES.length === localStatuses.length
              ? "All Statuses"
              : `${localStatuses.length} status${localStatuses.length === 1 ? "" : "es"}`}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 max-h-[400px] overflow-y-auto">
        <DropdownMenuCheckboxItem
          onSelect={(e: Event) => e.preventDefault()}
          checked={localStatuses.length === ALL_STATUSES.length}
          onCheckedChange={handleSelectAll}
        >
          <Circle className="size-1.5 mr-1 text-muted-foreground fill-muted-foreground" />
          All Statuses
        </DropdownMenuCheckboxItem>
        {STATUS_GROUPS.map((group) => (
          <div key={group.label}>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              {group.label}
            </DropdownMenuLabel>
            {group.statuses.map((statusValue) => {
              const isSelected = localStatuses.includes(statusValue)
              return (
                <DropdownMenuCheckboxItem
                  onSelect={(e: Event) => e.preventDefault()}
                  key={statusValue}
                  checked={isSelected}
                  onCheckedChange={() => handleStatusToggle(statusValue)}
                >
                  <div className="flex items-center gap-2">
                    <Circle
                      className={cn(
                        botColorVariants({ status: statusValue }),
                        "!bg-transparent size-1.5 mr-1"
                      )}
                    />
                    {formatStatusLabel(statusValue)}
                  </div>
                </DropdownMenuCheckboxItem>
              )
            })}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
