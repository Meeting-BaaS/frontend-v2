"use client";

import { endOfDay, startOfDay, subDays } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";

interface DateRangeFilterProps {
  createdBefore?: string | null;
  createdAfter?: string | null;
}

export function DateRangeFilter({
  createdBefore,
  createdAfter,
}: DateRangeFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // When no date filter in URL, show last 14 days in local state (UX only)
  // When date filter exists in URL, use that for local state
  const hasDateFilter = createdAfter || createdBefore;
  const initialDateRange: DateRange | undefined = hasDateFilter
    ? {
        from: createdAfter ? new Date(createdAfter) : undefined,
        to: createdBefore ? new Date(createdBefore) : undefined,
      }
    : {
        from: startOfDay(subDays(new Date(), 14)), // Last 15 days (today + 14 days ago)
        to: endOfDay(new Date()),
      };

  // Local state for immediate UI updates (optimistic UI)
  const [localDateRange, setLocalDateRange] = useState<DateRange | undefined>(
    initialDateRange,
  );

  // Helper function to update URL params
  const updateURL = (dateRange: DateRange | undefined) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    // Remove cursor when filtering to start from the beginning
    newSearchParams.delete("cursor");

    if (dateRange?.from) {
      newSearchParams.set(
        "createdAfter",
        startOfDay(dateRange.from).toISOString(),
      );
    } else {
      newSearchParams.delete("createdAfter");
    }

    if (dateRange?.to) {
      newSearchParams.set(
        "createdBefore",
        endOfDay(dateRange.to).toISOString(),
      );
    } else {
      newSearchParams.delete("createdBefore");
    }

    router.replace(`${pathname}?${newSearchParams.toString()}`);
  };

  // Wrapper function that updates both local state and URL
  const handleDateRangeChange = (dateRange: DateRange | undefined) => {
    setLocalDateRange(dateRange);
    updateURL(dateRange);
  };

  return (
    <DateRangePicker
      dateRange={localDateRange ?? { from: undefined, to: undefined }}
      setDateRange={handleDateRangeChange}
      buttonClassName="col-span-1"
      disabled={{
        before: subDays(new Date(), 90),
        after: new Date(),
      }}
    />
  );
}
