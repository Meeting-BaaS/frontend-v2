"use client";

import { endOfDay, format, isSameDay, startOfDay, subDays } from "date-fns";
import { Check, ChevronDown } from "lucide-react";
import { useMemo } from "react";
import type { DateRange, Matcher } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  dateRange: DateRange;
  setDateRange: (dateRange: DateRange) => void;
  buttonClassName?: string;
  disabled?: Matcher | Matcher[];
}

type Preset = {
  label: string;
  getRange: () => DateRange;
};

export function DateRangePicker({
  dateRange,
  setDateRange,
  buttonClassName,
  disabled,
}: DateRangePickerProps) {
  // Memoize presets to avoid unnecessary re-renders
  const presets = useMemo<Preset[]>(
    () => [
      {
        label: "Today",
        getRange: () => {
          const today = new Date();
          return {
            from: startOfDay(today),
            to: endOfDay(today),
          };
        },
      },
      {
        label: "Yesterday",
        getRange: () => {
          const yesterday = subDays(new Date(), 1);
          return {
            from: startOfDay(yesterday),
            to: endOfDay(yesterday),
          };
        },
      },
      {
        label: "Last 2 days",
        getRange: () => {
          const today = new Date();
          return {
            from: startOfDay(subDays(today, 1)),
            to: endOfDay(today),
          };
        },
      },
      {
        label: "Last 3 days",
        getRange: () => {
          const today = new Date();
          return {
            from: startOfDay(subDays(today, 2)),
            to: endOfDay(today),
          };
        },
      },
      {
        label: "Last 7 days",
        getRange: () => {
          const today = new Date();
          return {
            from: startOfDay(subDays(today, 6)),
            to: endOfDay(today),
          };
        },
      },
      {
        label: "Last 15 days",
        getRange: () => {
          const today = new Date();
          return {
            from: startOfDay(subDays(today, 14)),
            to: endOfDay(today),
          };
        },
      },
      {
        label: "Last 30 days",
        getRange: () => {
          const today = new Date();
          return {
            from: startOfDay(subDays(today, 29)),
            to: endOfDay(today),
          };
        },
      },
    ],
    [],
  );

  // Check if current dateRange matches any preset
  const matchedPreset = useMemo(() => {
    const from = dateRange?.from;
    const to = dateRange?.to;
    if (!from || !to) return null;

    return presets.find((preset) => {
      const presetRange = preset.getRange();
      const presetFrom = presetRange.from;
      const presetTo = presetRange.to;
      if (!presetFrom || !presetTo) return false;
      return isSameDay(from, presetFrom) && isSameDay(to, presetTo);
    });
  }, [dateRange, presets]);

  const buttonLabel = matchedPreset
    ? matchedPreset.label
    : dateRange?.from && dateRange?.to
      ? `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d")}`
      : "Select date range";

  return (
    <div className="flex flex-col gap-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className={cn(
              "min-w-48 justify-between font-normal",
              buttonClassName,
            )}
          >
            {buttonLabel}
            <ChevronDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto grid grid-cols-1 md:grid-cols-2 overflow-hidden p-0"
          align="start"
        >
          <div className="p-3 border-b space-y-1 hidden md:block md:col-span-1">
            {presets.map((preset) => {
              const presetRange = preset.getRange();
              const isSelected = matchedPreset?.label === preset.label;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setDateRange(presetRange)}
                  className={cn(
                    "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                    isSelected && "bg-accent text-accent-foreground",
                  )}
                >
                  <span className="flex-1 text-left">{preset.label}</span>
                  {isSelected && (
                    <span className="ml-auto flex size-3.5 items-center justify-center">
                      <Check className="size-4" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="md:col-span-1">
            <Calendar
              mode="range"
              required
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              disabled={disabled}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
