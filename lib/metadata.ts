import type { Metadata } from "next";

const DEFAULT_DESCRIPTION = "Meeting BaaS Dashboard";

/**
 * Returns Next.js Metadata with a consistent title suffix and optional description.
 * Use in page.tsx: export const metadata = createPageMetadata({ title: "Bots", description: "Manage your meeting bots" });
 */
export function createPageMetadata({
  title,
  description,
}: {
  title: string;
  description?: string;
}): Metadata {
  return {
    title: `${title} | Meeting BaaS`,
    description: description ?? DEFAULT_DESCRIPTION,
  };
}
