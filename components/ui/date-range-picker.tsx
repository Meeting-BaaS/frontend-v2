"use client";

import { ChevronDown } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  dateRange: DateRange;
  setDateRange: (dateRange: DateRange) => void;
}

export function DateRangePicker({
  dateRange,
  setDateRange,
}: DateRangePickerProps) {
  return (
    <div className="flex flex-col gap-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {dateRange?.from && dateRange?.to
              ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
              : "Select date range"}
            <ChevronDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0 border-none"
          align="start"
        >
          <Calendar
            mode="range"
            required
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            className="rounded-lg border shadow-sm"
          />
          {/* {[
            { label: "Today", from: new Date(), to: new Date() },
            {
              label: "Yesterday",
              from: addDays(new Date(), -1),
              to: addDays(new Date(), -1),
            },
            {
              label: "Last 7 days",
              from: addDays(new Date(), -7),
              to: new Date(),
            },
            {
              label: "Last 30 days",
              from: addDays(new Date(), -30),
              to: new Date(),
            },
          ].map((preset) => (
            <Button
              key={preset.from.toISOString()}
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                setDateRange({
                  from: preset.from,
                  to: preset.to,
                });
              }}
            >
              {preset.label}
            </Button>
          ))} */}
        </PopoverContent>
      </Popover>
    </div>
  );
}
