"use client";

import { FileAudio, FileText, Key, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GradientIcon } from "@/components/ui/gradient-icon";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface TokenRate {
  title: string;
  rate: string;
  unit: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const tokenRates: TokenRate[] = [
  {
    title: "Raw Recording",
    rate: "1.00 token",
    unit: "per hour",
    subtitle: "Includes speaker diarization",
    icon: FileAudio,
    color: "var(--color-violet-500)",
  },
  {
    title: "Transcription",
    rate: "+0.25 token",
    unit: "per hour",
    subtitle: "Gladia transcription",
    icon: FileText,
    color: "var(--color-blue-500)",
  },
  {
    title: "BYOK Transcription",
    rate: "+0.05 token",
    unit: "per hour",
    subtitle: "Bring Your Own Key",
    icon: Key,
    color: "var(--color-green-500)",
  },
  {
    title: "Streaming",
    rate: "+0.10 token",
    unit: "per hour",
    subtitle: "Per input or output",
    icon: Radio,
    color: "var(--color-amber-500)",
  },
];

export function TokenUsageRatesSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="link"
          size="sm"
          className="p-0 h-auto text-baas-primary-500 hover:underline transition-all"
        >
          View token rates
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Token Usage Rates</SheetTitle>
          <SheetDescription>
            Understand how tokens are consumed for each feature and service.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 px-4 sm:grid-cols-1">
          {tokenRates.map((rate) => {
            const Icon = rate.icon;
            return (
              <div
                key={rate.title}
                className="flex items-start gap-4 rounded-lg border p-4"
              >
                <GradientIcon color={rate.color} size="md" className="mt-0.5">
                  <Icon className="size-4" />
                </GradientIcon>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm">{rate.title}</h3>
                  <p className="mt-0.5 text-muted-foreground text-xs">
                    {rate.subtitle}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-medium text-sm">{rate.rate}</div>
                  <div className="text-muted-foreground text-xs">
                    {rate.unit}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
