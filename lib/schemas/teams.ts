import { array, boolean, number, object, type output, string } from "zod";
import { planTypeSchema } from "@/lib/schemas/settings";

export const teamDetails = array(
  object({
    id: number(),
    name: string(),
    logo: string().nullable(),
    region: string().nullable(),
    plan: planTypeSchema,
    isActive: boolean(),
    rateLimit: number(),
  }),
);

export const teamDetailsResponseSchema = object({
  success: boolean(),
  data: teamDetails,
});

export type TeamDetails = output<typeof teamDetails>;

export type TeamDetailsResponse = output<typeof teamDetailsResponseSchema>;
