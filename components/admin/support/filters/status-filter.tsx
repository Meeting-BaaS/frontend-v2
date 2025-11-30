"use client";

import { Circle } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { statusColors } from "@/components/support/columns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Status } from "@/lib/schemas/support";
import { statusEnum, statusLabels } from "@/lib/schemas/support";
import { cn } from "@/lib/utils";

interface AdminStatusFilterProps {
  status?: Status[] | null;
}

export function AdminStatusFilter({ status }: AdminStatusFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get current status from URL or params
  const currentStatus =
    searchParams.get("status") ||
    (status && status.length > 0 ? status.join(",") : null);
  const value = currentStatus || "All";

  const handleValueChange = (newValue: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    // Remove cursor when filtering to start from the beginning
    newSearchParams.delete("cursor");

    if (newValue === "All") {
      // Clear the filter
      newSearchParams.delete("status");
    } else {
      // Set the filter - the backend will parse comma-separated values
      newSearchParams.set("status", newValue);
    }

    router.replace(`${pathname}?${newSearchParams.toString()}`);
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
        {statusEnum.options.map((statusOption) => (
          <SelectItem key={statusOption} value={statusOption}>
            <div className="flex items-center gap-2">
              <Circle
                className={cn(
                  statusColors[statusOption],
                  "!bg-transparent size-1.5",
                )}
              />
              {statusLabels[statusOption]}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
