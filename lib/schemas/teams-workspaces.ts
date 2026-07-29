import {
  array,
  boolean,
  iso,
  literal,
  nullable,
  object,
  optional,
  type output,
  record,
  string,
  uuid,
  enum as zodEnum,
  unknown as zodUnknown
} from "zod"

const extraFieldSchema = record(string(), zodUnknown())

/**
 * Teams Workspace Types
 * A lightweight Microsoft 365 tenant holder — no SAML cert/key (Teams sign-in is
 * username/password). Mirrors Meet Workspace minus the keypair fields.
 */
export const teamsWorkspaceStateSchema = zodEnum(["active", "invalid"])
export type TeamsWorkspaceState = output<typeof teamsWorkspaceStateSchema>

// ============================================================================
// Base field schemas (for reuse)
// ============================================================================

const nameFieldSchema = string()
  .trim()
  .min(1, "Name is required")
  .max(100, "Name must be 100 characters or less")

const domainFieldSchema = string()
  .trim()
  .min(1, "Domain is required")
  .max(253, "Domain is too long")
  .regex(/^[a-z0-9.-]+\.[a-z]{2,}$/i, "Domain must be a valid hostname")

// ============================================================================
// Response schemas
// ============================================================================

export const teamsWorkspaceSchema = object({
  workspace_id: uuid(),
  name: string(),
  domain: string(),
  state: teamsWorkspaceStateSchema,
  failure_data: optional(zodUnknown()),
  last_error_message: nullable(string()),
  last_error_at: nullable(iso.datetime()),
  extra: nullable(extraFieldSchema),
  created_at: iso.datetime(),
  updated_at: iso.datetime()
})
export type TeamsWorkspace = output<typeof teamsWorkspaceSchema>

export const teamsWorkspaceListResponseSchema = object({
  success: boolean(),
  data: array(teamsWorkspaceSchema)
})
export type TeamsWorkspaceListResponse = output<typeof teamsWorkspaceListResponseSchema>

export const teamsWorkspaceSingleResponseSchema = object({
  success: boolean(),
  data: teamsWorkspaceSchema
})
export type TeamsWorkspaceSingleResponse = output<typeof teamsWorkspaceSingleResponseSchema>

export const deleteTeamsWorkspaceResponseSchema = object({
  success: boolean(),
  data: object({ message: string() })
})
export type DeleteTeamsWorkspaceResponse = output<typeof deleteTeamsWorkspaceResponseSchema>

// ============================================================================
// Create form / request
// ============================================================================

export const createTeamsWorkspaceFormSchema = object({
  name: nameFieldSchema,
  domain: domainFieldSchema,
  extra: optional(nullable(extraFieldSchema))
})
export type CreateTeamsWorkspaceForm = output<typeof createTeamsWorkspaceFormSchema>

export type CreateTeamsWorkspaceRequest = {
  name: string
  domain: string
  extra?: Record<string, unknown> | null
}

// ============================================================================
// Update name form (rename only)
// ============================================================================

export const updateTeamsWorkspaceNameFormSchema = object({
  name: nameFieldSchema,
  extra: optional(nullable(extraFieldSchema))
})
export type UpdateTeamsWorkspaceNameForm = output<typeof updateTeamsWorkspaceNameFormSchema>

// ============================================================================
// Update request body (server-side; one PATCH endpoint accepts any subset)
// ============================================================================

export type UpdateTeamsWorkspaceRequest =
  | { name?: string; extra?: Record<string, unknown> | null }
  | { state: "active" }

// ============================================================================
// Re-enable request body (subset of UpdateTeamsWorkspaceRequest)
// ============================================================================

export const reEnableTeamsWorkspaceRequestSchema = object({
  state: literal("active")
})
export type ReEnableTeamsWorkspaceRequest = output<typeof reEnableTeamsWorkspaceRequestSchema>
