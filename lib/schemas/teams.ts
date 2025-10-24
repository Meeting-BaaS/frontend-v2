import {
  array,
  boolean,
  number,
  object,
  type output,
  string,
  enum as zodEnum,
} from "zod";

export const teamDetails = array(
  object({
    id: number(),
    name: string(),
    logo: string().nullable(),
    region: string().nullable(),
    plan: zodEnum(["PAYG", "Pro", "Scale", "Enterprise"]),
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
