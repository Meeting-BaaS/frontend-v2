"use client";

import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  type MeetingPlatform,
  meetingPlatformSchema,
} from "@/lib/schemas/bots";

const PLATFORMS = meetingPlatformSchema.options.map((platform) => ({
  value: platform,
  label: platform.charAt(0).toUpperCase() + platform.slice(1),
}));

interface PlatformFilterProps {
  meetingPlatform?: MeetingPlatform[] | null;
}

export function PlatformFilter({ meetingPlatform }: PlatformFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse selected platforms from URL params (comma-separated)
  const selectedPlatforms = useMemo(() => {
    const platformsParam = meetingPlatform;
    if (!platformsParam) return [];

    return meetingPlatform;
  }, [meetingPlatform]);

  const handlePlatformToggle = (platform: MeetingPlatform) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    // Remove cursor when filtering to start from the beginning
    newSearchParams.delete("cursor");

    const isSelected = selectedPlatforms.includes(platform);
    let newPlatforms: MeetingPlatform[];

    if (isSelected) {
      newPlatforms = selectedPlatforms.filter((p) => p !== platform);
    } else {
      newPlatforms = [...selectedPlatforms, platform];
    }

    if (newPlatforms.length > 0) {
      newSearchParams.set("meetingPlatform", newPlatforms.join(","));
    } else {
      newSearchParams.delete("meetingPlatform");
    }

    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-48 justify-between">
          <span className="truncate">
            {selectedPlatforms.length === 0
              ? "Platform"
              : selectedPlatforms.length === 1
                ? selectedPlatforms[0].charAt(0).toUpperCase() +
                  selectedPlatforms[0].slice(1)
                : `${selectedPlatforms.length} platforms`}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Meeting Platform</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {PLATFORMS.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.value);
          return (
            <DropdownMenuCheckboxItem
              key={platform.value}
              checked={isSelected}
              onCheckedChange={() => handlePlatformToggle(platform.value)}
            >
              {platform.label}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
