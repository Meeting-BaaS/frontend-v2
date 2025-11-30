import {
  array,
  boolean,
  email,
  iso,
  literal,
  number,
  object,
  type output,
  preprocess,
  record,
  string,
  url,
  uuid,
  enum as zodEnum,
  unknown as zodUnknown,
} from "zod";
import {
  artifactWithSignedUrlSchema,
  botStatusHistoryEntry,
  botStatusSchema,
  callbackErrorSchema,
  meetingPlatformSchema,
  recordingModeSchema,
  speechToTextProviderSchema,
} from "@/lib/schemas/bots";
import { CursorSchema, integerPreprocess } from "@/lib/schemas/common";
import {
  moduleEnum as supportTicketModuleEnum,
  statusEnum as supportTicketStatusEnum,
  typeEnum as supportTicketTypeEnum,
} from "@/lib/schemas/support";

// --- Admin Bots Schemas ---

export const adminBotListItemSchema = object({
  botId: uuid(),
  botName: string(),
  teamId: number().int().positive(),
  teamName: string(),
  meetingUrl: url(),
  meetingPlatform: meetingPlatformSchema,
  duration: number().nullable(),
  createdAt: iso.datetime(),
  endedAt: iso.datetime().nullable(),
  joinedAt: iso.datetime().nullable(),
  exitedAt: iso.datetime().nullable(),
  status: botStatusSchema,
});

export type AdminBotListItem = output<typeof adminBotListItemSchema>;

export const listAllBotsRequestQuerySchema = object({
  limit: integerPreprocess(number().int().positive().max(250).default(50)),
  cursor: CursorSchema,
  createdAfter: iso.datetime().nullable().default(null),
  createdBefore: iso.datetime().nullable().default(null),
  endedAfter: iso.datetime().nullable().default(null),
  botName: string().trim().nullable().default(null),
  botId: string().trim().nullable().default(null),
  meetingUrl: string().trim().nullable().default(null),
  meetingPlatform: preprocess((value) => {
    if (value == null || value === "") return null;
    if (typeof value === "string") {
      return value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }
    return value;
  }, array(meetingPlatformSchema).nullable().default(null)),
  status: preprocess((value) => {
    if (value == null || value === "") return null;
    if (typeof value === "string") {
      return value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }
    return value;
  }, array(botStatusSchema).nullable().default(null)),
  teamName: string().trim().nullable().default(null),
  teamId: integerPreprocess(number().int().positive()).nullable().default(null),
}).nullable();

export type ListAllBotsRequestQueryParams = output<
  typeof listAllBotsRequestQuerySchema
>;

export const listAllBotsResponseSchema = object({
  success: literal(true),
  data: array(adminBotListItemSchema),
  cursor: string().nullable(),
  prev_cursor: string().nullable(),
});

export type ListAllBotsResponse = output<typeof listAllBotsResponseSchema>;

export const adminBotDetailsSchema = object({
  botId: uuid(),
  botName: string(),
  teamId: number().int().positive(),
  teamName: string(),
  meetingUrl: url(),
  meetingPlatform: meetingPlatformSchema,
  recordingMode: recordingModeSchema,
  speechToTextProvider: speechToTextProviderSchema,
  extra: record(string(), zodUnknown()).nullable(),
  totalTokens: string().nullable(),
  duration: number().nullable(),
  createdAt: iso.datetime(),
  endedAt: iso.datetime().nullable(),
  joinedAt: iso.datetime().nullable(),
  exitedAt: iso.datetime().nullable(),
  status: botStatusSchema,
  statusHistory: array(botStatusHistoryEntry).nullable(),
  callbackError: callbackErrorSchema.nullable(),
  artifacts: array(artifactWithSignedUrlSchema).nullable(),
  artifactsDeleted: boolean(),
  artifactsDeletedBy: string().nullable(),
  artifactsDeletedAt: iso.datetime().nullable(),
  hasScreenshots: boolean(),
  errorCode: string().nullable(),
  errorMessage: string().nullable(),
  logFileUrl: url().nullable(),
  allowMultipleBots: boolean(),
  audioFrequency: number().nullable(),
  speechToTextApiKeyConfigured: boolean().nullable(),
  transcriptionCustomParams: record(string(), zodUnknown()).nullable(),
  entryMessage: string().nullable(),
  waitingRoomTimeout: number().nullable(),
  noOneJoinedTimeout: number().nullable(),
  zoomAccessTokenUrl: url().nullable(),
  transcriptionFailures: number().nullable(),
  diarizationFailures: number().nullable(),
  videoUploadFailures: number().nullable(),
  audioUploadFailures: number().nullable(),
  logsUploadFailures: number().nullable(),
  recordingTokens: string().nullable(),
  transcriptionTokens: string().nullable(),
  byokTranscriptionTokens: string().nullable(),
  streamingInputTokens: string().nullable(),
  streamingOutputTokens: string().nullable(),
});

export type AdminBotDetails = output<typeof adminBotDetailsSchema>;

export const getAdminBotDetailsResponseSchema = object({
  success: literal(true),
  data: adminBotDetailsSchema,
});

export type GetAdminBotDetailsResponse = output<
  typeof getAdminBotDetailsResponseSchema
>;

export const leaveBotResponseSchema = object({
  success: literal(true),
  data: object({
    message: string(),
  }),
});

export type LeaveBotResponse = output<typeof leaveBotResponseSchema>;

// --- Admin Teams Schemas ---

export const adminTeamListItemSchema = object({
  teamId: number().int().positive(),
  teamName: string(),
  teamSlug: string(),
  teamLogo: url().nullable(),
  subscriptionPlan: string(),
  lastBotCreatedAt: iso.datetime().nullable(),
  createdAt: iso.datetime(),
});

export type AdminTeamListItem = output<typeof adminTeamListItemSchema>;

export const listAllTeamsRequestQuerySchema = object({
  limit: integerPreprocess(number().int().positive().max(250).default(50)),
  cursor: CursorSchema,
  searchEmail: string().trim().nullable().default(null),
  searchTeamName: string().trim().nullable().default(null),
}).nullable();

export type ListAllTeamsRequestQueryParams = output<
  typeof listAllTeamsRequestQuerySchema
>;

export const listAllTeamsResponseSchema = object({
  success: literal(true),
  data: array(adminTeamListItemSchema),
  cursor: string().nullable(),
  prev_cursor: string().nullable(),
});

export type ListAllTeamsResponse = output<typeof listAllTeamsResponseSchema>;

export const adminTeamDetailsSchema = object({
  teamId: number().int().positive(),
  teamName: string(),
  teamSlug: string(),
  teamLogo: url().nullable(),
  createdAt: iso.datetime(),
  members: array(
    object({
      userId: number().int().positive(),
      userName: string(),
      userEmail: email(),
      role: string(),
      createdAt: iso.datetime(),
    }),
  ),
  subscriptionPlan: string(),
  stripeCustomerId: string().nullable(),
  stripeSubscriptionId: string().nullable(),
  rateLimitPerSecond: number().int().positive(),
  dailyBotCap: number().int().positive(),
  calendarIntegrationsLimit: number().int().positive(),
  dataRetentionDays: number().int().positive(),
  availableTokens: string(),
  reservedTokens: string(),
  totalTokensPurchased: string(),
  runningBotsCount: number().int().min(0),
  svixAppId: string(),
  region: string().nullable(),
  byokTranscriptionEnabled: boolean(),
  tokenPackDiscount: number().int().min(0).max(100),
  tokenPackDiscountId: string().nullable(),
  autoPurchaseEnabled: boolean(),
  autoPurchaseTokenThreshold: number().int().positive().nullable(),
  autoPurchasePriceId: string().nullable(),
  customBillingEmail: email().nullable(),
  reminderEmail: email().nullable(),
  reminderEnabled: boolean(),
});

export type AdminTeamDetails = output<typeof adminTeamDetailsSchema>;

export const getAdminTeamDetailsResponseSchema = object({
  success: literal(true),
  data: adminTeamDetailsSchema,
});

export type GetAdminTeamDetailsResponse = output<
  typeof getAdminTeamDetailsResponseSchema
>;

export const updateRateLimitsRequestSchema = object({
  rateLimitPerSecond: number().int().positive().max(20),
  dailyBotCap: number().int().positive(),
  calendarIntegrationsLimit: number().int().positive(),
  dataRetentionDays: number().int().positive(),
});

export type UpdateRateLimitsRequest = output<
  typeof updateRateLimitsRequestSchema
>;

export const updateRateLimitsResponseSchema = object({
  success: literal(true),
  data: object({
    message: string(),
  }),
});

export type UpdateRateLimitsResponse = output<
  typeof updateRateLimitsResponseSchema
>;

export const tokenOperationTypeSchema = zodEnum(["refund", "gift"]);

export type TokenOperationType = output<typeof tokenOperationTypeSchema>;

export const tokenOperationsRequestSchema = object({
  operation: tokenOperationTypeSchema,
  amount: number().int().positive(),
  reason: string().trim().optional(),
});

export type TokenOperationsRequest = output<
  typeof tokenOperationsRequestSchema
>;

export const tokenOperationsResponseSchema = object({
  success: literal(true),
  data: object({
    message: string(),
    newBalance: number(),
  }),
});

export type TokenOperationsResponse = output<
  typeof tokenOperationsResponseSchema
>;

// --- Admin Support Schemas ---

export const adminSupportTicketListItemSchema = object({
  ticketId: string(),
  teamId: number().int().positive(),
  teamName: string(),
  module: supportTicketModuleEnum,
  type: supportTicketTypeEnum,
  subject: string(),
  status: supportTicketStatusEnum,
  botUuid: uuid().nullable(),
  createdAt: iso.datetime(),
  resolvedAt: iso.datetime().nullable(),
});

export type AdminSupportTicketListItem = output<
  typeof adminSupportTicketListItemSchema
>;

export const listAllSupportTicketsRequestQuerySchema = object({
  limit: integerPreprocess(number().int().positive().max(250).default(50)),
  cursor: CursorSchema,
  status: preprocess((value) => {
    if (value == null || value === "") return null;
    if (typeof value === "string") {
      return value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }
    return value;
  }, array(supportTicketStatusEnum).nullable().default(null)),
  module: preprocess((value) => {
    if (value == null || value === "") return null;
    if (typeof value === "string") {
      return value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }
    return value;
  }, array(supportTicketModuleEnum).nullable().default(null)),
  type: preprocess((value) => {
    if (value == null || value === "") return null;
    if (typeof value === "string") {
      return value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }
    return value;
  }, array(supportTicketTypeEnum).nullable().default(null)),
  teamName: string().trim().nullable().default(null),
  teamId: integerPreprocess(number().int().positive()).nullable().default(null),
}).nullable();

export type ListAllSupportTicketsRequestQueryParams = output<
  typeof listAllSupportTicketsRequestQuerySchema
>;

export const listAllSupportTicketsResponseSchema = object({
  success: literal(true),
  data: array(adminSupportTicketListItemSchema),
  cursor: string().nullable(),
  prev_cursor: string().nullable(),
});

export type ListAllSupportTicketsResponse = output<
  typeof listAllSupportTicketsResponseSchema
>;

export const adminTicketDetailsSchema = object({
  ticketId: string(),
  teamId: number().int().positive(),
  teamName: string(),
  module: supportTicketModuleEnum,
  type: supportTicketTypeEnum,
  subject: string(),
  details: string(),
  botUuid: uuid().nullable(),
  status: supportTicketStatusEnum,
  messageChain: array(
    object({
      messageId: uuid(),
      author: string(),
      authorEmail: email(),
      timestamp: iso.datetime(),
      content: string(),
    }),
  ),
  attachments: array(
    object({
      s3Key: string(),
      signedUrl: url(),
      fileName: string(),
      uploadedAt: iso.datetime(),
    }),
  ),
  createdAt: iso.datetime(),
  updatedAt: iso.datetime(),
  resolvedAt: iso.datetime().nullable(),
});

export type AdminTicketDetails = output<typeof adminTicketDetailsSchema>;

export const getAdminTicketDetailsResponseSchema = object({
  success: literal(true),
  data: adminTicketDetailsSchema,
});

export type GetAdminTicketDetailsResponse = output<
  typeof getAdminTicketDetailsResponseSchema
>;

export const updateTicketStatusRequestSchema = object({
  status: supportTicketStatusEnum,
});

export type UpdateTicketStatusRequest = output<
  typeof updateTicketStatusRequestSchema
>;

export const updateTicketStatusResponseSchema = object({
  success: literal(true),
  data: object({
    message: string(),
  }),
});

export type UpdateTicketStatusResponse = output<
  typeof updateTicketStatusResponseSchema
>;
