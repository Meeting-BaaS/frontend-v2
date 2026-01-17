"use client";

import { ChevronDown, Circle } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { botColorVariants } from "@/components/bots/columns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type BotStatus, botStatusSchema } from "@/lib/schemas/bots";
import { cn } from "@/lib/utils";

// Format status labels for display
const formatStatusLabel = (status: string) => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const STATUSES = botStatusSchema.options.map((status) => ({
  value: status,
  label: formatStatusLabel(status),
}));

const ALL_STATUSES = botStatusSchema.options;

interface StatusFilterProps {
  status?: BotStatus[] | null;
}

export function StatusFilter({ status }: StatusFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // When no status filter in URL, show all selected in local state (UX only)
  // When status filter exists in URL, use that for local state
  const hasStatusFilter = status && status.length > 0;
  const initialStatuses = hasStatusFilter ? status : ALL_STATUSES; // Show all selected when no filter

  // Local state for immediate UI updates (optimistic UI)
  const [localStatuses, setLocalStatuses] =
    useState<BotStatus[]>(initialStatuses);

  // Helper function to update URL params
  const updateURL = (newStatuses: BotStatus[]) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    // Remove cursor when filtering to start from the beginning
    newSearchParams.delete("cursor");

    // Always set the filter param if there are selections (even if all are selected)
    // Only remove when empty
    if (newStatuses.length > 0) {
      newSearchParams.set("status", newStatuses.join(","));
    } else {
      newSearchParams.delete("status");
    }

    router.replace(`${pathname}?${newSearchParams.toString()}`);
  };

  const handleStatusToggle = (status: BotStatus) => {
    // Calculate new state
    const isSelected = localStatuses.includes(status);
    const newState = isSelected
      ? localStatuses.filter((s) => s !== status)
      : [...localStatuses, status];

    setLocalStatuses(newState);
    updateURL(newState);
  };

  const handleSelectAll = () => {
    const allSelected = localStatuses.length === ALL_STATUSES.length;

    if (allSelected) {
      // Deselect all - removes filter from URL
      const newState: BotStatus[] = [];
      setLocalStatuses(newState);
      updateURL(newState);
    } else {
      // Select all - keeps filter param in URL with all statuses
      setLocalStatuses(ALL_STATUSES);
      updateURL(ALL_STATUSES);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="col-span-1 justify-between">
          <span className="truncate">
            {localStatuses.length === 0 ||
            ALL_STATUSES.length === localStatuses.length
              ? "All Statuses"
              : `${localStatuses.length} status${localStatuses.length === 1 ? "" : "es"}`}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-[300px] overflow-y-auto">
        <DropdownMenuCheckboxItem
          onSelect={(e: Event) => e.preventDefault()}
          checked={localStatuses.length === ALL_STATUSES.length}
          onCheckedChange={handleSelectAll}
        >
          <Circle className="size-1.5 mr-1 text-muted-foreground fill-muted-foreground" />
          All Statuses
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        {STATUSES.map((status) => {
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
                    botColorVariants({ status: status.value }),
                    "!bg-transparent size-1.5 mr-1",
                  )}
                />
                {status.label}
              </div>
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
