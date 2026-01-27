"use client"

import { createContext, type ReactNode } from "react"
import type { ConfigurationResponse } from "@/lib/schemas/configuration"

interface ConfigurationContextValue {
  configuration: ConfigurationResponse["data"] | null
}

export const ConfigurationContext = createContext<ConfigurationContextValue | undefined>(undefined)

interface ConfigurationProviderProps {
  children: ReactNode
  configuration: ConfigurationResponse["data"] | null
}

export function ConfigurationProvider({ children, configuration }: ConfigurationProviderProps) {
  return (
    <ConfigurationContext.Provider value={{ configuration }}>
      {children}
    </ConfigurationContext.Provider>
  )
}
