import { literal, number, object, type output, string } from "zod";
import { createSupportTicketFormSchema } from "@/lib/schemas/support";

// Create admin support ticket form schema (frontend form)
// Extends the base support ticket form schema (without files) with admin-specific field
export const createAdminSupportTicketFormSchema = createSupportTicketFormSchema
  .omit({ files: true }) // Admin tickets don't support file uploads currently
  .extend({
    createdOnBehalfOfUserId: number().int().positive().min(1, {
      message: "Please select a team member",
    }),
  });

export type CreateAdminSupportTicketFormData = output<
  typeof createAdminSupportTicketFormSchema
>;

// API request body schema (same as form schema)
export const createAdminSupportTicketRequestSchema =
  createAdminSupportTicketFormSchema;

export type CreateAdminSupportTicketRequest = output<
  typeof createAdminSupportTicketRequestSchema
>;

// Create admin support ticket response schema
export const createAdminSupportTicketResponseSchema = object({
  success: literal(true),
  data: object({
    ticketId: string(),
  }),
});

export type CreateAdminSupportTicketResponse = output<
  typeof createAdminSupportTicketResponseSchema
>;
