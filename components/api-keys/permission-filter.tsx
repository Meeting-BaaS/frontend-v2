"use client";

import type { Table } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PermissionFilterProps<TData> {
  table: Table<TData>;
}

export function PermissionFilter<TData>({
  table,
}: PermissionFilterProps<TData>) {
  const value =
    (table.getColumn("permissions")?.getFilterValue() as string) || "All";

  const handleValueChange = (newValue: string) => {
    if (newValue === "All") {
      // Clear the filter
      table.getColumn("permissions")?.setFilterValue(undefined);
    } else {
      // Set the filter
      table.getColumn("permissions")?.setFilterValue(newValue);
    }
  };

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className="w-full md:w-1/3">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All">All permissions</SelectItem>
        <SelectItem value="Full access">Full access</SelectItem>
        <SelectItem value="Sending access">Sending access</SelectItem>
      </SelectContent>
    </Select>
  );
}
