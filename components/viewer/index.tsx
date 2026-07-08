"use client";

import { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TranscriptViewer } from "@/components/viewer/transcript-viewer";
import { VideoPlayer } from "@/components/viewer/video-player";
import type {
  DiarizationSegment,
  OutputTranscription,
  Transcript,
} from "@/types/viewer.types";

interface ViewerProps {
  videoUrl: string;
  transcriptionUrl: string | null;
  diarizationUrl?: string | null;
  canToggleSpeakerSource?: boolean;
}

const SPEAKER_MATCH_WINDOW_SECONDS = 1;

function isDiarizationSegment(value: unknown): value is DiarizationSegment {
  if (!value || typeof value !== "object") return false;

  const segment = value as Record<string, unknown>;
  return (
    typeof segment.speaker === "string" &&
    typeof segment.start_time === "number" &&
    typeof segment.end_time === "number"
  );
}

function parseDiarizationJsonl(content: string): DiarizationSegment[] {
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      try {
        const parsed = JSON.parse(line) as unknown;
        return isDiarizationSegment(parsed) ? [parsed] : [];
      } catch {
        return [];
      }
    });
}

function findObservedSpeaker(
  transcript: Transcript,
  segments: DiarizationSegment[],
): string | null {
  const midpoint = (transcript.start_time + transcript.end_time) / 2;
  let bestMatch: string | null = null;
  let minTimeDiff = Number.POSITIVE_INFINITY;

  for (const segment of segments) {
    const segmentStart = segment.start_time - SPEAKER_MATCH_WINDOW_SECONDS;
    const segmentEnd = segment.end_time + SPEAKER_MATCH_WINDOW_SECONDS;

    if (midpoint >= segmentStart && midpoint <= segmentEnd) {
      const segmentMidpoint = (segment.start_time + segment.end_time) / 2;
      const timeDiff = Math.abs(midpoint - segmentMidpoint);

      if (timeDiff < minTimeDiff) {
        minTimeDiff = timeDiff;
        bestMatch = segment.speaker;
      }
    }
  }

  return bestMatch;
}

function applyObservedSpeakers(
  transcripts: Transcript[],
  segments: DiarizationSegment[],
): Transcript[] {
  return transcripts.map((transcript) => ({
    ...transcript,
    speaker: findObservedSpeaker(transcript, segments) ?? "Unknown",
  }));
}

export function Viewer({
  videoUrl,
  transcriptionUrl,
  diarizationUrl = null,
  canToggleSpeakerSource = false,
}: ViewerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [seekTime, setSeekTime] = useState<number | undefined>(undefined);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [observedSpeakerSegments, setObservedSpeakerSegments] = useState<
    DiarizationSegment[]
  >([]);
  const [useObservedSpeakers, setUseObservedSpeakers] = useState(false);
  const [isLoadingTranscript, setIsLoadingTranscript] = useState(true);
  const [transcriptError, setTranscriptError] = useState<string | null>(null);

  // Download and transform transcription
  useEffect(() => {
    // If no transcription URL, mark as not loading and show no transcript message
    if (!transcriptionUrl) {
      setIsLoadingTranscript(false);
      setTranscriptError(null);
      setTranscripts([]);
      return;
    }

    let cancelled = false;

    async function loadTranscription() {
      try {
        setIsLoadingTranscript(true);
        setTranscriptError(null);

        // Download transcription file from S3
        if (!transcriptionUrl) {
          throw new Error("Transcription URL is required");
        }
        const response = await fetch(transcriptionUrl);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch transcription: ${response.statusText}`,
          );
        }

        const data = (await response.json()) as OutputTranscription;

        if (cancelled) return;

        // Transform OutputTranscription to Transcript[] format
        // Each utterance is already a speaker segment (like the original transcript structure)
        // The structure matches: transcript has start_time, speaker, and words array
        // Each word within has its own start_time and end_time
        let wordIdCounter = 1;
        const transformedTranscripts: Transcript[] = data.result.utterances.map(
          (utterance, utteranceIndex) => {
            // Map words from utterance.words to the expected Word format
            // Each word keeps its own start_time and end_time (like in the original)
            const words = utterance.words.map((word) => ({
              id: wordIdCounter++,
              text: word.word,
              start_time: word.start,
              end_time: word.end,
            }));

            // Each utterance becomes a transcript segment
            // utterance.start is the start_time of the speaker segment
            // utterance.speaker is the speaker name
            // utterance.words contains all words for this segment
            return {
              id: utteranceIndex + 1,
              speaker: utterance.speaker || "Unknown",
              start_time: utterance.start, // Start time of this speaker segment
              end_time: utterance.end,
              words, // All words in this segment (each with their own timestamps)
            };
          },
        );

        setTranscripts(transformedTranscripts);
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to load transcription", error);
        setTranscriptError(
          error instanceof Error
            ? error.message
            : "Failed to load transcription",
        );
      } finally {
        if (!cancelled) {
          setIsLoadingTranscript(false);
        }
      }
    }

    loadTranscription();

    return () => {
      cancelled = true;
    };
  }, [transcriptionUrl]);

  useEffect(() => {
    if (!canToggleSpeakerSource || !diarizationUrl) {
      setObservedSpeakerSegments([]);
      setUseObservedSpeakers(false);
      return;
    }

    let cancelled = false;
    const observedSpeakerUrl = diarizationUrl;
    setObservedSpeakerSegments([]);
    setUseObservedSpeakers(false);

    async function loadDiarization() {
      try {
        const response = await fetch(observedSpeakerUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch diarization: ${response.statusText}`);
        }

        const content = await response.text();
        if (cancelled) return;

        setObservedSpeakerSegments(parseDiarizationJsonl(content));
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to load diarization", error);
        setObservedSpeakerSegments([]);
        setUseObservedSpeakers(false);
      }
    }

    loadDiarization();

    return () => {
      cancelled = true;
    };
  }, [canToggleSpeakerSource, diarizationUrl]);

  const displayedTranscripts = useMemo(() => {
    if (!useObservedSpeakers || observedSpeakerSegments.length === 0) {
      return transcripts;
    }

    return applyObservedSpeakers(transcripts, observedSpeakerSegments);
  }, [observedSpeakerSegments, transcripts, useObservedSpeakers]);

  const canUseObservedSpeakers =
    canToggleSpeakerSource &&
    observedSpeakerSegments.length > 0 &&
    transcripts.length > 0;

  const speakerSourceControl = canUseObservedSpeakers ? (
    <div className="flex shrink-0 items-center gap-2">
      <Switch
        id="observed-speakers"
        checked={useObservedSpeakers}
        onCheckedChange={setUseObservedSpeakers}
      />
      <Label
        htmlFor="observed-speakers"
        className="whitespace-nowrap text-muted-foreground text-xs"
      >
        Observed speakers
      </Label>
    </div>
  ) : null;

  const handleProgress = (state: {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
  }) => {
    setCurrentTime(state.playedSeconds);
  };

  const handleTimeChange = (time: number) => {
    setSeekTime(time);
  };

  return (
    <div className="flex grow flex-col md:mx-8">
      <div className="flex w-full grow flex-col md:flex-row">
        <div className="w-full md:mt-6 md:mr-4 md:w-3/4">
          <VideoPlayer
            url={videoUrl}
            onProgress={handleProgress}
            seekTo={seekTime}
          />
        </div>
        <div className="w-full border-t md:w-1/4 md:border-t-0 md:border-l">
          <TranscriptViewer
            transcripts={displayedTranscripts}
            currentTime={currentTime}
            onTimeChange={handleTimeChange}
            isLoading={isLoadingTranscript}
            error={transcriptError}
            headerAction={speakerSourceControl}
          />
        </div>
      </div>
    </div>
  );
}
