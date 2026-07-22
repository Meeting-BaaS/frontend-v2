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
  unknown as zodUnknown
} from "zod"
import { isDateBefore } from "@/lib/date-helpers"
import {
  artifactWithSignedUrlSchema,
  botStatusHistoryEntry,
  botStatusSchema,
  callbackErrorSchema,
  meetingPlatformSchema,
  recordingModeSchema,
  speechToTextProviderSchema
} from "@/lib/schemas/bots"
import { CursorSchema, integerPreprocess } from "@/lib/schemas/common"
import {
  moduleEnum as supportTicketModuleEnum,
  statusEnum as supportTicketStatusEnum,
  typeEnum as supportTicketTypeEnum
} from "@/lib/schemas/support"

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
  status: botStatusSchema.catch("UNKNOWN_ERROR")
})

export type AdminBotListItem = output<typeof adminBotListItemSchema>

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
    if (value == null || value === "") return null
    if (typeof value === "string") {
      return value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    }
    return value
  }, array(meetingPlatformSchema).nullable().default(null)),
  status: preprocess((value) => {
    if (value == null || value === "") return null
    if (typeof value === "string") {
      return value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    }
    return value
  }, array(botStatusSchema).nullable().default(null)),
  teamName: string().trim().nullable().default(null),
  teamId: integerPreprocess(number().int().positive()).nullable().default(null)
}).nullable()

export type ListAllBotsRequestQueryParams = output<typeof listAllBotsRequestQuerySchema>

export const listAllBotsResponseSchema = object({
  success: literal(true),
  data: array(adminBotListItemSchema),
  cursor: string().nullable(),
  prev_cursor: string().nullable()
})

export type ListAllBotsResponse = output<typeof listAllBotsResponseSchema>

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
  status: botStatusSchema.catch("UNKNOWN_ERROR"),
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
  artifactsFolderUrl: url().nullable(),
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
  openSupportTickets: number().describe("Number of open support tickets for the bot"),
  participants: array(
    object({
      name: string(),
      id: number().int().nullable(),
      display_name: string().optional(),
      profile_picture: string().optional()
    })
  ).nullable()
})

export type AdminBotDetails = output<typeof adminBotDetailsSchema>

export const getAdminBotDetailsResponseSchema = object({
  success: literal(true),
  data: adminBotDetailsSchema
})

export type GetAdminBotDetailsResponse = output<typeof getAdminBotDetailsResponseSchema>

export const leaveBotResponseSchema = object({
  success: literal(true),
  data: object({
    message: string()
  })
})

export type LeaveBotResponse = output<typeof leaveBotResponseSchema>

// --- Admin Teams Schemas ---

export const adminTeamListItemSchema = object({
  teamId: number().int().positive(),
  teamName: string(),
  teamSlug: string(),
  teamLogo: url().nullable(),
  subscriptionPlan: string(),
  lastBotCreatedAt: iso.datetime().nullable(),
  createdAt: iso.datetime()
})

export type AdminTeamListItem = output<typeof adminTeamListItemSchema>

export const listAllTeamsRequestQuerySchema = object({
  searchEmail: string().trim().nullable().default(null)
}).nullable()

export type ListAllTeamsRequestQueryParams = output<typeof listAllTeamsRequestQuerySchema>

export const listAllTeamsResponseSchema = object({
  success: literal(true),
  data: array(adminTeamListItemSchema),
  cursor: string().nullable(),
  prev_cursor: string().nullable()
})

export type ListAllTeamsResponse = output<typeof listAllTeamsResponseSchema>

export const entitlementPlanSchema = zodEnum(["payg", "pro", "scale", "enterprise"])

export type EntitlementPlan = output<typeof entitlementPlanSchema>

// A negotiated volume commitment: a fixed monthly token grant at a fixed per-token
// rate, with usage beyond the balance billed in arrears at that same rate. Null for
// teams on off-the-shelf token-pack pricing, which is most of them.
export const adminCommitmentSchema = object({
  id: number(),
  teamId: number(),
  monthlyTokens: string(),
  pricePerTokenCents: string(),
  monthlyAmountCents: number(),
  stripeSubscriptionId: string(),
  stripePriceId: string(),
  rollover: boolean(),
  entitlementPlan: entitlementPlanSchema,
  activeFrom: iso.datetime(),
  activeTo: iso.datetime().nullable(),
  notes: string().nullable()
})

export type AdminCommitment = output<typeof adminCommitmentSchema>

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
      createdAt: iso.datetime()
    })
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
  deleted: boolean(),
  deletedAt: iso.datetime().nullable(),
  disabled: boolean(),
  disabledAt: iso.datetime().nullable(),
  disabledReason: string().nullable(),
  commitment: adminCommitmentSchema.nullable()
})

export type AdminTeamDetails = output<typeof adminTeamDetailsSchema>

export const getAdminTeamDetailsResponseSchema = object({
  success: literal(true),
  data: adminTeamDetailsSchema
})

export type GetAdminTeamDetailsResponse = output<typeof getAdminTeamDetailsResponseSchema>

export const updateRateLimitsRequestSchema = object({
  rateLimitPerSecond: number().int().positive().max(20),
  dailyBotCap: number().int().positive(),
  calendarIntegrationsLimit: number().int().positive(),
  dataRetentionDays: number().int().positive(),
  byokTranscriptionEnabled: boolean().optional()
})

export type UpdateRateLimitsRequest = output<typeof updateRateLimitsRequestSchema>

// The recurring charge and the contract rate have to describe the same deal. They
// won't agree to the cent (2632 tokens x 19c = $500.08, while the Stripe price is a
// round $500), so allow a little slack. This is here to catch a unit slip — dollars
// entered where cents are expected — not to enforce exact arithmetic. The backend
// applies the same tolerance; checking here just surfaces it before the round trip.
const COMMITMENT_AMOUNT_TOLERANCE = 0.01

const amountMatchesTokensAndRate = (data: {
  monthlyTokens: number
  pricePerTokenCents: number
  monthlyAmountCents: number
}) => {
  const expected = data.monthlyTokens * data.pricePerTokenCents
  return Math.abs(data.monthlyAmountCents - expected) / expected <= COMMITMENT_AMOUNT_TOLERANCE
}

const AMOUNT_MISMATCH_ISSUE = {
  message:
    "Monthly amount does not match tokens x rate. Both are in cents — check you haven't entered dollars.",
  path: ["monthlyAmountCents"]
}

export const commitmentCollectionMethodSchema = zodEnum(["charge_automatically", "send_invoice"])

// Recording the terms of a Stripe subscription that already exists (its IDs pasted
// in). Used when editing, or when sales set the subscription up by hand.
export const upsertCommitmentRequestSchema = object({
  monthlyTokens: number().positive(),
  pricePerTokenCents: number().positive(),
  monthlyAmountCents: number().int().positive(),
  stripeSubscriptionId: string().trim().min(1, "Stripe subscription ID is required"),
  stripePriceId: string().trim().min(1, "Stripe price ID is required"),
  rollover: boolean(),
  entitlementPlan: entitlementPlanSchema,
  notes: string().trim().optional()
}).refine(amountMatchesTokensAndRate, AMOUNT_MISMATCH_ISSUE)

export type UpsertCommitmentRequest = output<typeof upsertCommitmentRequestSchema>

// Creating the Stripe price + subscription for us, so no IDs — just how it should
// collect payment.
export const provisionCommitmentRequestSchema = object({
  monthlyTokens: number().positive(),
  pricePerTokenCents: number().positive(),
  monthlyAmountCents: number().int().positive(),
  rollover: boolean(),
  entitlementPlan: entitlementPlanSchema,
  notes: string().trim().optional(),
  collectionMethod: commitmentCollectionMethodSchema,
  daysUntilDue: number().int().positive().max(365)
}).refine(amountMatchesTokensAndRate, AMOUNT_MISMATCH_ISSUE)

export type ProvisionCommitmentRequest = output<typeof provisionCommitmentRequestSchema>

// One form drives both flows. `mode` decides which endpoint fires and which fields
// are required — Stripe IDs for "manual", collection terms for "provision".
export const commitmentFormSchema = object({
  mode: zodEnum(["provision", "manual"]),
  monthlyTokens: number().positive(),
  pricePerTokenCents: number().positive(),
  monthlyAmountCents: number().int().positive(),
  rollover: boolean(),
  entitlementPlan: entitlementPlanSchema,
  notes: string().trim().optional(),
  // manual mode only
  stripeSubscriptionId: string().trim().optional(),
  stripePriceId: string().trim().optional(),
  // provision mode only
  collectionMethod: commitmentCollectionMethodSchema,
  daysUntilDue: number().int().positive().max(365)
}).superRefine((data, ctx) => {
  if (!amountMatchesTokensAndRate(data)) {
    ctx.addIssue({ code: "custom", ...AMOUNT_MISMATCH_ISSUE })
  }
  if (data.mode === "manual") {
    if (!data.stripeSubscriptionId?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Stripe subscription ID is required",
        path: ["stripeSubscriptionId"]
      })
    }
    if (!data.stripePriceId?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Stripe price ID is required",
        path: ["stripePriceId"]
      })
    }
  }
})

export type CommitmentFormValues = output<typeof commitmentFormSchema>

export const upsertCommitmentResponseSchema = object({
  success: literal(true),
  data: object({
    message: string(),
    commitment: adminCommitmentSchema
  })
})

export type UpsertCommitmentResponse = output<typeof upsertCommitmentResponseSchema>

export const endCommitmentResponseSchema = object({
  success: literal(true),
  data: object({
    message: string()
  })
})

export type EndCommitmentResponse = output<typeof endCommitmentResponseSchema>

export const updateRateLimitsResponseSchema = object({
  success: literal(true),
  data: object({
    message: string()
  })
})

export type UpdateRateLimitsResponse = output<typeof updateRateLimitsResponseSchema>

export const tokenOperationTypeSchema = zodEnum(["refund", "gift"])

export type TokenOperationType = output<typeof tokenOperationTypeSchema>

export const tokenOperationsRequestSchema = object({
  operation: tokenOperationTypeSchema,
  amount: number().int().positive(),
  reason: string().trim().optional()
})

export type TokenOperationsRequest = output<typeof tokenOperationsRequestSchema>

export const tokenOperationsResponseSchema = object({
  success: literal(true),
  data: object({
    message: string(),
    newBalance: number()
  })
})

export type TokenOperationsResponse = output<typeof tokenOperationsResponseSchema>

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
  updatedAt: iso.datetime(),
  resolvedAt: iso.datetime().nullable()
})

export type AdminSupportTicketListItem = output<typeof adminSupportTicketListItemSchema>

export const listAllSupportTicketsRequestQuerySchema = object({
  limit: integerPreprocess(number().int().positive().max(250).default(50)),
  cursor: CursorSchema,
  status: preprocess((value) => {
    if (value == null || value === "") return null
    if (typeof value === "string") {
      return value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    }
    return value
  }, array(supportTicketStatusEnum).nullable().default(null)),
  module: preprocess((value) => {
    if (value == null || value === "") return null
    if (typeof value === "string") {
      return value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    }
    return value
  }, array(supportTicketModuleEnum).nullable().default(null)),
  type: preprocess((value) => {
    if (value == null || value === "") return null
    if (typeof value === "string") {
      return value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    }
    return value
  }, array(supportTicketTypeEnum).nullable().default(null)),
  teamName: string().trim().nullable().default(null),
  teamId: integerPreprocess(number().int().positive()).nullable().default(null),
  botUuid: uuid().nullable().default(null),
  ticketId: string().trim().nullable().default(null),
  sortBy: zodEnum(["createdAt", "updatedAt"]).default("createdAt")
}).nullable()

export type ListAllSupportTicketsRequestQueryParams = output<
  typeof listAllSupportTicketsRequestQuerySchema
>

export const listAllSupportTicketsResponseSchema = object({
  success: literal(true),
  data: array(adminSupportTicketListItemSchema),
  cursor: string().nullable(),
  prev_cursor: string().nullable()
})

export type ListAllSupportTicketsResponse = output<typeof listAllSupportTicketsResponseSchema>

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
      content: string()
    })
  ),
  attachments: array(
    object({
      s3Key: string(),
      signedUrl: url(),
      fileName: string(),
      uploadedAt: iso.datetime()
    })
  ),
  createdAt: iso.datetime(),
  updatedAt: iso.datetime(),
  resolvedAt: iso.datetime().nullable()
})

export type AdminTicketDetails = output<typeof adminTicketDetailsSchema>

export const getAdminTicketDetailsResponseSchema = object({
  success: literal(true),
  data: adminTicketDetailsSchema
})

export type GetAdminTicketDetailsResponse = output<typeof getAdminTicketDetailsResponseSchema>

export const updateTicketStatusRequestSchema = object({
  status: supportTicketStatusEnum
})

export type UpdateTicketStatusRequest = output<typeof updateTicketStatusRequestSchema>

export const updateTicketStatusResponseSchema = object({
  success: literal(true),
  data: object({
    message: string()
  })
})

export type UpdateTicketStatusResponse = output<typeof updateTicketStatusResponseSchema>

export const adminReplyTicketRequestSchema = object({
  content: string().trim().min(1).max(2000)
})

export type AdminReplyTicketRequest = output<typeof adminReplyTicketRequestSchema>

export const adminReplyTicketResponseSchema = object({
  success: literal(true),
  data: object({
    message: string()
  })
})

export type AdminReplyTicketResponse = output<typeof adminReplyTicketResponseSchema>

// Admin user migration schema
export const adminUserMigrationFormSchema = object({
  botsCreatedAfter: iso.datetime(),
  botsCreatedBefore: iso.datetime()
}).refine(
  (data) => {
    return isDateBefore(data.botsCreatedAfter, data.botsCreatedBefore)
  },
  {
    message: "botsCreatedAfter must be before botsCreatedBefore",
    path: ["botsCreatedAfter"]
  }
)

export type AdminUserMigrationFormData = output<typeof adminUserMigrationFormSchema>

export const adminUserMigrationResponseSchema = object({
  success: literal(true),
  data: object({
    successEmails: array(string()),
    erroredEmails: array(string()),
    totalProcessed: number().int().nonnegative(),
    totalSuccess: number().int().nonnegative(),
    totalErrors: number().int().nonnegative()
  })
})

export type AdminUserMigrationResponse = output<typeof adminUserMigrationResponseSchema>

export const disableTeamRequestSchema = object({
  reason: string().trim().min(3, "Give a reason (min 3 characters)").max(500, "Reason too long")
})
export type DisableTeamRequest = output<typeof disableTeamRequestSchema>
