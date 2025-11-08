"use client";

import SharedErrorBoundary from "@/components/error";
import type { APIError } from "@/lib/api-client";

interface ErrorProps {
  error: APIError & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  return <SharedErrorBoundary error={error} reset={reset} />;
}
