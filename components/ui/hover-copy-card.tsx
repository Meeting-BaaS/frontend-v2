"use client"

import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/ui/copy-button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { cn } from "@/lib/utils"

interface HoverCopyCardProps {
  /** The full text to display in the hover card and copy to clipboard */
  text: string
  /** Title shown above the content in the hover card */
  title?: string
  /** Max width class for the truncated trigger text */
  triggerClassName?: string
  /** Width class for the hover card content */
  contentClassName?: string
}

export function HoverCopyCard({
  text,
  title = "Details",
  triggerClassName = "max-w-[200px]",
  contentClassName = "w-80"
}: HoverCopyCardProps) {
  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <span
          className={cn("truncate block cursor-pointer first-letter:capitalize", triggerClassName)}
        >
          {text}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className={cn("relative", contentClassName)}>
        <div className="space-y-1">
          <h4 className="font-semibold text-sm">{title}</h4>
          <div className="max-h-[200px] overflow-y-auto pr-2">
            <p className="whitespace-pre-wrap break-words text-muted-foreground text-sm first-letter:capitalize">
              {text}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8" asChild>
          <CopyButton text={text} />
        </Button>
      </HoverCardContent>
    </HoverCard>
  )
}
