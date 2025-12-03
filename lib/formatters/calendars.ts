import type {
  CalendarConnectionStatus,
  SubscriptionStatus,
} from "@/lib/schemas/calendars";

export function formatCalendarConnectionStatus(
  status: CalendarConnectionStatus | string,
): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatSubscriptionStatus(
  status: SubscriptionStatus | string,
): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

