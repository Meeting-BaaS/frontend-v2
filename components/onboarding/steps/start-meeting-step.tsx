"use client";

import { CheckCircle2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { platformLinks } from "@/lib/platform-links";
import { cn } from "@/lib/utils";

interface StartMeetingStepProps {
  step: number;
  isActive: boolean;
  isCompleted: boolean;
  isEnabled: boolean;
  onComplete: () => void;
}

export function StartMeetingStep({
  step,
  isActive,
  isCompleted,
  isEnabled,
  onComplete,
}: StartMeetingStepProps) {
  const handlePlatformClick = () => {
    // Mark as completed when user clicks a platform link
    if (!isCompleted) {
      onComplete();
    }
  };

  return (
    <div
      className={cn(
        "flex items-start gap-6 border-l-2 pb-8 pl-6 transition-colors",
        isActive ? "border-primary" : "border-border",
        isCompleted && "border-green-500/50",
        isEnabled ? "opacity-100 pointer-events-auto" : "opacity-30 pointer-events-none",
      )}
    >
      <div className="flex-shrink-0">
        {isCompleted ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          </div>
        ) : (
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              isEnabled
                ? isActive
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
                : "bg-muted/50 text-muted-foreground/50",
            )}
          >
            <span className="text-sm font-semibold">{step}</span>
          </div>
        )}
      </div>
      <div className="flex-1 space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Start a Meeting</h3>
          <p className="text-sm text-muted-foreground">
            Start a meeting on your preferred platform. Once the meeting is
            running, you can send a bot to join it.
          </p>
        </div>
        {isEnabled ? (
          <div className="flex flex-wrap gap-3">
            {platformLinks.map((platform) => (
              <Button
                key={platform.name}
                variant="outline"
                asChild
                onClick={handlePlatformClick}
                className={platform.color}
                size="sm"
              >
                <Link
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <platform.icon className="mr-2 h-5 w-5" />
                  {platform.name}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Complete the previous step to continue.
          </p>
        )}
        {isCompleted && (
          <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
            You can now send a bot to join the meeting.
          </div>
        )}
      </div>
    </div>
  );
}
