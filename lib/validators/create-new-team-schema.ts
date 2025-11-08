import { number, object, type output, string } from "zod";
import { integerPreprocess } from "@/lib/schemas/common";

export const CreateNewTeamSchema = object({
  teamName: string()
    .min(1, "Team name is required")
    .max(255, "Team name must be less than 255 characters")
    .trim(),
  plan: string().min(1, "You must select a subscription plan to continue."),
});

export type CreateNewTeamFormData = output<typeof CreateNewTeamSchema>;

/**
 * Schema for validating search params on create-new-team page
 */
export const createNewTeamSearchParamsSchema = object({
  teamName: string().optional(),
  plan: string().optional(),
});

export type CreateNewTeamSearchParams = output<
  typeof createNewTeamSearchParamsSchema
>;

/**
 * Schema for validating search params on team-created-success page
 */
export const teamCreatedSuccessSearchParamsSchema = object({
  teamId: integerPreprocess(number().int().positive()),
  teamSlug: string().min(1),
});

export type TeamCreatedSuccessSearchParams = output<
  typeof teamCreatedSuccessSearchParamsSchema
>;
