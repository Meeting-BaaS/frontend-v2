"use client"

import { PROVIDERS, BATCH_PROVIDER_REGIONS, STREAMING_PROVIDER_REGIONS } from "@meeting-baas/voice-router/providers"
import {
  PROVIDER_FIELDS,
  type FieldMetadata,
} from "@meeting-baas/voice-router/field-metadata"
import { useEffect } from "react"
import type { Control, FieldPath, FieldValues, PathValue } from "react-hook-form"
import { useFormContext, useWatch } from "react-hook-form"
import { ByokFields } from "@/components/bots/create/byok-fields"
import { DynamicFieldForm } from "@/components/bots/create/dynamic-field-form"
import { ProviderSelect } from "@/components/bots/create/provider-select"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const SUPPORTED_PROVIDERS: readonly string[] = PROVIDERS.filter(
  (p) => p in PROVIDER_FIELDS
)

function getProviderFields(
  provider: string,
  mode: "transcription" | "streaming",
): FieldMetadata[] {
  if (!(provider in PROVIDER_FIELDS)) return []
  const entry = PROVIDER_FIELDS[provider as keyof typeof PROVIDER_FIELDS]
  if (mode === "streaming" && "streaming" in entry) {
    return entry.streaming as unknown as FieldMetadata[]
  }
  return entry.transcription as unknown as FieldMetadata[]
}

function getRegionsForProvider(
  provider: string,
  mode: "transcription" | "streaming",
): readonly string[] | null {
  const map = mode === "streaming" ? STREAMING_PROVIDER_REGIONS : BATCH_PROVIDER_REGIONS
  return (map as Record<string, readonly string[]>)[provider] ?? null
}

interface TranscriptionConfigFieldsProps<T extends FieldValues> {
  control: Control<T>
  providerName: FieldPath<T>
  regionName?: FieldPath<T>
  apiKeyName: FieldPath<T>
  customParamsName: FieldPath<T>
  mode?: "transcription" | "streaming"
  disabled?: boolean
}

export function TranscriptionConfigFields<T extends FieldValues>({
  control,
  providerName,
  regionName,
  apiKeyName,
  customParamsName,
  mode = "transcription",
  disabled,
}: TranscriptionConfigFieldsProps<T>) {
  const provider = useWatch({ control, name: providerName }) as string
  const { setValue } = useFormContext<T>()

  const regions = getRegionsForProvider(provider, mode)

  // Reset custom_params and region when provider changes
  useEffect(() => {
    setValue(customParamsName, {} as PathValue<T, FieldPath<T>>)
    if (regionName) {
      setValue(regionName, "" as PathValue<T, FieldPath<T>>)
    }
  }, [provider, setValue, customParamsName, regionName])

  return (
    <>
      <FormField
        control={control}
        name={providerName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Provider</FormLabel>
            <FormControl>
              <ProviderSelect
                value={field.value as string}
                onChange={field.onChange}
                mode={mode === "streaming" ? "streaming" : "batch"}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {regionName && regions && regions.length > 0 && (
        <FormField
          control={control}
          name={regionName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Region</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value as string}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a region" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {regions.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      <ByokFields
        control={control}
        apiKeyName={apiKeyName}
      />
      {SUPPORTED_PROVIDERS.includes(provider) && (
        <FormField
          control={control}
          name={customParamsName}
          render={({ field }) => (
            <DynamicFieldForm
              fields={getProviderFields(provider, mode)}
              values={field.value as Record<string, unknown>}
              onChange={field.onChange}
            />
          )}
        />
      )}
    </>
  )
}
