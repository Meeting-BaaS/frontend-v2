"use client";

import { subDays } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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

  // Parse date range from URL params
  const dateRange = useMemo<DateRange>(() => {
    const from = createdAfter ? new Date(createdAfter) : new Date();
    const to = createdBefore
      ? new Date(createdBefore)
      : subDays(new Date(), 30);

    return { from, to };
  }, [createdAfter, createdBefore]);

  const [localDateRange, setLocalDateRange] = useState<DateRange | undefined>(
    dateRange,
  );

  // Sync local state when URL params change externally
  useEffect(() => {
    setLocalDateRange(dateRange);
  }, [dateRange]);

  const handleDateRangeChange = (newRange: DateRange | undefined) => {
    setLocalDateRange(newRange);

    const newSearchParams = new URLSearchParams(searchParams.toString());

    // Remove cursor when filtering to start from the beginning
    newSearchParams.delete("cursor");

    if (newRange?.from) {
      newSearchParams.set("createdAfter", newRange.from.toISOString());
    } else {
      newSearchParams.delete("createdAfter");
    }

    if (newRange?.to) {
      newSearchParams.set("createdBefore", newRange.to.toISOString());
    } else {
      newSearchParams.delete("createdBefore");
    }

    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <DateRangePicker
      dateRange={localDateRange ?? { from: undefined, to: undefined }}
      setDateRange={handleDateRangeChange}
    />
  );
}
