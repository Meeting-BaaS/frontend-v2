import {
  array,
  boolean,
  email,
  iso,
  literal,
  nullable,
  number,
  object,
  optional,
  type output,
  record,
  string,
  union,
  uuid,
  enum as zodEnum,
  unknown as zodUnknown
} from "zod"

const extraFieldSchema = record(string(), zodUnknown())

/**
 * Teams Login Types
 * A Microsoft 365 account identity (username/password) under a teams workspace.
 * Mirrors Meet Login, plus a write-only password field (never returned).
 */
export const teamsLoginStateSchema = zodEnum(["active", "invalid"])
export type TeamsLoginState = output<typeof teamsLoginStateSchema>

// ============================================================================
// Base field schemas (for reuse)
// ============================================================================

const nameFieldSchema = string()
  .trim()
  .min(1, "Name is required")
  .max(100, "Name must be 100 characters or less")

const emailFieldSchema = email({ error: "Email must be a valid email address" })
  .trim()
  .max(254, "Email is too long")

const passwordFieldSchema = string()
  .min(1, "Password is required")
  .max(1024, "Password is too long")

const emailGroupFieldSchema = email({
  error: "Email group must be a valid email address"
})
  .trim()
  .max(254, "Email group is too long")

// ============================================================================
// Response schemas
// ============================================================================

export const teamsLoginSchema = object({
  credential_id: uuid(),
  workspace_id: uuid(),
  name: string(),
  email: string(),
  email_group: nullable(string()),
  state: teamsLoginStateSchema,
  failure_data: optional(zodUnknown()),
  last_error_message: nullable(string()),
  last_error_at: nullable(iso.datetime()),
  last_used_at: nullable(iso.datetime()),
  active_session_count: number().int().nonnegative(),
  extra: nullable(extraFieldSchema),
  created_at: iso.datetime(),
  updated_at: iso.datetime()
})
export type TeamsLogin = output<typeof teamsLoginSchema>

export const teamsLoginListResponseSchema = object({
  success: boolean(),
  data: array(teamsLoginSchema)
})
export type TeamsLoginListResponse = output<typeof teamsLoginListResponseSchema>

export const teamsLoginSingleResponseSchema = object({
  success: boolean(),
  data: teamsLoginSchema
})
export type TeamsLoginSingleResponse = output<typeof teamsLoginSingleResponseSchema>

export const deleteTeamsLoginResponseSchema = object({
  success: boolean(),
  data: object({ message: string() })
})
export type DeleteTeamsLoginResponse = output<typeof deleteTeamsLoginResponseSchema>

// ============================================================================
// Utilization
// ============================================================================

export const teamsLoginUtilizationResponseSchema = object({
  success: boolean(),
  data: object({
    logins_total: number().int().nonnegative(),
    logins_active: number().int().nonnegative(),
    logins_invalid: number().int().nonnegative(),
    concurrent_sessions: number().int().nonnegative(),
    concurrent_capacity: number().int().nonnegative(),
    utilization_pct: number(),
    by_email_group: array(
      object({
        email_group: nullable(string()),
        logins: number().int().nonnegative(),
        concurrent: number().int().nonnegative(),
        capacity: number().int().nonnegative()
      })
    )
  })
})
export type TeamsLoginUtilizationResponse = output<typeof teamsLoginUtilizationResponseSchema>

// ============================================================================
// Create form / request
// ============================================================================

export const createTeamsLoginFormSchema = object({
  workspace_id: uuid(),
  name: nameFieldSchema,
  email: emailFieldSchema,
  password: passwordFieldSchema,
  email_group: optional(emailGroupFieldSchema),
  extra: optional(nullable(extraFieldSchema))
})
export type CreateTeamsLoginForm = output<typeof createTeamsLoginFormSchema>

export const createTeamsLoginRequestSchema = createTeamsLoginFormSchema
export type CreateTeamsLoginRequest = output<typeof createTeamsLoginRequestSchema>

// ============================================================================
// Update form / request
// ============================================================================

/**
 * Update form covers rename + password rotation + email_group change. Re-enable
 * is handled via a separate confirmation action (no form). Empty-string
 * email_group clears it; empty-string password means "leave unchanged".
 */
export const updateTeamsLoginFormSchema = object({
  name: optional(union([nameFieldSchema, literal("")])),
  password: optional(union([passwordFieldSchema, literal("")])),
  email_group: optional(union([emailGroupFieldSchema, literal("")])),
  extra: optional(nullable(extraFieldSchema))
})
export type UpdateTeamsLoginForm = output<typeof updateTeamsLoginFormSchema>

export type UpdateTeamsLoginRequest =
  | { name?: string; extra?: Record<string, unknown> | null }
  | { password: string }
  | { email_group: string | "" }
  | { state: "active" }

export const reEnableTeamsLoginRequestSchema = object({
  state: literal("active")
})
export type ReEnableTeamsLoginRequest = output<typeof reEnableTeamsLoginRequestSchema>
