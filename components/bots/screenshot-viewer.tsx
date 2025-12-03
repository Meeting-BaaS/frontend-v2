"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { BotScreenshot } from "@/lib/schemas/bots";

interface ScreenshotViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  screenshots: BotScreenshot[];
  initialIndex?: number;
}

export function ScreenshotViewer({
  open,
  onOpenChange,
  screenshots,
  initialIndex = 0,
}: ScreenshotViewerProps) {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>(
    {},
  );
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(initialIndex);

  // Initialize loading state when screenshots change
  useEffect(() => {
    const initial: Record<number, boolean> = {};
    screenshots.forEach((_, index) => {
      initial[index] = true;
    });
    setLoadingImages(initial);
    setImageErrors({});
  }, [screenshots]);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    if (api && open) {
      api.scrollTo(initialIndex);
    }
  }, [api, open, initialIndex]);

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  const handleImageLoad = (index: number) => {
    setLoadingImages((prev) => ({ ...prev, [index]: false }));
  };

  if (screenshots.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-svw sm:max-w-svw max-h-svh w-full h-full p-0 flex flex-col m-0 rounded-none sm:rounded-none !top-0 !left-0 !translate-x-0 !translate-y-0">
        <DialogHeader className="px-6 pt-6 flex-shrink-0">
          <DialogTitle>
            Screenshots ({current} of {screenshots.length})
          </DialogTitle>
          <DialogDescription className="sr-only">
            View the screenshots for the bot.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 relative px-6 pb-6 min-h-0 overflow-hidden">
          <Carousel setApi={setApi} className="w-full h-full">
            <CarouselContent className="h-full">
              {screenshots.map((screenshot, index) => (
                <CarouselItem key={screenshot.screenshot_id} className="h-svh">
                  <div className="relative h-full w-full flex items-center justify-center">
                    {imageErrors[index] ? (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertCircle className="size-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          Image not available
                        </p>
                        <p className="text-sm text-muted-foreground">
                          The image may have expired or been removed
                        </p>
                      </div>
                    ) : (
                      <div className="relative h-full w-full">
                        {loadingImages[index] !== false && (
                          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                            <Loader2 className="size-8 animate-spin text-primary" />
                          </div>
                        )}
                        <Image
                          src={screenshot.url}
                          alt={`Screenshot ${screenshot.screenshot_id}`}
                          className="object-contain p-12"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                          onError={() => handleImageError(index)}
                          onLoad={() => handleImageLoad(index)}
                        />
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  );
}
