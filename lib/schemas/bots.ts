import { number, object, type output, string } from "zod";

export const botsRequestSchema = object({
  offset: number().int().positive().default(0),
  limit: number().int().positive().default(20),
  start_date: number().int().positive(), // UNIX timestamp in milliseconds
  end_date: number().int().positive(), // UNIX timestamp in milliseconds
  meeting_platform: string().default("all"),
  status: string().default("all"),
  search: string().optional(),
});

export type BotsRequest = output<typeof botsRequestSchema>;
