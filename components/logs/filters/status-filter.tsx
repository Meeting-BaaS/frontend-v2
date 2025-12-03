"use client";

import { ChevronDown, Circle } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { getStatusVariant } from "@/components/logs/columns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HTTP_STATUSES } from "@/lib/http-codes";
import { cn } from "@/lib/utils";

const ALL_STATUS_VALUES = HTTP_STATUSES.map((s) => s.value);

interface StatusFilterProps {
  responseStatus?: number[] | null;
}

export function StatusFilter({ responseStatus }: StatusFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // When no status filter in URL, show all selected in local state (UX only)
  // When status filter exists in URL, use that for local state
  const hasStatusFilter = responseStatus && responseStatus.length > 0;
  const initialStatuses = hasStatusFilter ? responseStatus : ALL_STATUS_VALUES;

  // Local state for immediate UI updates (optimistic UI)
  const [localStatuses, setLocalStatuses] = useState<number[]>(initialStatuses);

  // Helper function to update URL params
  const updateURL = (newStatuses: number[]) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    // Remove cursor when filtering to start from the beginning
    newSearchParams.delete("cursor");

    // Always set the filter param if there are selections (even if all are selected)
    // Only remove when empty
    if (newStatuses.length > 0) {
      newSearchParams.set("responseStatus", newStatuses.join(","));
    } else {
      newSearchParams.delete("responseStatus");
    }

    router.replace(`${pathname}?${newSearchParams.toString()}`);
  };

  const handleStatusToggle = (status: number) => {
    // Calculate new state
    const isSelected = localStatuses.includes(status);
    const newState = isSelected
      ? localStatuses.filter((s) => s !== status)
      : [...localStatuses, status];

    setLocalStatuses(newState);
    updateURL(newState);
  };

  const handleSelectAll = () => {
    const allSelected = localStatuses.length === ALL_STATUS_VALUES.length;

    if (allSelected) {
      // Deselect all - removes filter from URL
      const newState: number[] = [];
      setLocalStatuses(newState);
      updateURL(newState);
    } else {
      // Select all - keeps filter param in URL with all statuses
      setLocalStatuses(ALL_STATUS_VALUES);
      updateURL(ALL_STATUS_VALUES);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="col-span-1 justify-between">
          <span className="truncate">
            {localStatuses.length === 0 ||
            ALL_STATUS_VALUES.length === localStatuses.length
              ? "All Statuses"
              : `${localStatuses.length} status${localStatuses.length === 1 ? "" : "es"}`}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-[300px] overflow-y-auto">
        <DropdownMenuCheckboxItem
          onSelect={(e: Event) => e.preventDefault()}
          checked={localStatuses.length === ALL_STATUS_VALUES.length}
          onCheckedChange={handleSelectAll}
        >
          <Circle className="size-1.5 mr-1 text-muted-foreground fill-muted-foreground" />
          All Statuses
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        {HTTP_STATUSES.map((status) => {
          const isSelected = localStatuses.includes(status.value);
          return (
            <DropdownMenuCheckboxItem
              // Stops the dropdown from closing when the item is clicked
              onSelect={(e: Event) => e.preventDefault()}
              key={status.value}
              checked={isSelected}
              onCheckedChange={() => handleStatusToggle(status.value)}
            >
              <div className="flex items-center gap-2">
                <Circle
                  className={cn(
                    getStatusVariant(status.value).className,
                    "!bg-transparent size-1.5 mr-1",
                  )}
                />
                <span>{status.label}</span>
              </div>
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
