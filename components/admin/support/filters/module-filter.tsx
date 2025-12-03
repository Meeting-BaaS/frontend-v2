"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Module } from "@/lib/schemas/support";
import { moduleEnum, moduleLabels } from "@/lib/schemas/support";

interface AdminModuleFilterProps {
  module?: Module[] | null;
}

export function AdminModuleFilter({ module }: AdminModuleFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get current module from URL or params
  const currentModule =
    searchParams.get("module") ||
    (module && module.length > 0 ? module.join(",") : null);
  const value = currentModule || "All";

  const handleValueChange = (newValue: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    // Remove cursor when filtering to start from the beginning
    newSearchParams.delete("cursor");

    if (newValue === "All") {
      // Clear the filter
      newSearchParams.delete("module");
    } else {
      // Set the filter - the backend will parse comma-separated values
      newSearchParams.set("module", newValue);
    }

    router.replace(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className="w-full min-w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All">All modules</SelectItem>
        {moduleEnum.options.map((moduleOption) => (
          <SelectItem key={moduleOption} value={moduleOption}>
            {moduleLabels[moduleOption]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
