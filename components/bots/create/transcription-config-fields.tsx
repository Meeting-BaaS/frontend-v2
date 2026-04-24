"use client"

import { PROVIDERS } from "@meeting-baas/voice-router/providers"
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

interface TranscriptionConfigFieldsProps<T extends FieldValues> {
  control: Control<T>
  providerName: FieldPath<T>
  apiKeyName: FieldPath<T>
  regionName: FieldPath<T>
  customParamsName: FieldPath<T>
  mode?: "transcription" | "streaming"
  disabled?: boolean
}

export function TranscriptionConfigFields<T extends FieldValues>({
  control,
  providerName,
  apiKeyName,
  regionName,
  customParamsName,
  mode = "transcription",
  disabled,
}: TranscriptionConfigFieldsProps<T>) {
  const provider = useWatch({ control, name: providerName }) as string
  const { setValue } = useFormContext<T>()

  // Reset custom_params when provider changes
  useEffect(() => {
    setValue(customParamsName, {} as PathValue<T, FieldPath<T>>)
  }, [provider, setValue, customParamsName])

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
      <ByokFields
        control={control}
        apiKeyName={apiKeyName}
        regionName={regionName}
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
