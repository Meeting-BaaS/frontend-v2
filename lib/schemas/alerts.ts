import {
  array,
  boolean,
  email,
  iso,
  nullable,
  number,
  object,
  type output,
  preprocess,
  string,
  url,
  enum as zodEnum,
  unknown as zodUnknown
} from "zod"

// Enums
export const alertTypeSchema = zodEnum(["daily_bot_cap", "token_balance", "calendar_connections"], {
  message: "Alert type is required"
})
export const alertOperatorSchema = zodEnum(["gte", "lte"], {
  message: "Alert operator is required"
})

// Labels
export const ALERT_TYPE_LABELS: Record<string, string> = {
  daily_bot_cap: "Daily Bot Cap",
  token_balance: "Token Balance",
  calendar_connections: "Calendar Connections"
}

export const OPERATOR_LABELS: Record<string, string> = {
  gte: ">=",
  lte: "<="
}

// Form schemas — Step 1
export const createAlertRuleStep1Schema = object({
  name: string().trim().min(1, "Name is required").max(255, "Name is too long"),
  alertType: alertTypeSchema,
  operator: alertOperatorSchema,
  value: number().int().min(0, "Value must be a non-negative integer")
})

// Preprocess semicolon-separated string into trimmed email array
const emailRecipientsSchema = preprocess((value) => {
  if (Array.isArray(value)) return value
  if (typeof value !== "string" || value.trim() === "") return []
  return value
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}, array(email("Invalid email address")).max(10, "Maximum 10 recipients"))

// Form schemas — Step 2
export const createAlertRuleStep2Schema = object({
  emailRecipients: emailRecipientsSchema,
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
  deliveryStatus: zodUnknown(),
  triggeredAt: iso.datetime(),
  createdAt: iso.datetime()
})

export const listAlertHistoryResponseSchema = object({
  success: boolean(),
  data: array(alertHistoryEntrySchema).nullable(),
  nextCursor: nullable(string())
})

export const getAlertRuleDetailsResponseSchema = object({
  success: boolean(),
  data: alertRuleSchema
})

export const testAlertRuleResponseSchema = object({
  success: boolean(),
  data: object({
    deliveryResults: array(
      object({
        channel: string(),
        success: boolean(),
        error: string().optional()
      })
    )
  })
})

// Type exports
export type AlertType = output<typeof alertTypeSchema>
export type AlertOperator = output<typeof alertOperatorSchema>
export type CreateAlertRuleStep1Data = output<typeof createAlertRuleStep1Schema>
export type CreateAlertRuleStep2Data = output<typeof createAlertRuleStep2Schema>
export type AlertRule = output<typeof alertRuleSchema>
export type ListAlertRulesResponse = output<typeof listAlertRulesResponseSchema>
export type CreateAlertRuleResponse = output<typeof createAlertRuleResponseSchema>
export type AlertHistoryEntry = output<typeof alertHistoryEntrySchema>
export type ListAlertHistoryResponse = output<typeof listAlertHistoryResponseSchema>
export type GetAlertRuleDetailsResponse = output<typeof getAlertRuleDetailsResponseSchema>
export type TestAlertRuleResponse = output<typeof testAlertRuleResponseSchema>
