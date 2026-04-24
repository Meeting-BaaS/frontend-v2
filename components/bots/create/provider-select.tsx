"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const PROVIDERS = [
  { value: "gladia", label: "Gladia" },
  { value: "deepgram", label: "Deepgram" },
  { value: "assemblyai", label: "AssemblyAI" },
  { value: "speechmatics", label: "Speechmatics" },
  { value: "soniox", label: "Soniox" },
  { value: "elevenlabs", label: "ElevenLabs" },
] as const

interface ProviderSelectProps {
  value: string
  onChange: (value: string) => void
}

export function ProviderSelect({ value, onChange }: ProviderSelectProps) {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger>
        <SelectValue placeholder="Select provider" />
      </SelectTrigger>
      <SelectContent>
        {PROVIDERS.map((p) => (
          <SelectItem key={p.value} value={p.value}>
            {p.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
