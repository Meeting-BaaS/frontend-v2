import {
  array,
  boolean,
  email,
  iso,
  number,
  object,
  type output,
  preprocess,
  string,
  enum as zodEnum,
  instanceof as zodInstanceOf,
} from "zod";
import { planTypeSchema } from "@/lib/schemas/settings";

export const roleEnum = zodEnum(["owner", "admin", "member"]);

export const teamDetails = array(
  object({
    id: number(),
    name: string(),
    logo: string().nullable(),
    region: string().nullable(),
    plan: planTypeSchema,
    isActive: boolean(),
    rateLimit: number(),
    role: roleEnum,
  }),
);

export const teamDetailsResponseSchema = object({
  success: boolean(),
  data: teamDetails,
});

export type TeamDetails = output<typeof teamDetails>;

export type TeamDetailsResponse = output<typeof teamDetailsResponseSchema>;

export const invitationStatusEnum = zodEnum([
  "pending",
  "accepted",
  "rejected",
  "canceled",
]);

/**
 * Schema for inviting a team member
 */
export const inviteMemberFormSchema = object({
  email: email("Please enter a valid email address"),
  role: zodEnum(["admin", "member"], {
    message: "Role must be either admin or member",
  }),
});

export type InviteMemberFormData = output<typeof inviteMemberFormSchema>;

/**
 * Schema for validating invitation ID from search params
 */
export const acceptInviteSearchParamsSchema = object({
  id: preprocess((value) => {
    if (typeof value === "string") {
      return Number.parseInt(value, 10);
    }
    return value;
  }, number().int().positive()),
});

export type AcceptInviteSearchParams = output<
  typeof acceptInviteSearchParamsSchema
>;

/**
 * Invitation response schema from Better Auth
 */
export const invitationResponseSchema = object({
  success: boolean(),
  data: object({
    id: string(),
    organizationId: string(),
    email: email(),
    role: roleEnum,
    status: invitationStatusEnum,
    inviterId: string(),
    expiresAt: iso.datetime(),
    organizationName: string(),
    organizationSlug: string(),
    inviterEmail: email(),
  }),
});

export type InvitationResponse = output<typeof invitationResponseSchema>;

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
  email: email(),
  role: roleEnum,
  createdAt: iso.datetime().nullable(),
  invitationStatus: invitationStatusEnum.nullable(),
  expiresAt: iso.datetime().nullable(),
});

export type Role = output<typeof roleEnum>;
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
export const teamLogoFileSchema = zodInstanceOf(File, {
  error: "File is required",
})
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
