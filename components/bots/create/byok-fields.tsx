"use client"

import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import type { Control, FieldPath, FieldValues } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface ByokFieldsProps<T extends FieldValues> {
  control: Control<T>
  apiKeyName: FieldPath<T>
  regionName: FieldPath<T>
}

export function ByokFields<T extends FieldValues>({
  control,
  apiKeyName,
  regionName,
}: ByokFieldsProps<T>) {
  const [showKey, setShowKey] = useState(false)

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField
        control={control}
        name={apiKeyName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>API Key (BYOK)</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  {...field}
                  type={showKey ? "text" : "password"}
                  placeholder="Leave empty for platform key"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </FormControl>
            <FormDescription>
              Provide your own key to reduce token usage
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={regionName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Region</FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g. eu, us (optional)" />
            </FormControl>
            <FormDescription>
              Required for some providers (e.g. Speechmatics)
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  )
}
