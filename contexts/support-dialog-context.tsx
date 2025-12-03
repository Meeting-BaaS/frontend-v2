"use client";

import { createContext, useState } from "react";
import { SupportDialog } from "@/components/support/support-dialog";
import type { Module } from "@/lib/schemas/support";

interface SupportDialogState {
  open: boolean;
  botUuid: string | null;
  module: Module | null;
}

interface SupportDialogContextType {
  dialogState: SupportDialogState;
  openSupportDialog: (options?: { botUuid?: string; module?: Module }) => void;
  closeSupportDialog: () => void;
}

export const SupportDialogContext = createContext<
  SupportDialogContextType | undefined
>(undefined);

interface SupportDialogProviderProps {
  children: React.ReactNode;
}

/**
 * Context provider for support dialog
 * Manages dialog state with optional botUuid and module
 */
export function SupportDialogProvider({
  children,
}: SupportDialogProviderProps) {
  const [dialogState, setDialogState] = useState<SupportDialogState>({
    open: false,
    botUuid: null,
    module: null,
  });

  const openSupportDialog = (options?: {
    botUuid?: string;
    module?: Module;
  }) => {
    setDialogState({
      open: true,
      botUuid: options?.botUuid ?? null,
      module: options?.module ?? null,
    });
  };

  const closeSupportDialog = () => {
    setDialogState({
      open: false,
      botUuid: null,
      module: null,
    });
  };

  return (
    <SupportDialogContext.Provider
      value={{
        dialogState,
        openSupportDialog,
        closeSupportDialog,
      }}
    >
      {children}
      <SupportDialog />
    </SupportDialogContext.Provider>
  );
}
