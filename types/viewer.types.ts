// Types for the viewer component

export interface Word {
  id: number;
  text: string;
  start_time: number;
  end_time: number;
}

export interface Transcript {
  id: number;
  speaker: string;
  start_time: number;
  words: Word[];
}

export interface OutputTranscription {
  bot_id: string;
  provider: string;
  result: {
    utterances: Array<{
      text: string;
      language: string;
      start: number;
      end: number;
      confidence: number;
      channel: number;
      words: Array<{
        word: string;
        start: number;
        end: number;
        confidence: number;
      }>;
      speaker: string;
    }>;
    languages: string[];
    total_utterances: number;
    total_duration: number;
  };
  created_at: string;
}
