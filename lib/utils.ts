import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { RecordingMode } from "@/lib/schemas/bots";
import type { ReadableRecordingMode } from "@/types/bots.types";

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
    case "audio_only":
      return "Audio Only";
    case "speaker_view":
      return "Speaker View";
    case "gallery_view":
      return "Gallery View";
    default:
      return "Unknown";
  }
}
