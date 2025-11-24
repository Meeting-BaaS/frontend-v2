import type { ScheduledBotStatus } from "@/lib/schemas/scheduled-bots";

export function formatScheduledBotStatus(
  status: ScheduledBotStatus | string,
): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
