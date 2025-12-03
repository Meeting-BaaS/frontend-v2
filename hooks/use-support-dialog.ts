"use client";

import { useContext } from "react";
import { SupportDialogContext } from "@/contexts/support-dialog-context";

export function useSupportDialog() {
  const context = useContext(SupportDialogContext);

  if (!context) {
    throw new Error(
      "useSupportDialog must be used within a SupportDialogProvider",
    );
  }

  return context;
}
