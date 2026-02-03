"use client";

import { SendBotForm } from "@/components/bots/send-bot-form";
import { cn } from "@/lib/utils";

interface SendBotStepProps {
  step: number;
  isActive: boolean;
  isEnabled: boolean;
  apiKey: string | null;
}

export function SendBotStep({
  step,
  isActive,
  isEnabled,
  apiKey,
}: SendBotStepProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-6 border-l-2 pb-8 pl-6 transition-colors",
        isActive ? "border-primary" : "border-border",
        isEnabled
          ? "opacity-100 pointer-events-auto"
          : "opacity-30 pointer-events-none",
      )}
    >
      <div className="flex-shrink-0">
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
      </div>
      <div className="flex-1 space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Send a Bot</h3>
          <p className="text-sm text-muted-foreground">
            Enter your meeting URL and send a bot to join it.
          </p>
        </div>
        {isEnabled && apiKey ? (
          <SendBotForm apiKey={apiKey} />
        ) : (
          <p className="text-sm text-muted-foreground">
            Complete the previous steps to continue.
          </p>
        )}
      </div>
    </div>
  );
}
