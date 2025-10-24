"use client";

import { ProgressProvider } from "@bprogress/next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <ProgressProvider
          height="2px"
          color="var(--color-baas-primary-500)"
          options={{
            showSpinner: false,
          }}
          startOnLoad
          shallowRouting
        >
          {children}
          <Toaster />
        </ProgressProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
