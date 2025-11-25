"use client";

import { useEffect, useState } from "react";
import { TranscriptViewer } from "@/components/viewer/transcript-viewer";
import { VideoPlayer } from "@/components/viewer/video-player";
import type { OutputTranscription, Transcript } from "@/types/viewer.types";

interface ViewerProps {
  videoUrl: string;
  transcriptionUrl: string;
}

export function Viewer({ videoUrl, transcriptionUrl }: ViewerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [seekTime, setSeekTime] = useState<number | undefined>(undefined);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [isLoadingTranscript, setIsLoadingTranscript] = useState(true);
  const [transcriptError, setTranscriptError] = useState<string | null>(null);

  // Download and transform transcription
  useEffect(() => {
    let cancelled = false;

    async function loadTranscription() {
      try {
        setIsLoadingTranscript(true);
        setTranscriptError(null);

        // Download transcription file from S3
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
            transcripts={transcripts}
            currentTime={currentTime}
            onTimeChange={handleTimeChange}
            isLoading={isLoadingTranscript}
            error={transcriptError}
          />
        </div>
      </div>
    </div>
  );
}
