"use client"

import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { CopyButton } from "@/components/ui/copy-button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from "@/components/ui/input-group"
import { cn } from "@/lib/utils"

interface SecretFieldProps {
  value: string
  name?: string
  placeholder?: string
  className?: string
}

export function SecretField({
  value,
  name = "secret",
  placeholder = "Secret",
  className
}: SecretFieldProps) {
  const [show, setShow] = useState(false)

  return (
    <InputGroup className={cn("h-7", className)}>
      <InputGroupInput
        name={name}
        placeholder={placeholder}
        className="disabled:opacity-100"
        value={value}
        readOnly
        type={show ? "text" : "password"}
        disabled
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="icon-xs"
          aria-label={show ? "Hide secret" : "Show secret"}
          onClick={() => setShow(!show)}
        >
          {show ? <Eye /> : <EyeOff />}
        </InputGroupButton>
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="icon-xs" asChild>
          <CopyButton text={value} />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
