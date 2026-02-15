import {
  array,
  boolean,
  iso,
  nullable,
  object,
  optional,
  type output,
  string,
  url,
  uuid,
  enum as zodEnum,
} from "zod";

/**
 * Zoom Credential Types
 */
export const zoomCredentialTypeSchema = zodEnum(["app", "user"]);
export type ZoomCredentialType = output<typeof zoomCredentialTypeSchema>;

export const zoomCredentialStateSchema = zodEnum(["active", "invalid"]);
export type ZoomCredentialState = output<typeof zoomCredentialStateSchema>;

// ============================================================================
// Base field schemas (for reuse)
// ============================================================================

const nameFieldSchema = string()
  .trim()
  .min(1, "Name is required")
  .max(100, "Name is too long");

const clientIdFieldSchema = string()
  .trim()
  .min(1, "Client ID is required")
  .max(500, "Client ID is too long");

const clientSecretFieldSchema = string()
  .trim()
  .min(1, "Client Secret is required")
  .max(500, "Client Secret is too long");

const authorizationCodeFieldSchema = string()
  .trim()
  .max(2000, "Authorization code is too long");

const redirectUriFieldSchema = url("Invalid redirect URI");

// ============================================================================
// Response schemas
// ============================================================================

/**
 * Zoom Credential Response Schema
 */
export const zoomCredentialSchema = object({
  credential_id: uuid(),
  name: string(),
  credential_type: zoomCredentialTypeSchema,
  zoom_user_id: nullable(string()),
  zoom_account_id: nullable(string()),
  scopes: nullable(string()),
  state: zoomCredentialStateSchema,
  last_error_message: nullable(string()),
  last_error_at: nullable(iso.datetime()),
  created_at: iso.datetime(),
  updated_at: iso.datetime(),
});
export type ZoomCredential = output<typeof zoomCredentialSchema>;

/**
 * List Zoom Credentials Response
 */
export const zoomCredentialListResponseSchema = object({
  success: boolean(),
  data: array(zoomCredentialSchema),
});
export type ZoomCredentialListResponse = output<
  typeof zoomCredentialListResponseSchema
>;

/**
 * Single Zoom Credential Response
 */
export const zoomCredentialSingleResponseSchema = object({
  success: boolean(),
  data: zoomCredentialSchema,
});
export type ZoomCredentialSingleResponse = output<
  typeof zoomCredentialSingleResponseSchema
>;

// ============================================================================
// Form schemas
// ============================================================================

/**
 * Create Zoom Credential Form Schema
 */
export const createZoomCredentialFormSchema = object({
  name: nameFieldSchema,
  client_id: clientIdFieldSchema,
  client_secret: clientSecretFieldSchema,
  include_user_auth: boolean(),
  authorization_code: optional(authorizationCodeFieldSchema),
  redirect_uri: optional(redirectUriFieldSchema),
}).refine(
  (data) => {
    if (data.include_user_auth) {
      return !!data.authorization_code && !!data.redirect_uri;
    }
    return true;
  },
  {
    message:
      "Authorization code and redirect URI are required for user-authorized credentials",
    path: ["authorization_code"],
  }
);
export type CreateZoomCredentialForm = output<
  typeof createZoomCredentialFormSchema
>;

/**
 * Create Zoom Credential Request Schema (for API)
 */
export const createZoomCredentialRequestSchema = object({
  name: nameFieldSchema,
  client_id: clientIdFieldSchema,
  client_secret: clientSecretFieldSchema,
  authorization_code: optional(authorizationCodeFieldSchema),
  redirect_uri: optional(redirectUriFieldSchema),
});
export type CreateZoomCredentialRequest = output<
  typeof createZoomCredentialRequestSchema
>;

/**
 * Create Zoom Credential Response
 */
export const createZoomCredentialResponseSchema = object({
  success: boolean(),
  data: zoomCredentialSchema,
});
export type CreateZoomCredentialResponse = output<
  typeof createZoomCredentialResponseSchema
>;

/**
 * Update Zoom Credential Form Schema
 */
export const updateZoomCredentialFormSchema = object({
  name: optional(nameFieldSchema),
  client_id: optional(clientIdFieldSchema),
  client_secret: optional(clientSecretFieldSchema),
  authorization_code: optional(authorizationCodeFieldSchema),
  redirect_uri: optional(redirectUriFieldSchema),
});
export type UpdateZoomCredentialForm = output<
  typeof updateZoomCredentialFormSchema
>;

/**
 * Update Zoom Credential Response
 */
export const updateZoomCredentialResponseSchema = object({
  success: boolean(),
  data: zoomCredentialSchema,
});
export type UpdateZoomCredentialResponse = output<
  typeof updateZoomCredentialResponseSchema
>;

/**
 * Delete Zoom Credential Response
 */
export const deleteZoomCredentialResponseSchema = object({
  success: boolean(),
  data: object({
    message: string(),
  }),
});
export type DeleteZoomCredentialResponse = output<
  typeof deleteZoomCredentialResponseSchema
>;
