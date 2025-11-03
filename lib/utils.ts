import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ReadableRecordingMode } from "@/types/bots.types";
import type { RecordingMode } from "./schemas/bots";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a recording mode to a readable format.
 * @param recordingMode - The recording mode to convert to a readable format.
 * @returns The readable recording mode.
 */
export function readableRecordingMode(
  recordingMode: RecordingMode,
): ReadableRecordingMode {
  switch (recordingMode) {
    case "audioOnly":
      return "Audio Only";
    case "speakerView":
      return "Speaker View";
    case "galleryView":
      return "Gallery View";
    default:
      return "Unknown";
  }
}
