"use client"

import { ChevronDown, Circle } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { botColorVariants, formatStatusLabel } from "@/components/bots/columns"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import type { BotStatus } from "@/lib/schemas/bots"
import { cn } from "@/lib/utils"

// Grouped status definitions — shared with admin filter
export const STATUS_GROUPS: { label: string; statuses: BotStatus[] }[] = [
  {
    label: "Active",
    statuses: [
      "queued",
      "joining_call",
      "in_waiting_room",
      "in_waiting_for_host",
      "in_call_not_recording",
      "in_call_recording",
      "recording_paused",
      "recording_resumed",
      "call_ended",
      "recording_succeeded",
      "transcribing"
    ]
  },
  {
    label: "Completed",
    statuses: ["completed"]
  },
  // Normal end codes (BOT_REMOVED, NO_ATTENDEES, NO_SPEAKER, RECORDING_TIMEOUT, API_REQUEST)
  // are not included here — they result in resolved_status="completed", not a failure error code.
  {
    label: "Errors",
    statuses: [
      "BOT_NOT_ACCEPTED",
      "CANNOT_JOIN_MEETING",
      "TIMEOUT_WAITING_TO_START",
      "INVALID_MEETING_URL",
      "LOGIN_REQUIRED",
      "STREAMING_SETUP_FAILED",
      "INTERNAL_ERROR",
      "BOT_REMOVED_TOO_EARLY",
      "TRANSCRIPTION_FAILED",
      "OOM_KILLED",
      "SIGTERM",
      "FORCE_KILLED",
      "GENERAL_ERROR",
      "UNKNOWN_ERROR"
    ]
  },
  {
    label: "Zoom Errors",
    statuses: [
      "WAITING_FOR_HOST_TIMEOUT",
      "RECORDING_RIGHTS_NOT_GRANTED",
      "CANNOT_REQUEST_RECORDING_RIGHT",
      "EXITING_MEETING_BEFORE_RECORD",
      "MEETING_ENDED_PREMATURELY",
      "RECORDING_START_TIMEOUT",
      "HOST_CLIENT_CANNOT_GRANT_PERMISSION",
      "WAITING_FOR_AUTHORIZED_USER_TIMEOUT",
      "UNABLE_JOIN_EXTERNAL_MEETING",
      "CANNOT_GET_JWT_TOKEN",
      "SDK_AUTH_FAILED",
      "ZOOM_ACCESS_TOKEN_ERROR",
      "ZOOM_OBF_TOKEN_ERROR",
      "SET_ZOOM_ID_AND_PWD_TOGETHER"
    ]
  },
  {
    label: "Business",
    statuses: ["INSUFFICIENT_TOKENS", "DAILY_BOT_CAP_REACHED", "BOT_ALREADY_EXISTS"]
  }
]

export const ALL_STATUSES = STATUS_GROUPS.flatMap((g) => g.statuses)

interface StatusFilterProps {
  status?: string[] | null
}

export function StatusFilter({ status }: StatusFilterProps) {
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
