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
 * Meet Workspace Types
 */
export const meetWorkspaceStateSchema = zodEnum(["active", "invalid"])
export type MeetWorkspaceState = output<typeof meetWorkspaceStateSchema>

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

const certPemFieldSchema = string().trim().min(1, "Certificate PEM is required")

const privateKeyPemFieldSchema = string().trim().min(1, "Private key PEM is required")

// ============================================================================
// Response schemas
// ============================================================================

export const meetWorkspaceSchema = object({
  workspace_id: uuid(),
  name: string(),
  domain: string(),
  cert_pem: string(),
  state: meetWorkspaceStateSchema,
  failure_data: optional(zodUnknown()),
  last_error_message: nullable(string()),
  last_error_at: nullable(iso.datetime()),
  extra: nullable(extraFieldSchema),
  created_at: iso.datetime(),
  updated_at: iso.datetime()
})
export type MeetWorkspace = output<typeof meetWorkspaceSchema>

export const meetWorkspaceListResponseSchema = object({
  success: boolean(),
  data: array(meetWorkspaceSchema)
})
export type MeetWorkspaceListResponse = output<typeof meetWorkspaceListResponseSchema>

export const meetWorkspaceSingleResponseSchema = object({
  success: boolean(),
  data: meetWorkspaceSchema
})
export type MeetWorkspaceSingleResponse = output<typeof meetWorkspaceSingleResponseSchema>

export const deleteMeetWorkspaceResponseSchema = object({
  success: boolean(),
  data: object({ message: string() })
})
export type DeleteMeetWorkspaceResponse = output<typeof deleteMeetWorkspaceResponseSchema>

// ============================================================================
// Create form schema — branches on generate_keypair toggle (UI-only flag)
// ============================================================================

export const createMeetWorkspaceFormSchema = object({
  name: nameFieldSchema,
  domain: domainFieldSchema,
  generate_keypair: boolean(),
  cert_pem: optional(certPemFieldSchema),
  private_key_pem: optional(privateKeyPemFieldSchema),
  extra: optional(nullable(extraFieldSchema))
}).refine(
  (data) => {
    if (data.generate_keypair) return true
    return !!data.cert_pem && !!data.private_key_pem
  },
  {
    message: "Certificate and private key are required when not generating a keypair",
    path: ["cert_pem"]
  }
)
export type CreateMeetWorkspaceForm = output<typeof createMeetWorkspaceFormSchema>

/**
 * Request body for POST /v2/meet-workspaces (BFF). One of two shapes:
 * - { name, domain, generate_keypair: true }
 * - { name, domain, cert_pem, private_key_pem }
 * The dialog assembles this from the form before calling axios.
 */
export type CreateMeetWorkspaceRequest =
  | {
      name: string
      domain: string
      generate_keypair: true
      extra?: Record<string, unknown> | null
    }
  | {
      name: string
      domain: string
      cert_pem: string
      private_key_pem: string
      extra?: Record<string, unknown> | null
    }

// ============================================================================
// Update name form (rename only)
// ============================================================================

export const updateMeetWorkspaceNameFormSchema = object({
  name: nameFieldSchema,
  extra: optional(nullable(extraFieldSchema))
})
export type UpdateMeetWorkspaceNameForm = output<typeof updateMeetWorkspaceNameFormSchema>

// ============================================================================
// Rotate keypair form
// ============================================================================

export const rotateMeetWorkspaceKeypairFormSchema = object({
  cert_pem: certPemFieldSchema,
  private_key_pem: privateKeyPemFieldSchema
})
export type RotateMeetWorkspaceKeypairForm = output<typeof rotateMeetWorkspaceKeypairFormSchema>

// ============================================================================
// Update request body (server-side; one PATCH endpoint accepts any subset)
// ============================================================================

export type UpdateMeetWorkspaceRequest =
  | { name?: string; extra?: Record<string, unknown> | null }
  | { cert_pem: string; private_key_pem: string }
  | { state: "active" }

// ============================================================================
// Re-enable request body (subset of UpdateMeetWorkspaceRequest)
// ============================================================================

export const reEnableMeetWorkspaceRequestSchema = object({
  state: literal("active")
})
export type ReEnableMeetWorkspaceRequest = output<typeof reEnableMeetWorkspaceRequestSchema>
