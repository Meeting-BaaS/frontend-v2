import { formatDistanceToNow, parseISO } from "date-fns";

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

  // Always show relative time
  return formatDistanceToNow(date, { addSuffix: true });
}
