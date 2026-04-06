"use client"

import type { FieldMetadata } from "@meeting-baas/voice-router/field-metadata"
import { ChevronDown, Search } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

// Fields handled by Meeting BaaS pipeline, not user-configurable
const EXCLUDED_FIELDS = new Set([
  "callback_url",
  "callback_config",
  "audio_url",
  "audio_data",
  "file",
  "webhook_url",
])

interface DynamicFieldFormProps {
  fields: readonly FieldMetadata[]
  values: Record<string, unknown>
  onChange: (values: Record<string, unknown>) => void
  className?: string
}

export function DynamicFieldForm({
  fields,
  values,
  onChange,
  className,
}: DynamicFieldFormProps) {
  const [open, setOpen] = useState(false)
  const visibleFields = fields.filter((f) => !EXCLUDED_FIELDS.has(f.name))

  if (visibleFields.length === 0) return null

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            open && "rotate-180",
          )}
        />
        Provider Options ({visibleFields.length})
      </button>
      {open && (
        <div className="mt-3 grid gap-4 border-l-2 border-muted pl-2 sm:pl-4">
          {visibleFields.map((field) => (
            <DynamicField
              key={field.name}
              field={field}
              value={values[field.name]}
              onChange={(val) => {
                const next = { ...values }
                if (val === undefined || val === "") {
                  delete next[field.name]
                } else {
                  next[field.name] = val
                }
                onChange(next)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface DynamicFieldProps {
  field: FieldMetadata
  value: unknown
  onChange: (value: unknown) => void
}

function DynamicField({ field, value, onChange }: DynamicFieldProps) {
  const id = `dynamic-${field.name}`
  const [searchQuery, setSearchQuery] = useState("")

  if (field.type === "select" && field.options) {
    const selected = value != null ? String(value) : ""
    const hasSearch = field.options.length > 6
    const filteredOptions = hasSearch && searchQuery
      ? field.options.filter((opt) => String(opt).toLowerCase().includes(searchQuery.toLowerCase()))
      : field.options
    return (
      <div className="space-y-1.5">
        <Label>
          {formatLabel(field.name)}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {hasSearch && (
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${formatLabel(field.name).toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9"
            />
            {searchQuery && (
              <span className="absolute right-2.5 top-2 text-xs text-muted-foreground">
                {filteredOptions.length} of {field.options.length}
              </span>
            )}
          </div>
        )}
        <div className="flex flex-wrap gap-1.5">
          {filteredOptions.map((opt) => {
            const optStr = String(opt)
            const isActive = optStr === selected
            return (
              <button key={optStr} type="button" onClick={() => onChange(isActive ? undefined : optStr)}>
                <Badge variant={isActive ? "primary" : "outline"} className="cursor-pointer">
                  {optStr}
                </Badge>
              </button>
            )
          })}
        </div>
        {field.description && (
          <FieldDescription text={field.description} />
        )}
      </div>
    )
  }

  if (field.type === "multiselect" && field.options) {
    const selected = Array.isArray(value) ? (value as string[]) : []
    const hasSearch = field.options.length > 6
    const filteredOptions = hasSearch && searchQuery
      ? field.options.filter((opt) => String(opt).toLowerCase().includes(searchQuery.toLowerCase()))
      : field.options
    return (
      <div className="space-y-1.5">
        <Label>
          {formatLabel(field.name)}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {hasSearch && (
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${formatLabel(field.name).toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9"
            />
            {searchQuery && (
              <span className="absolute right-2.5 top-2 text-xs text-muted-foreground">
                {filteredOptions.length} of {field.options.length}
              </span>
            )}
          </div>
        )}
        <div className="flex flex-wrap gap-1.5">
          {filteredOptions.map((opt) => {
            const optStr = String(opt)
            const isActive = selected.includes(optStr)
            return (
              <button
                key={optStr}
                type="button"
                onClick={() => {
                  const next = isActive
                    ? selected.filter((s) => s !== optStr)
                    : [...selected, optStr]
                  onChange(next.length > 0 ? next : undefined)
                }}
              >
                <Badge variant={isActive ? "primary" : "outline"} className="cursor-pointer">
                  {optStr}
                </Badge>
              </button>
            )
          })}
        </div>
        {field.description && (
          <FieldDescription text={field.description} />
        )}
      </div>
    )
  }

  if (field.type === "boolean") {
    return (
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <Label htmlFor={id}>{formatLabel(field.name)}</Label>
          {field.description && (
            <FieldDescription text={field.description} />
          )}
        </div>
        <Switch
          id={id}
          checked={value === true}
          onCheckedChange={(checked) => onChange(checked || undefined)}
        />
      </div>
    )
  }

  if (field.type === "number") {
    return (
      <div className="space-y-1.5">
        <Label htmlFor={id}>
          {formatLabel(field.name)}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        <Input
          id={id}
          type="number"
          value={value != null ? String(value) : ""}
          min={field.min}
          max={field.max}
          placeholder={field.default != null ? `Default: ${field.default}` : undefined}
          onChange={(e) => {
            const v = e.target.value
            onChange(v ? Number(v) : undefined)
          }}
        />
        {field.description && (
          <FieldDescription text={field.description} />
        )}
      </div>
    )
  }

  if (field.type === "object" && field.nestedFields) {
    return (
      <div className="space-y-1.5">
        <Label>{formatLabel(field.name)}</Label>
        {field.description && (
          <FieldDescription text={field.description} />
        )}
        <div className="grid gap-3 border-l-2 border-muted pl-2 sm:pl-4">
          {field.nestedFields.map((nested) => (
            <DynamicField
              key={nested.name}
              field={nested}
              value={
                (value as Record<string, unknown> | undefined)?.[nested.name]
              }
              onChange={(v) => {
                const current = (value as Record<string, unknown>) ?? {}
                const next = { ...current }
                if (v === undefined) {
                  delete next[nested.name]
                } else {
                  next[nested.name] = v
                }
                onChange(Object.keys(next).length > 0 ? next : undefined)
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  // string, multiselect, array — all render as text input
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {formatLabel(field.name)}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={id}
        value={value != null ? String(value) : ""}
        placeholder={
          field.type === "multiselect" || field.type === "array"
            ? "Comma-separated values"
            : field.default != null
              ? `Default: ${field.default}`
              : undefined
        }
        onChange={(e) => {
          const v = e.target.value
          if (field.type === "multiselect" || field.type === "array") {
            onChange(
              v
                ? v
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                : undefined,
            )
          } else {
            onChange(v || undefined)
          }
        }}
      />
      {field.description && (
        <FieldDescription text={field.description} />
      )}
    </div>
  )
}

function formatLabel(name: string): string {
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

/** Tag styles for **[Tag]** markers in provider descriptions */
const TAG_STYLES: Record<string, string> = {
  deprecated: "bg-destructive/15 text-destructive",
  beta: "bg-baas-primary-500/15 text-baas-primary-500",
  alpha: "bg-baas-primary-500/15 text-baas-primary-500",
}
const DEFAULT_TAG_STYLE = "bg-muted text-muted-foreground font-medium"

/**
 * Parses description text containing:
 * - **[Tag]** or **bold** markdown markers → styled <span> badges
 * - [text](url) markdown links → clickable <a> tags in brand color
 * - bare https:// URLs → clickable <a> tags in brand color
 */
function FieldDescription({ text }: { text: string }) {
  // Match bold **text**, markdown links [text](url), or bare URLs
  const pattern = /\*\*\[([^\]]+)\]\*\*|\*\*([^*]+)\*\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s)]+)/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    if (match[1]) {
      // **[Tag]** — render as styled badge
      const tag = match[1]
      const style = TAG_STYLES[tag.toLowerCase()] ?? DEFAULT_TAG_STYLE
      parts.push(
        <span key={match.index} className={cn("rounded px-1 py-0.5 text-[10px] font-medium", style)}>
          {tag}
        </span>,
      )
    } else if (match[2]) {
      // **bold** — render as bold text
      parts.push(
        <span key={match.index} className="font-semibold text-foreground">
          {match[2]}
        </span>,
      )
    } else if (match[3] && match[4]) {
      // Markdown link: [text](url)
      parts.push(
        <a
          key={match.index}
          href={match[4]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-baas-primary-500 underline hover:text-baas-primary-400"
        >
          {match[3]}
        </a>,
      )
    } else if (match[5]) {
      // Bare URL
      parts.push(
        <a
          key={match.index}
          href={match[5]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-baas-primary-500 underline hover:text-baas-primary-400"
        >
          {match[5]}
        </a>,
      )
    }

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return <p className="text-xs text-muted-foreground">{parts}</p>
}
