"use client";

import { addDays, endOfDay, startOfDay, subDays } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";

interface ScheduledBotsDateRangeFilterProps {
  scheduledBefore?: string | null;
  scheduledAfter?: string | null;
}

export function ScheduledBotsDateRangeFilter({
  scheduledBefore,
  scheduledAfter,
}: ScheduledBotsDateRangeFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const hasDateFilter = scheduledAfter || scheduledBefore;
  const initialDateRange: DateRange | undefined = hasDateFilter
    ? {
        from: scheduledAfter ? new Date(scheduledAfter) : undefined,
        to: scheduledBefore ? new Date(scheduledBefore) : undefined,
      }
    : {
        from: startOfDay(new Date()),
        to: endOfDay(addDays(new Date(), 14)),
      };

  const [localDateRange, setLocalDateRange] = useState<DateRange | undefined>(
    initialDateRange,
  );

  const updateURL = (dateRange: DateRange | undefined) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete("cursor");

    if (dateRange?.from) {
      newSearchParams.set(
        "scheduledAfter",
        startOfDay(dateRange.from).toISOString(),
      );
    } else {
      newSearchParams.delete("scheduledAfter");
    }

    if (dateRange?.to) {
      newSearchParams.set(
        "scheduledBefore",
        endOfDay(dateRange.to).toISOString(),
      );
    } else {
      newSearchParams.delete("scheduledBefore");
    }

    router.replace(`${pathname}?${newSearchParams.toString()}`);
  };

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
        after: addDays(new Date(), 90),
      }}
      futurePresets={true}
    />
  );
}
