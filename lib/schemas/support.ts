import {
  array,
  email,
  iso,
  literal,
  object,
  type output,
  string,
  uuid,
  enum as zodEnum,
  instanceof as zodInstanceOf,
} from "zod";

// File validation constants
export const MAX_SUPPORT_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const MAX_SUPPORT_FILES = 5;
export const ALLOWED_SUPPORT_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
  "text/plain",
] as const;

// Module enum
export const moduleEnum = zodEnum(["bots", "calendars", "billing", "general"]);
export type Module = output<typeof moduleEnum>;

// Type enum
export const typeEnum = zodEnum([
  "bug",
  "feature_request",
  "support",
  "billing",
]);
export type Type = output<typeof typeEnum>;

// Status enum
export const statusEnum = zodEnum([
  "open",
  "awaiting_client",
  "awaiting_agent",
  "resolved",
  "in_progress",
  "closed",
]);
export type Status = output<typeof statusEnum>;

// Support ticket file schema
// Use a function to avoid referencing File at module evaluation time (server-side compatibility)
export const supportTicketFileSchema =
  typeof File !== "undefined"
    ? zodInstanceOf(File, {
        message: "Invalid file",
      })
        .refine(
          (file: File) =>
            ALLOWED_SUPPORT_FILE_TYPES.includes(
              file.type as (typeof ALLOWED_SUPPORT_FILE_TYPES)[number],
            ),
          {
            message: `File type must be one of: ${ALLOWED_SUPPORT_FILE_TYPES.join(", ")}`,
          },
        )
        .refine((file: File) => file.size <= MAX_SUPPORT_FILE_SIZE, {
          message: `File size must be less than ${MAX_SUPPORT_FILE_SIZE / 1024 / 1024}MB`,
        })
    : (null as any); // Server-side placeholder (won't be used)

// Create support ticket form schema (frontend form with files)
export const createSupportTicketFormSchema = object({
  module: moduleEnum,
  type: typeEnum,
  subject: string()
    .min(1, "Please enter a subject")
    .max(200, "Subject must be less than 200 characters"),
  details: string()
    .min(1, "Please enter a message")
    .max(2000, "Message must be less than 2000 characters"),
  botUuid: uuid().optional(),
  files: array(supportTicketFileSchema)
    .max(MAX_SUPPORT_FILES, `Maximum ${MAX_SUPPORT_FILES} files allowed`)
    .optional(),
});

export type CreateSupportTicketFormData = output<
  typeof createSupportTicketFormSchema
>;

export const supportTicketMessageChainSchema = object({
  messageId: uuid(),
  author: string(),
  authorEmail: email(),
  timestamp: iso.datetime(),
  content: string(),
});

export type SupportTicketMessageChain = output<
  typeof supportTicketMessageChainSchema
>;

// Support ticket response schema
export const supportTicketSchema = object({
  ticketId: string(),
  module: moduleEnum,
  subject: string().trim().min(1).max(200),
  status: statusEnum,
  botUuid: uuid().nullable(),
  createdAt: iso.datetime(),
  resolvedAt: iso.datetime().nullable(),
});

export type SupportTicket = output<typeof supportTicketSchema>;

// List support tickets response schema
export const listSupportTicketsResponseSchema = object({
  success: literal(true),
  data: array(supportTicketSchema),
});

export type ListSupportTicketsResponse = output<
  typeof listSupportTicketsResponseSchema
>;

// Create support ticket response schema
export const createSupportTicketResponseSchema = object({
  success: literal(true),
  data: object({
    ticketId: string(),
  }),
});

export type CreateSupportTicketResponse = output<
  typeof createSupportTicketResponseSchema
>;

// Get ticket details request query schema
export const getTicketDetailsRequestQuerySchema = object({
  ticketId: string().min(1),
});

export type GetTicketDetailsRequestQuery = output<
  typeof getTicketDetailsRequestQuerySchema
>;

// Ticket attachment with signed URL
export const ticketAttachmentSchema = object({
  s3Key: string(),
  signedUrl: string(),
  fileName: string(),
  uploadedAt: iso.datetime(),
});

export type TicketAttachment = output<typeof ticketAttachmentSchema>;

// Ticket details response schema
export const ticketDetailsSchema = object({
  ticketId: string(),
  module: moduleEnum,
  type: typeEnum,
  subject: string(),
  details: string(),
  botUuid: uuid().nullable(),
  status: statusEnum,
  messageChain: array(supportTicketMessageChainSchema),
  attachments: array(ticketAttachmentSchema),
  createdAt: iso.datetime(),
  updatedAt: iso.datetime(),
  resolvedAt: iso.datetime().nullable(),
});

export type TicketDetails = output<typeof ticketDetailsSchema>;

export const getTicketDetailsResponseSchema = object({
  success: literal(true),
  data: ticketDetailsSchema,
});

export type GetTicketDetailsResponse = output<
  typeof getTicketDetailsResponseSchema
>;

// Ticket slug request params schema (for route params validation)
export const ticketSlugRequestParamsSchema = object({
  slug: string().min(1),
});

export type TicketSlugRequestParams = output<
  typeof ticketSlugRequestParamsSchema
>;

// Update ticket request schema
export const updateTicketFormSchema = object({
  content: string()
    .min(1, "Please enter a message")
    .max(2000, "Message must be less than 2000 characters"),
});

export type UpdateTicketFormData = output<typeof updateTicketFormSchema>;

export const updateTicketResponseSchema = object({
  success: literal(true),
  data: ticketDetailsSchema,
});

export type UpdateTicketResponse = output<typeof updateTicketResponseSchema>;

// Update ticket status request schema
export const updateTicketStatusSchema = object({
  ticketId: string().min(1),
  status: statusEnum,
});

export type UpdateTicketStatusRequest = output<typeof updateTicketStatusSchema>;

export const updateTicketStatusResponseSchema = object({
  success: literal(true),
});

export type UpdateTicketStatusResponse = output<
  typeof updateTicketStatusResponseSchema
>;

// Upload attachments form schema
export const uploadAttachmentsFormSchema = object({
  files: array(supportTicketFileSchema)
    .min(1, "Please select at least one file")
    .max(MAX_SUPPORT_FILES, `Maximum ${MAX_SUPPORT_FILES} files allowed`),
});

export type UploadAttachmentsFormData = output<
  typeof uploadAttachmentsFormSchema
>;

// Module labels for display
export const moduleLabels: Record<Module, string> = {
  bots: "Bots",
  calendars: "Calendars",
  billing: "Billing",
  general: "General",
};

// Status labels for display
export const statusLabels: Record<Status, string> = {
  open: "Open",
  awaiting_client: "Awaiting Client",
  awaiting_agent: "Awaiting Agent",
  resolved: "Resolved",
  in_progress: "In Progress",
  closed: "Closed",
};

// Type labels for display
export const typeLabels: Record<Type, string> = {
  bug: "Bug",
  feature_request: "Feature Request",
  support: "Support",
  billing: "Billing",
};
