import {
  array,
  boolean,
  email,
  iso,
  nullable,
  number,
  object,
  type output,
  string,
  url,
  enum as zodEnum,
  unknown as zodUnknown
} from "zod"

// Enums
export const alertTypeSchema = zodEnum(
  [
    "daily_bot_cap",
    "token_balance",
    "calendar_connections",
    "bot_join_failed",
    "recording_failed",
    "zoom_credential_error",
    "bot_crash",
    "transcription_failed",
    "calendar_sync_error"
  ],
  {
    message: "Alert type is required"
  }
)
export const alertOperatorSchema = zodEnum(["gte", "lte"], {
  message: "Alert operator is required"
})

// Labels
export const ALERT_TYPE_LABELS: Record<string, string> = {
  daily_bot_cap: "Daily Bot Cap",
  token_balance: "Token Balance",
  calendar_connections: "Calendar Connections",
  bot_join_failed: "Bot Join Failed",
  recording_failed: "Recording Failed",
  zoom_credential_error: "Zoom Credential Error",
  bot_crash: "Bot Crash",
  transcription_failed: "Transcription Failed",
  calendar_sync_error: "Calendar Sync Error"
}

// Alert types gated by feature flags
export const STRIPE_ALERT_TYPES: string[] = ["daily_bot_cap", "token_balance", "calendar_connections"]

// Operational alert types — always available
export const OPERATIONAL_ALERT_TYPES: string[] = [
  "bot_join_failed",
  "recording_failed",
  "zoom_credential_error",
  "bot_crash",
  "transcription_failed",
  "calendar_sync_error"
]

/**
 * Get the alert category for a given alert type
 */
export function getAlertCategory(alertType: string): "threshold" | "operational" {
  return OPERATIONAL_ALERT_TYPES.includes(alertType) ? "operational" : "threshold"
}

export const OPERATOR_LABELS: Record<string, string> = {
  gte: ">=",
  lte: "<="
}

export const MAX_ALERT_EMAIL_RECIPIENTS = 10

// Form schemas — Step 1
export const createAlertRuleStep1Schema = object({
  name: string().trim().min(1, "Name is required").max(255, "Name is too long"),
  alertType: alertTypeSchema,
  operator: alertOperatorSchema,
  value: number().int().min(0, "Value must be a non-negative integer")
}).superRefine((data, ctx) => {
  if (OPERATIONAL_ALERT_TYPES.includes(data.alertType)) {
    if (data.operator !== "gte") {
      ctx.addIssue({
        code: "custom",
        path: ["operator"],
        message: "Operational alerts only support the >= operator"
      })
    }
    if (data.value < 1) {
      ctx.addIssue({
        code: "custom",
        path: ["value"],
        message: "Operational alert value must be at least 1"
      })
    }
  }
})

// Form schemas — Step 2
export const createAlertRuleStep2Schema = object({
  emailRecipients: array(object({ value: email("Invalid email address") })).max(
    MAX_ALERT_EMAIL_RECIPIENTS,
    `Maximum ${MAX_ALERT_EMAIL_RECIPIENTS} recipients`
  ),
  callbackUrl: url("Invalid URL").or(string().length(0)),
  callbackSecret: string().max(256),
  cooldownMinutes: number().int().min(1).max(1440)
})

// Edit uses the same step1 + step2 schemas as create

// Response schemas
export const alertRuleSchema = object({
  id: number(),
  teamId: number(),
  userId: number(),
  uuid: string(),
  name: string(),
  enabled: boolean(),
  category: string(),
  alertType: string(),
  operator: string(),
  value: number(),
  deliveryChannels: zodUnknown(),
  cooldownMinutes: number(),
  createdAt: iso.datetime(),
  updatedAt: iso.datetime()
})

export const listAlertRulesResponseSchema = object({
  success: boolean(),
  data: array(alertRuleSchema).nullable()
})

export const createAlertRuleResponseSchema = object({
  success: boolean(),
  data: object({
    ruleId: string()
  })
})

export const deliveryStatusEntrySchema = object({
  channel: string(),
  success: boolean(),
  error: string().optional()
})

export const alertHistoryEntrySchema = object({
  id: number(),
  teamId: number(),
  alertRuleId: number(),
  uuid: string(),
  alertType: string(),
  category: string(),
  currentValue: number(),
  thresholdValue: number(),
  message: nullable(string()),
  suppressedCount: number(),
  deliveryStatus: array(deliveryStatusEntrySchema).nullable(),
  triggeredAt: iso.datetime(),
  createdAt: iso.datetime()
})

export const listAlertHistoryResponseSchema = object({
  success: boolean(),
  data: array(alertHistoryEntrySchema).nullable(),
  cursor: nullable(string()),
  prev_cursor: nullable(string())
})

export const getAlertRuleDetailsResponseSchema = object({
  success: boolean(),
  data: alertRuleSchema
})

export const testAlertRuleResponseSchema = object({
  success: boolean(),
  data: object({
    deliveryResults: array(deliveryStatusEntrySchema)
  })
})

// Type exports
export type AlertType = output<typeof alertTypeSchema>
export type AlertOperator = output<typeof alertOperatorSchema>
export type CreateAlertRuleStep1Data = output<typeof createAlertRuleStep1Schema>
export type CreateAlertRuleStep2Data = output<typeof createAlertRuleStep2Schema>
export type DeliveryStatusEntry = output<typeof deliveryStatusEntrySchema>
export type AlertRule = output<typeof alertRuleSchema>
export type ListAlertRulesResponse = output<typeof listAlertRulesResponseSchema>
export type CreateAlertRuleResponse = output<typeof createAlertRuleResponseSchema>
export type AlertHistoryEntry = output<typeof alertHistoryEntrySchema>
export type ListAlertHistoryResponse = output<typeof listAlertHistoryResponseSchema>
export type GetAlertRuleDetailsResponse = output<typeof getAlertRuleDetailsResponseSchema>
export type TestAlertRuleResponse = output<typeof testAlertRuleResponseSchema>
