"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface JsonPreviewProps {
  data: Record<string, unknown> | null;
}

const MAX_PREVIEW_LENGTH = 20;

export function JsonPreview({ data }: JsonPreviewProps) {
  if (!data || Object.keys(data).length === 0) {
    return <span className="text-muted-foreground text-xs">N/A</span>;
  }

  // Get the first entry for preview
  const [firstKey, firstValue] = Object.entries(data)[0] ?? [];
  if (!firstKey) return null;

  const valueStr = JSON.stringify(firstValue);
  const preview = `{ ${firstKey}: ${valueStr} }`;
  const truncatedPreview =
    preview.length > MAX_PREVIEW_LENGTH
      ? preview.substring(0, MAX_PREVIEW_LENGTH - 3)
      : preview;
  const hasMoreKeys = Object.keys(data).length > 1;

  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <Badge variant="secondary">
          {truncatedPreview}
          {hasMoreKeys || preview.length > MAX_PREVIEW_LENGTH ? "..." : ""}
        </Badge>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-1">
            <h4 className="font-semibold text-sm capitalize">Complete JSON</h4>
            <div className="max-h-[200px] overflow-y-auto pr-2">
              <p className="whitespace-pre-wrap break-words text-muted-foreground text-sm">
                {JSON.stringify(data, null, 2)}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="-mt-3 -mr-3 h-8 w-8 shrink-0"
            asChild
          >
            <CopyButton text={JSON.stringify(data, null, 2)} />
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
