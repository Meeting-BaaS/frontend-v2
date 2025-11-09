"use client";

import type { Table } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { moduleEnum, moduleLabels } from "@/lib/schemas/support";

interface ModuleFilterProps<TData> {
  table: Table<TData>;
}

export function ModuleFilter<TData>({ table }: ModuleFilterProps<TData>) {
  const value =
    (table.getColumn("module")?.getFilterValue() as string) || "All";

  const handleValueChange = (newValue: string) => {
    if (newValue === "All") {
      // Clear the filter
      table.getColumn("module")?.setFilterValue(undefined);
    } else {
      // Set the filter
      table.getColumn("module")?.setFilterValue(newValue);
    }
  };

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className="w-full min-w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All">All modules</SelectItem>
        {moduleEnum.options.map((module) => (
          <SelectItem key={module} value={module}>
            {moduleLabels[module]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
