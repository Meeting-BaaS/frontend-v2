import {
  array,
  boolean,
  iso,
  number,
  object,
  type output,
  string,
  unknown,
  url,
  uuid,
} from "zod";

const webhookIdSchema = uuid().min(1, "Endpoint ID is required");

// Webhook form schemas
export const createWebhookFormSchema = object({
  name: string().trim().max(255, "Name is too long").optional(),
  endpointUrl: url("Please enter a valid URL")
    .min(1, "Endpoint URL is required")
    .max(2048, "URL is too long"),
  events: array(string()).min(1, "At least one event is required"),
});

export const updateWebhookFormSchema = createWebhookFormSchema.extend({
  endpointId: webhookIdSchema,
});

export const disableWebhookEndpointSchema = object({
  endpointId: webhookIdSchema,
});

export const enableWebhookEndpointSchema = object({
  endpointId: webhookIdSchema,
});

export const deleteWebhookEndpointSchema = object({
  endpointId: webhookIdSchema,
});

export const rotateWebhookEndpointSecretSchema = object({
  endpointId: webhookIdSchema,
});

// Webhook endpoint schema
export const webhookEndpoint = object({
  id: number(),
  svixAppId: string(),
  uuid: string(),
  name: string(),
  url: string(),
  events: string().transform((val) => JSON.parse(val)), // Array of event type strings
  enabled: boolean(),
  createdAt: iso.datetime(),
});

// Webhook endpoint with secret (for details)
export const webhookEndpointWithSecret = webhookEndpoint.extend({
  secret: string(),
});

// Response schemas
export const listWebhookEventsResponseSchema = object({
  success: boolean(),
  data: array(string()),
});

export const listWebhookEndpointsResponseSchema = object({
  success: boolean(),
  data: array(webhookEndpoint).nullable(),
});

export const getWebhookEndpointDetailsResponseSchema = object({
  success: boolean(),
  data: webhookEndpointWithSecret,
});

export const createWebhookEndpointResponseSchema = object({
  success: boolean(),
  data: object({
    webhookId: string(),
  }),
});

export const webhookMessage = object({
  id: string(),
  eventType: string().optional(),
  status: string(), // MessageStatus from svix
  createdAt: iso.datetime(),
});

export const listWebhookMessagesResponseSchema = object({
  success: boolean(),
  data: array(webhookMessage).nullable(),
});

export const messageDetails = object({
  id: string(),
  eventType: string(),
  payload: unknown(), // Record<string, unknown>
  timestamp: iso.datetime(),
});

export const getMessageDetailsResponseSchema = object({
  success: boolean(),
  data: messageDetails,
});

// Type exports
export type CreateWebhookFormData = output<typeof createWebhookFormSchema>;
export type UpdateWebhookFormData = output<typeof updateWebhookFormSchema>;
export type WebhookEndpoint = output<typeof webhookEndpoint>;
export type WebhookEndpointWithSecret = output<
  typeof webhookEndpointWithSecret
>;
export type ListWebhookEventsResponse = output<
  typeof listWebhookEventsResponseSchema
>;
export type ListWebhookEndpointsResponse = output<
  typeof listWebhookEndpointsResponseSchema
>;
export type GetWebhookEndpointDetailsResponse = output<
  typeof getWebhookEndpointDetailsResponseSchema
>;
export type CreateWebhookEndpointResponse = output<
  typeof createWebhookEndpointResponseSchema
>;
export type WebhookMessage = output<typeof webhookMessage>;
export type ListWebhookMessagesResponse = output<
  typeof listWebhookMessagesResponseSchema
>;
export type MessageDetails = output<typeof messageDetails>;
export type GetMessageDetailsResponse = output<
  typeof getMessageDetailsResponseSchema
>;
export type DisableWebhookEndpointData = output<
  typeof disableWebhookEndpointSchema
>;
export type EnableWebhookEndpointData = output<
  typeof enableWebhookEndpointSchema
>;
export type DeleteWebhookEndpointData = output<
  typeof deleteWebhookEndpointSchema
>;
export type RotateWebhookEndpointSecretData = output<
  typeof rotateWebhookEndpointSecretSchema
>;
