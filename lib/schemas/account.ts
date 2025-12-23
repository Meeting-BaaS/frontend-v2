import {
  array,
  boolean,
  email,
  iso,
  object,
  type output,
  string,
  enum as zodEnum,
  instanceof as zodInstanceOf,
} from "zod";
import { invitationStatusEnum, roleEnum } from "@/lib/schemas/teams";
import { passwordSchema } from "@/lib/validators/sign-up-schema";

/**
 * Allowed MIME types for user images
 */
export const ALLOWED_USER_IMAGE_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
] as const;

/**
 * Maximum file size in bytes (2MB)
 */
export const MAX_USER_IMAGE_FILE_SIZE = 2 * 1024 * 1024; // 2MB

/**
 * Schema for validating user image file uploads (standalone validation)
 * Validates mimetype and file size
 * Use a conditional to avoid referencing File at module evaluation time (server-side compatibility)
 */
export const userImageFileSchema =
  typeof File !== "undefined"
    ? zodInstanceOf(File, {
        error: "File is required",
      })
        .refine(
          (file) =>
            ALLOWED_USER_IMAGE_MIME_TYPES.includes(
              file.type as (typeof ALLOWED_USER_IMAGE_MIME_TYPES)[number],
            ),
          {
            message: `File type must be one of: PNG, JPEG, JPG, or WebP`,
          },
        )
        .refine((file) => file.size > 0 && file.size <= MAX_USER_IMAGE_FILE_SIZE, {
          message: `File size must be between 1 byte and ${MAX_USER_IMAGE_FILE_SIZE / (1024 * 1024)}MB`,
        })
    : (null as any); // Server-side placeholder (won't be used)

/**
 * Schema for user image form
 */
export const userImageFormSchema = object({
  file: userImageFileSchema,
});

export type UserImageFormData = output<typeof userImageFormSchema>;

/**
 * User image upload response schema
 */
export const userImageUploadResponseSchema = object({
  success: boolean(),
  data: object({
    imageUrl: string(),
  }),
});

export type UserImageUploadResponse = output<
  typeof userImageUploadResponseSchema
>;

/**
 * Schema for updating user name
 */
export const updateUserNameSchema = object({
  name: string()
    .trim()
    .min(1, "Please enter name")
    .max(255, "Name is too long"),
});

export type UpdateUserName = output<typeof updateUserNameSchema>;

/**
 * Schema for change password form
 */
export const changePasswordFormSchema = object({
  currentPassword: string().min(1, "Please enter current password"), // A simple string is enough here because it's already validated in the password schema
  newPassword: passwordSchema,
  confirmPassword: passwordSchema,
  revokeOtherSessions: boolean(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

export type ChangePasswordFormData = output<typeof changePasswordFormSchema>;

/**
 * Check credential account response schema
 */
export const checkCredentialAccountResponseSchema = object({
  success: boolean(),
  data: object({
    hasCredentialAccount: boolean(),
  }),
});

export type CheckCredentialAccountResponse = output<
  typeof checkCredentialAccountResponseSchema
>;

/**
 * Invitation schema
 * Note: createdAt may not be in the response, so we calculate it from expiresAt (7 days before)
 */
export const invitationSchema = object({
  id: string(),
  teamId: string(),
  email: email(),
  role: roleEnum,
  status: invitationStatusEnum,
  inviterId: string(),
  expiresAt: iso.datetime(),
  teamName: string(),
  teamSlug: string(),
  inviterEmail: email(),
});

export type Invitation = output<typeof invitationSchema>;

/**
 * List user invitations response schema
 */
export const listUserInvitationsResponseSchema = object({
  success: boolean(),
  data: array(invitationSchema),
});

export type ListUserInvitationsResponse = output<
  typeof listUserInvitationsResponseSchema
>;

/**
 * Email type enum
 */
export const emailTypeEnum = zodEnum(["apiChanges", "productUpdates"]);
export type EmailType = output<typeof emailTypeEnum>;

/**
 * Email preference schema
 */
export const emailPreferenceSchema = object({
  emailType: emailTypeEnum,
  subscribed: boolean(),
});

export type EmailPreference = output<typeof emailPreferenceSchema>;

/**
 * Get email preferences response schema
 */
export const getEmailPreferencesResponseSchema = object({
  success: boolean(),
  data: array(emailPreferenceSchema),
});

export type GetEmailPreferencesResponse = output<
  typeof getEmailPreferencesResponseSchema
>;

/**
 * Update email preferences request schema
 */
export const updateEmailPreferencesSchema = object({
  preferences: array(emailPreferenceSchema),
});

export type UpdateEmailPreferences = output<
  typeof updateEmailPreferencesSchema
>;

/**
 * Update email preferences response schema
 */
export const updateEmailPreferencesResponseSchema = object({
  success: boolean(),
  data: array(emailPreferenceSchema),
});

export type UpdateEmailPreferencesResponse = output<
  typeof updateEmailPreferencesResponseSchema
>;
