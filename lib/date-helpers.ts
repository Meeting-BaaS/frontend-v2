import {
  format,
  formatDistanceToNow,
  intervalToDuration,
  isBefore,
  isThisISOWeek,
  parseISO,
} from "date-fns";

/**
 * Safely parses a date string using date-fns parseISO for consistent behavior
 * @param dateString - ISO timestamp string (e.g., "2025-10-23T13:05:45.961Z")
 * @returns Date object
 */
export function parseDateString(dateString: string): Date {
  return parseISO(dateString);
}

/**
 * Formats a date to show relative time (e.g., "2 hours ago", "3 days ago")
 * @param isoString - ISO timestamp string (e.g., "2025-10-23T13:05:45.961Z")
 * @returns Formatted relative date string
 */
export function formatRelativeDate(isoString: string): string {
  const date = parseISO(isoString);

  if (isThisISOWeek(date)) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  // Show locale date if it's not this week, otherwise show relative time
  return format(date, "MMM d, yyyy hh:mm a");
}

/**
 * Check if the first date string is before the second date string
 * @param dateString1 - The first ISO date string to compare
 * @param dateString2 - The second ISO date string to compare
 * @returns true if dateString1 is before dateString2, false otherwise
 */
export function isDateBefore(
  dateString1: string,
  dateString2: string,
): boolean {
  const date1 = new Date(dateString1);
  const date2 = new Date(dateString2);
  return isBefore(date1, date2);
}

/**
 * Formats a duration in seconds to a string (e.g., "1h 2m 3s")
 * @param seconds - Number of seconds
 * @returns Formatted duration string (e.g., "1h 2m 3s")
 */
export const formatDuration = (seconds: number) => {
  const duration = intervalToDuration({
    start: 0,
    end: Math.floor(seconds) * 1000,
  });

  const { hours = 0, minutes = 0, seconds: secs = 0 } = duration;

  // Format as "1h 2m 3s" or just the largest unit if others are 0
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
};
