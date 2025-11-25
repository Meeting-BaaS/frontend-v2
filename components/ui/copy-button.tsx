"use client";

import { Check, Copy } from "lucide-react";
import { forwardRef, useState } from "react";
import { toast } from "sonner";

interface CopyButtonProps {
  text: string;
}

export const CopyButton = forwardRef<
  HTMLButtonElement,
  CopyButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ text, ...props }, ref) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("copy error", err, text);
      toast.error("Failed to copy.");
    }
  };

  return (
    <button
      ref={ref}
      type="button"
      disabled={copied}
      aria-busy={copied}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      onClick={copyToClipboard}
      {...props}
    >
      {copied ? (
        <Check className="text-green-500" />
      ) : (
        <Copy className="text-foreground/60" />
      )}
    </button>
  );
});

CopyButton.displayName = "CopyButton";
