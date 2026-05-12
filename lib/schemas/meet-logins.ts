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
 * Meet Login Types
 */
export const meetLoginStateSchema = zodEnum(["active", "invalid"])
export type MeetLoginState = output<typeof meetLoginStateSchema>

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

const emailGroupFieldSchema = email({
  error: "Email group must be a valid email address"
})
  .trim()
  .max(254, "Email group is too long")

// ============================================================================
// Response schemas
// ============================================================================

export const meetLoginSchema = object({
  credential_id: uuid(),
  workspace_id: uuid(),
  name: string(),
  email: string(),
  email_group: nullable(string()),
  state: meetLoginStateSchema,
  failure_data: optional(zodUnknown()),
  last_error_message: nullable(string()),
  last_error_at: nullable(iso.datetime()),
  last_used_at: nullable(iso.datetime()),
  active_session_count: number().int().nonnegative(),
  extra: nullable(extraFieldSchema),
  created_at: iso.datetime(),
  updated_at: iso.datetime()
})
export type MeetLogin = output<typeof meetLoginSchema>

export const meetLoginListResponseSchema = object({
  success: boolean(),
  data: array(meetLoginSchema)
})
export type MeetLoginListResponse = output<typeof meetLoginListResponseSchema>

export const meetLoginSingleResponseSchema = object({
  success: boolean(),
  data: meetLoginSchema
})
export type MeetLoginSingleResponse = output<typeof meetLoginSingleResponseSchema>

export const deleteMeetLoginResponseSchema = object({
  success: boolean(),
  data: object({ message: string() })
})
export type DeleteMeetLoginResponse = output<typeof deleteMeetLoginResponseSchema>

// ============================================================================
// Utilization
// ============================================================================

export const meetLoginUtilizationResponseSchema = object({
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
export type MeetLoginUtilizationResponse = output<typeof meetLoginUtilizationResponseSchema>

// ============================================================================
// Create form / request
// ============================================================================

export const createMeetLoginFormSchema = object({
  workspace_id: uuid(),
  name: nameFieldSchema,
  email: emailFieldSchema,
  email_group: optional(emailGroupFieldSchema),
  extra: optional(nullable(extraFieldSchema))
})
export type CreateMeetLoginForm = output<typeof createMeetLoginFormSchema>

export const createMeetLoginRequestSchema = createMeetLoginFormSchema
export type CreateMeetLoginRequest = output<typeof createMeetLoginRequestSchema>

// ============================================================================
// Update form / request
// ============================================================================

/**
 * Update form covers rename + email_group change. Re-enable is handled via a
 * separate confirmation action (no form). Empty-string email_group clears it.
 */
export const updateMeetLoginFormSchema = object({
  name: optional(nameFieldSchema),
  email_group: optional(union([emailGroupFieldSchema, literal("")])),
  extra: optional(nullable(extraFieldSchema))
})
export type UpdateMeetLoginForm = output<typeof updateMeetLoginFormSchema>

export type UpdateMeetLoginRequest =
  | { name?: string; extra?: Record<string, unknown> | null }
  | { email_group: string | "" }
  | { state: "active" }

export const reEnableMeetLoginRequestSchema = object({
  state: literal("active")
})
export type ReEnableMeetLoginRequest = output<typeof reEnableMeetLoginRequestSchema>
