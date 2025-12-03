"use client";

import type { Table } from "@tanstack/react-table";
import { Circle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { statusEnum, statusLabels } from "@/lib/schemas/support";
import { cn } from "@/lib/utils";
import { statusColors } from "./columns";

interface StatusFilterProps<TData> {
  table: Table<TData>;
}

export function StatusFilter<TData>({ table }: StatusFilterProps<TData>) {
  const value =
    (table.getColumn("status")?.getFilterValue() as string) || "All";

  const handleValueChange = (newValue: string) => {
    if (newValue === "All") {
      // Clear the filter
      table.getColumn("status")?.setFilterValue(undefined);
    } else {
      // Set the filter
      table.getColumn("status")?.setFilterValue(newValue);
    }
  };

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className="w-full min-w-48 [&_svg[class*='fill-']]:hidden">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All">
          <div className="flex items-center gap-2">
            <Circle className="size-1.5 fill-muted-foreground" />
            All statuses
          </div>
        </SelectItem>
        <SelectSeparator />
        {statusEnum.options.map((status) => (
          <SelectItem key={status} value={status}>
            <div className="flex items-center gap-2">
              <Circle
                className={cn(statusColors[status], "!bg-transparent size-1.5")}
              />
              {statusLabels[status]}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
