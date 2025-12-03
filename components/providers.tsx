"use client";

import { ProgressProvider } from "@bprogress/next/app";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
    >
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
    </ThemeProvider>
  );
}
