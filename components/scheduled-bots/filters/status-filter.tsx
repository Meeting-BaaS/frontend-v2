"use client";

import { ChevronDown, Circle } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { scheduledStatusVariants } from "@/components/scheduled-bots/columns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatScheduledBotStatus } from "@/lib/formatters/scheduled-bots";
import type { ScheduledBotStatus } from "@/lib/schemas/scheduled-bots";
import { scheduledBotStatusSchema } from "@/lib/schemas/scheduled-bots";
import { cn } from "@/lib/utils";

const STATUSES = scheduledBotStatusSchema.options.map((status) => ({
  value: status,
  label: formatScheduledBotStatus(status),
}));

interface ScheduledBotsStatusFilterProps {
  status?: ScheduledBotStatus[] | null;
}

export function ScheduledBotsStatusFilter({
  status,
}: ScheduledBotsStatusFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const hasStatusFilter = status && status.length > 0;
  const initialStatuses = hasStatusFilter
    ? status
    : scheduledBotStatusSchema.options;

  const [localStatuses, setLocalStatuses] =
    useState<ScheduledBotStatus[]>(initialStatuses);

  const updateURL = (newStatuses: ScheduledBotStatus[]) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete("cursor");

    if (newStatuses.length > 0) {
      newSearchParams.set("status", newStatuses.join(","));
    } else {
      newSearchParams.delete("status");
    }

    router.replace(`${pathname}?${newSearchParams.toString()}`);
  };

  const handleStatusToggle = (selectedStatus: ScheduledBotStatus) => {
    const isSelected = localStatuses.includes(selectedStatus);
    const newState = isSelected
      ? localStatuses.filter((s) => s !== selectedStatus)
      : [...localStatuses, selectedStatus];

    setLocalStatuses(newState);
    updateURL(newState);
  };

  const handleSelectAll = () => {
    const allSelected =
      localStatuses.length === scheduledBotStatusSchema.options.length;

    if (allSelected) {
      const newState: ScheduledBotStatus[] = [];
      setLocalStatuses(newState);
      updateURL(newState);
    } else {
      const allStatuses = scheduledBotStatusSchema.options;
      setLocalStatuses(allStatuses);
      updateURL(allStatuses);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="col-span-1 justify-between">
          <span className="truncate">
            {localStatuses.length === 0 ||
            scheduledBotStatusSchema.options.length === localStatuses.length
              ? "All Statuses"
              : `${localStatuses.length} status${localStatuses.length === 1 ? "" : "es"}`}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuCheckboxItem
          onSelect={(event: Event) => event.preventDefault()}
          checked={
            localStatuses.length === scheduledBotStatusSchema.options.length
          }
          onCheckedChange={handleSelectAll}
        >
          <Circle className="size-1.5 mr-1 text-muted-foreground fill-muted-foreground" />
          All Statuses
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        {STATUSES.map((statusOption) => {
          const isSelected = localStatuses.includes(statusOption.value);
          return (
            <DropdownMenuCheckboxItem
              key={statusOption.value}
              onSelect={(event: Event) => event.preventDefault()}
              checked={isSelected}
              onCheckedChange={() => handleStatusToggle(statusOption.value)}
            >
              <div className="flex items-center gap-2">
                <Circle
                  className={cn(
                    scheduledStatusVariants({ status: statusOption.value }),
                    "!bg-transparent size-1.5 mr-1",
                  )}
                />
                {statusOption.label}
              </div>
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
