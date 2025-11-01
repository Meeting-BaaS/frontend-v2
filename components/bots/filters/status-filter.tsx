"use client";

import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type BotStatus, botStatusSchema } from "@/lib/schemas/bots";

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

interface StatusFilterProps {
  status?: BotStatus[] | null;
}

export function StatusFilter({ status }: StatusFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse selected statuses from URL params (comma-separated)
  const selectedStatuses = useMemo(() => {
    const statusParam = status;
    if (!statusParam) return [];

    return status;
  }, [status]);

  const handleStatusToggle = (status: BotStatus) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    // Remove cursor when filtering to start from the beginning
    newSearchParams.delete("cursor");

    const isSelected = selectedStatuses.includes(status);
    let newStatuses: BotStatus[];

    if (isSelected) {
      newStatuses = selectedStatuses.filter((s) => s !== status);
    } else {
      newStatuses = [...selectedStatuses, status];
    }

    if (newStatuses.length > 0) {
      newSearchParams.set("status", newStatuses.join(","));
    } else {
      newSearchParams.delete("status");
    }

    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-48 justify-between">
          <span className="truncate">
            {selectedStatuses.length === 0
              ? "Status"
              : selectedStatuses.length === 1
                ? formatStatusLabel(selectedStatuses[0])
                : `${selectedStatuses.length} statuses`}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-[300px] overflow-y-auto">
        <DropdownMenuLabel>Bot Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {STATUSES.map((status) => {
          const isSelected = selectedStatuses.includes(status.value);
          return (
            <DropdownMenuCheckboxItem
              key={status.value}
              checked={isSelected}
              onCheckedChange={() => handleStatusToggle(status.value)}
            >
              {status.label}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
