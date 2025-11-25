"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ScreenshotCard } from "@/components/bots/screenshot-card";
import { ScreenshotViewer } from "@/components/bots/screenshot-viewer";
import { axiosGetInstance } from "@/lib/api-client";
import { GET_BOT_SCREENSHOTS } from "@/lib/api-routes";
import { genericError } from "@/lib/errors";
import type {
  BotScreenshot,
  GetBotScreenshotsResponse,
} from "@/lib/schemas/bots";
import { getBotScreenshotsResponseSchema } from "@/lib/schemas/bots";

interface ScreenshotsProps {
  botUuid: string;
  endedAt: string | null;
}

export function Screenshots({ botUuid, endedAt }: ScreenshotsProps) {
  const [screenshots, setScreenshots] = useState<BotScreenshot[]>([]);
  const [isScreenshotViewerOpen, setIsScreenshotViewerOpen] = useState(false);
  const [isLoadingScreenshots, setIsLoadingScreenshots] = useState(false);

  const handleViewScreenshots = async () => {
    if (isLoadingScreenshots) return;

    setIsLoadingScreenshots(true);
    try {
      // Fetch all screenshots with pagination
      let allScreenshots: BotScreenshot[] = [];
      let cursor: string | null = null;

      do {
        const response: GetBotScreenshotsResponse =
          await axiosGetInstance<GetBotScreenshotsResponse>(
            GET_BOT_SCREENSHOTS(botUuid),
            getBotScreenshotsResponseSchema,
            {
              params: {
                cursor: cursor ?? null,
                limit: 250,
              },
            },
          );

        allScreenshots = [...allScreenshots, ...response.data];
        cursor = response.cursor;
      } while (cursor);

      if (allScreenshots.length === 0) {
        toast.error("No screenshots found");
        return;
      }

      // Sort by screenshot_id to ensure correct order
      allScreenshots.sort((a, b) => a.screenshot_id - b.screenshot_id);

      setScreenshots(allScreenshots);
      setIsScreenshotViewerOpen(true);
    } catch (error) {
      console.error("Failed to fetch screenshots", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setIsLoadingScreenshots(false);
    }
  };

  return (
    <>
      <ScreenshotCard
        title={`${botUuid} - screenshots`}
        date={endedAt}
        onView={handleViewScreenshots}
        isLoading={isLoadingScreenshots}
      />
      <ScreenshotViewer
        open={isScreenshotViewerOpen}
        onOpenChange={setIsScreenshotViewerOpen}
        screenshots={screenshots}
      />
    </>
  );
}
