import {
  array,
  boolean,
  email,
  iso,
  number,
  object,
  type output,
  string,
  enum as zodEnum,
  instanceof as zodInstanceOf,
} from "zod";
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

export const roleEnum = zodEnum(["owner", "admin", "member"]);

/**
 * Schema for updating team name
 */
export const updateTeamNameSchema = object({
  name: string()
    .trim()
    .min(1, "Team name is required")
    .max(255, "Team name is too long"),
});

export type UpdateTeamName = output<typeof updateTeamNameSchema>;

/**
 * Team member schema
 */
export const teamMemberSchema = object({
  id: number().int().positive(),
  email: email(),
  role: roleEnum,
  createdAt: iso.datetime(),
});

export type TeamMember = output<typeof teamMemberSchema>;

/**
 * Team members list response schema
 */
export const teamMembersListResponseSchema = object({
  success: boolean(),
  data: object({
    members: array(teamMemberSchema),
  }),
});

export type TeamMembersListResponse = output<
  typeof teamMembersListResponseSchema
>;

/**
 * Allowed MIME types for team logos
 */
export const ALLOWED_LOGO_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
] as const;

/**
 * Maximum file size in bytes (2MB)
 */
export const MAX_LOGO_FILE_SIZE = 2 * 1024 * 1024; // 2MB

/**
 * Schema for validating team logo file uploads (standalone validation)
 * Validates mimetype and file size
 */
export const teamLogoFileSchema = zodInstanceOf(File)
  .refine(
    (file) =>
      ALLOWED_LOGO_MIME_TYPES.includes(
        file.type as (typeof ALLOWED_LOGO_MIME_TYPES)[number],
      ),
    {
      message: `File type must be one of: PNG, JPEG, JPG, or WebP`,
    },
  )
  .refine((file) => file.size > 0 && file.size <= MAX_LOGO_FILE_SIZE, {
    message: `File size must be between 1 byte and ${MAX_LOGO_FILE_SIZE / (1024 * 1024)}MB`,
  });

/**
 * Schema for team logo form
 */
export const teamLogoFormSchema = object({
  file: teamLogoFileSchema,
});

export type TeamLogoFormData = output<typeof teamLogoFormSchema>;

/**
 * Team logo upload response schema
 */
export const teamLogoUploadResponseSchema = object({
  success: boolean(),
  data: object({
    logoUrl: string(),
  }),
});

export type TeamLogoUploadResponse = output<
  typeof teamLogoUploadResponseSchema
>;
