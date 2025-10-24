import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// API Key slug utility
// The slug is a combination of the timestamp and the id of the API key
// This is done to avoid exposing API key ID which is incremented sequentially
// Just a redundancy, as the endpoint is protected.
export function parseApiKeySlug(
  slug: string,
): { timestamp: number; id: number } | null {
  const parts = slug.split("A");
  if (parts.length !== 2) return null;

  const id = Number.parseInt(parts[0], 10);
  const timestamp = Number.parseInt(parts[1], 10);

  if (Number.isNaN(id) || Number.isNaN(timestamp)) return null;

  return { id, timestamp };
}
