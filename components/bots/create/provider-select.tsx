"use client"

import { BATCH_PROVIDERS, STREAMING_PROVIDERS, PROVIDER_DISPLAY_NAMES } from "@meeting-baas/voice-router/providers"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ProviderSelectProps {
  value: string
  onChange: (value: string) => void
  mode?: "batch" | "streaming"
}

export function ProviderSelect({ value, onChange, mode = "batch" }: ProviderSelectProps) {
  const providers = mode === "streaming" ? STREAMING_PROVIDERS : BATCH_PROVIDERS

  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger>
        <SelectValue placeholder="Select provider" />
      </SelectTrigger>
      <SelectContent>
        {providers.map((p) => (
          <SelectItem key={p} value={p}>
            {PROVIDER_DISPLAY_NAMES[p]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
