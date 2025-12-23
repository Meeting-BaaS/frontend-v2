// Types for the viewer component
// Using VoiceRouter SDK types for consistency with backend

import type { Utterance, Word as SDKWord } from "voice-router-dev";

// Re-export SDK types for convenience
export type { Utterance, SDKWord };

// Internal Word type for the viewer (with id for React keys)
export interface Word {
  id: number;
  text: string;
  start_time: number;
  end_time: number;
}

// Internal Transcript type for the viewer (with id for React keys)
export interface Transcript {
  id: number;
  speaker: string;
  start_time: number;
  words: Word[];
}

// Output transcription format from the API
// Uses SDK's Utterance type for the utterances array
export interface OutputTranscription {
  bot_id: string;
  provider: string;
  result: {
    utterances: Array<Utterance & { language?: string; channel?: number }>;
    languages: string[];
    total_utterances: number;
    total_duration: number;
  };
  created_at: string;
}
