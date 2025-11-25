"use client";

import { format } from "date-fns";
import { Eye, Image, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { parseDateString } from "@/lib/date-helpers";
import { cn } from "@/lib/utils";

interface ScreenshotCardProps {
  title: string;
  date: string | null;
  onView: () => void;
  isLoading?: boolean;
  fileTitleClassName?: string;
}

export function ScreenshotCard({
  title,
  date,
  onView,
  isLoading = false,
  fileTitleClassName,
}: ScreenshotCardProps) {
  return (
    <Card className="flex flex-row items-center gap-4 p-4">
      <GradientIcon
        color="var(--color-pink-500)"
        className="flex-shrink-0"
        size="md"
      >
        <Image className="size-5" />
      </GradientIcon>
      <div className="flex-1 min-w-0">
        <div className={cn("font-medium truncate", fileTitleClassName)}>
          {title}
        </div>
        {date && (
          <div className="text-xs text-muted-foreground">
            {format(parseDateString(date), "MMM d, yyyy h:mm a")}
          </div>
        )}
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={onView}
        disabled={isLoading}
        aria-label={`View ${title}`}
      >
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Eye className="size-4" />
        )}
      </Button>
    </Card>
  );
}
