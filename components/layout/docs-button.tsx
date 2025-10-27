"use client";

import { CodeXml } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { DOCS_URL } from "@/lib/external-urls";

interface DocsButtonProps {
  href?: string;
  keyBinding?: string;
  name?: string;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
}

export function DocsButton({
  href = DOCS_URL,
  keyBinding = "A",
  name = "API",
  className = "grow-1 sm:grow-0",
  size = "sm",
  variant = "outline",
}: DocsButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger if user is typing in an input field
      const target = event.target as HTMLElement;
      const isInputFocused =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true" ||
        target.isContentEditable;

      if (isInputFocused) {
        return;
      }

      // Handle the specified key binding
      if (event.key.toLowerCase() === keyBinding.toLowerCase()) {
        // Only trigger if no modifier keys are pressed
        if (
          !event.ctrlKey &&
          !event.metaKey &&
          !event.altKey &&
          !event.shiftKey
        ) {
          event.preventDefault();
          buttonRef.current?.click();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [keyBinding]);

  return (
    <Button variant={variant} size={size} className={className} asChild>
      <Link
        ref={buttonRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <CodeXml />
        {name}
        <KbdGroup>
          <Kbd>{keyBinding}</Kbd>
        </KbdGroup>
      </Link>
    </Button>
  );
}
