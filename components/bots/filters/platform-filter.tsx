"use client";

import { ChevronDown, Circle } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ALL_PLATFORMS,
  getPlatformColor,
  PLATFORMS,
} from "@/lib/meeting-platform-helpers";
import type { MeetingPlatform } from "@/lib/schemas/bots";
import { cn } from "@/lib/utils";

interface PlatformFilterProps {
  meetingPlatform?: MeetingPlatform[] | null;
}

export function PlatformFilter({ meetingPlatform }: PlatformFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // When no platform filter in URL, show all selected in local state (UX only)
  // When platform filter exists in URL, use that for local state
  const hasPlatformFilter = meetingPlatform && meetingPlatform.length > 0;
  const initialPlatforms = hasPlatformFilter ? meetingPlatform : ALL_PLATFORMS; // Show all selected when no filter

  // Local state for immediate UI updates (optimistic UI)
  const [localMeetingPlatform, setLocalMeetingPlatform] =
    useState<MeetingPlatform[]>(initialPlatforms);

  // Helper function to update URL params
  const updateURL = (newPlatforms: MeetingPlatform[]) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    // Remove cursor when filtering to start from the beginning
    newSearchParams.delete("cursor");

    // Always set the filter param if there are selections (even if all are selected)
    // Only remove when empty
    if (newPlatforms.length > 0) {
      newSearchParams.set("meetingPlatform", newPlatforms.join(","));
    } else {
      newSearchParams.delete("meetingPlatform");
    }

    router.replace(`${pathname}?${newSearchParams.toString()}`);
  };

  const handlePlatformToggle = (platform: MeetingPlatform) => {
    // Calculate new state
    const isSelected = localMeetingPlatform.includes(platform);
    const newState = isSelected
      ? localMeetingPlatform.filter((p) => p !== platform)
      : [...localMeetingPlatform, platform];

    setLocalMeetingPlatform(newState);
    updateURL(newState);
  };

  const handleSelectAll = () => {
    const allSelected = localMeetingPlatform.length === ALL_PLATFORMS.length;

    if (allSelected) {
      // Deselect all - removes filter from URL
      const newState: MeetingPlatform[] = [];
      setLocalMeetingPlatform(newState);
      updateURL(newState);
    } else {
      // Select all - keeps filter param in URL with all platforms
      setLocalMeetingPlatform(ALL_PLATFORMS);
      updateURL(ALL_PLATFORMS);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="col-span-1 justify-between">
          <span className="truncate">
            {localMeetingPlatform.length === 0 ||
            ALL_PLATFORMS.length === localMeetingPlatform.length
              ? "All Platforms"
              : `${localMeetingPlatform.length} platform${localMeetingPlatform.length === 1 ? "" : "s"}`}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuCheckboxItem
          onSelect={(e: Event) => e.preventDefault()}
          checked={localMeetingPlatform.length === ALL_PLATFORMS.length}
          onCheckedChange={handleSelectAll}
        >
          <Circle className="size-1.5 mr-1 text-muted-foreground fill-muted-foreground" />
          All Platforms
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        {PLATFORMS.map((platform) => {
          const isSelected = localMeetingPlatform.includes(platform.value);
          return (
            <DropdownMenuCheckboxItem
              // Stops the dropdown from closing when the item is clicked
              onSelect={(e: Event) => e.preventDefault()}
              key={platform.value}
              checked={isSelected}
              onCheckedChange={() => handlePlatformToggle(platform.value)}
            >
              <Circle
                className={cn(
                  getPlatformColor(platform.value),
                  "size-1.5 mr-1",
                )}
              />
              {platform.label}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
