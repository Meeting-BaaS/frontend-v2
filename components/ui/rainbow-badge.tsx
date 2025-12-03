"use client";

import type * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RainbowBadgeProps extends React.ComponentProps<"span"> {
  children: React.ReactNode;
  className?: string;
}

export function RainbowBadge({
  children,
  className,
  ...props
}: RainbowBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rainbow-border border px-2 py-1 border-transparent rounded-xl",
        className,
      )}
      {...props}
    >
      {children}
    </Badge>
  );
}
