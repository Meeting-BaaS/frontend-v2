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
 * Safely parses a date string using date-fns parseISO for consistent behavior
 * @param dateString - ISO timestamp string (e.g., "2025-10-23T13:05:45.961Z")
 * @returns Formatted date string
 */
export function formatISODateString(
  dateString: string,
  formatString = "MMM d, yyyy",
): string {
  return format(parseDateString(dateString), formatString);
}

/**
 * Formats a date to show locale date (e.g., "Oct 23, 2025")
 * @param timestamp - UNIX timestamp (e.g., 1719158745)
 * @returns Formatted relative date string
 */
export function formatUNIXDate(
  timestamp: number,
  formatString = "MMM d, yyyy",
): string {
  const date = new Date(timestamp * 1000);

  // Show date
  return format(date, formatString);
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

/**
 * Formats a future date to show relative time (e.g., "in 2 days", "in 3 hours")
 * @param isoString - ISO timestamp string (e.g., "2025-10-23T13:05:45.961Z")
 * @returns Formatted relative date string (e.g., "in 2 days")
 */
export function formatFutureRelativeDate(isoString: string): string {
  const date = parseISO(isoString);
  const now = new Date();

  // If the date is in the past, return "expired"
  if (isBefore(date, now)) {
    return "expired";
  }

  // Use formatDistanceToNow with addSuffix for future dates
  // This will return "in X days", "in X hours", etc.
  const distance = formatDistanceToNow(date, { addSuffix: true });

  return distance;
}
