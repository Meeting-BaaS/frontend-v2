import {
  array,
  boolean,
  number,
  object,
  type output,
  string,
  unknown as zodUnknown,
} from "zod";

// ============================================================================
// Constants & Labels (mirrors backend types)
// ============================================================================

export const ALERT_RULE_TYPES = ["threshold", "event"] as const;

export const THRESHOLD_RESOURCES = [
  "daily_bot_cap",
  "token_balance",
  "calendar_connections",
] as const;

export const THRESHOLD_OPERATORS = ["gte", "lte"] as const;

export const ALERT_EVENT_TYPES = [
  "bot_crashed",
  "bot_timeout",
  "bot_rejected",
  "bot_cannot_join",
  "recording_failed",
  "streaming_setup_failed",
  "transcription_failed",
  "calendar_sync_error",
  "timeout_waiting_to_start",
  "meeting_ended_before_join",
  "insufficient_tokens",
  "daily_bot_cap_reached",
] as const;

export const THRESHOLD_RESOURCE_LABELS: Record<string, string> = {
  daily_bot_cap: "Daily Bot Cap",
  token_balance: "Token Balance",
  calendar_connections: "Calendar Connections",
};

export const THRESHOLD_OPERATOR_LABELS: Record<string, string> = {
  gte: ">=",
  lte: "<=",
};

export const THRESHOLD_OPERATOR_FULL_LABELS: Record<string, string> = {
  gte: "Greater than or equal to",
  lte: "Less than or equal to",
};

export const ALERT_EVENT_TYPE_LABELS: Record<string, string> = {
  bot_crashed: "Bot Crashed",
  bot_timeout: "Bot Timeout",
  bot_rejected: "Bot Rejected",
  bot_cannot_join: "Bot Cannot Join",
  recording_failed: "Recording Failed",
  streaming_setup_failed: "Streaming Setup Failed",
  transcription_failed: "Transcription Failed",
  calendar_sync_error: "Calendar Sync Error",
  timeout_waiting_to_start: "Timeout Waiting to Start",
  meeting_ended_before_join: "Meeting Ended Before Join",
  insufficient_tokens: "Insufficient Tokens",
  daily_bot_cap_reached: "Daily Bot Cap Reached",
};

// ============================================================================
// Response Schemas
// ============================================================================

const alertChannelsSchema = object({
  email: array(string()).optional(),
  webhook: object({
    url: string(),
    secret: string().optional(),
  }).optional(),
});

export const alertRuleSchema = object({
  id: string(),
  name: string(),
  enabled: boolean(),
  type: string(),
  resource: string().nullable().optional(),
  operator: string().nullable().optional(),
  threshold: number().nullable().optional(),
  eventType: string().nullable().optional(),
  channels: alertChannelsSchema,
  cooldownMinutes: number(),
  suppressedCount: number(),
  lastTriggeredAt: string().nullable(),
  createdAt: string(),
  updatedAt: string(),
});

export const alertHistoryRecordSchema = object({
  id: string(),
  ruleId: string(),
  ruleName: string(),
  triggeredAt: string(),
  channel: string(),
  status: string(),
  payload: zodUnknown().nullable(),
  message: string().nullable().optional(),
  httpStatus: number().nullable().optional(),
  emailTo: string().nullable().optional(),
  error: string().nullable().optional(),
  createdAt: string(),
});

// ============================================================================
// API Response Schemas
// ============================================================================

export const listAlertRulesResponseSchema = object({
  success: boolean(),
  data: array(alertRuleSchema),
});

export const getAlertRuleDetailsResponseSchema = object({
  success: boolean(),
  data: alertRuleSchema,
});

export const createAlertRuleResponseSchema = object({
  success: boolean(),
  data: object({
    ruleId: string(),
  }),
});

export const updateAlertRuleResponseSchema = object({
  success: boolean(),
  data: object({
    ruleId: string(),
  }),
});

export const listAlertHistoryResponseSchema = object({
  success: boolean(),
  data: array(alertHistoryRecordSchema),
});

// ============================================================================
// Form Schema
// ============================================================================

export const alertRuleFormSchema = object({
  name: string()
    .trim()
    .min(1, "Name is required")
    .max(255, "Name is too long"),
  type: string().min(1, "Type is required"),
  // Threshold fields
  resource: string().optional(),
  operator: string(),
  threshold: string(),
  // Event fields
  eventType: string().optional(),
  // Channel fields
  emailAddresses: string(),
  webhookUrl: string(),
  webhookSecret: string().max(256, "Secret is too long"),
  // Cooldown
  cooldownMinutes: string(),
}).superRefine((data, ctx) => {
  if (data.type === "threshold") {
    if (!data.resource) {
      ctx.addIssue({
        code: "custom",
        path: ["resource"],
        message: "Resource is required",
      });
    }
    const t = Number.parseInt(data.threshold, 10);
    if (Number.isNaN(t) || t < 0) {
      ctx.addIssue({
        code: "custom",
        path: ["threshold"],
        message: "Threshold must be a non-negative number",
      });
    }
  }
  if (data.type === "event") {
    if (!data.eventType) {
      ctx.addIssue({
        code: "custom",
        path: ["eventType"],
        message: "Event type is required",
      });
    }
  }
  // Validate channels
  const hasEmail = data.emailAddresses.trim().length > 0;
  const hasWebhook = data.webhookUrl.trim().length > 0;
  if (!hasEmail && !hasWebhook) {
    ctx.addIssue({
      code: "custom",
      path: ["emailAddresses"],
      message: "At least one delivery channel (email or webhook) is required",
    });
  }
  // Validate email format
  if (hasEmail) {
    const emails = data.emailAddresses
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);
    if (emails.length > 10) {
      ctx.addIssue({
        code: "custom",
        path: ["emailAddresses"],
        message: "Maximum 10 email addresses per rule",
      });
    }
    for (const email of emails) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        ctx.addIssue({
          code: "custom",
          path: ["emailAddresses"],
          message: `Invalid email: ${email}`,
        });
        break;
      }
    }
  }
  // Validate webhook URL
  if (hasWebhook) {
    try {
      new URL(data.webhookUrl);
    } catch {
      ctx.addIssue({
        code: "custom",
        path: ["webhookUrl"],
        message: "Invalid URL",
      });
    }
  }
  // Validate cooldown
  const cd = Number.parseInt(data.cooldownMinutes, 10);
  if (Number.isNaN(cd) || cd < 1 || cd > 1440) {
    ctx.addIssue({
      code: "custom",
      path: ["cooldownMinutes"],
      message: "Cooldown must be between 1 and 1,440 minutes (24 hours)",
    });
  }
});

// ============================================================================
// Helper: Transform form data to API payload
// ============================================================================

export function transformFormToApiPayload(
  data: AlertRuleFormData,
  ruleId?: string,
) {
  const channels: Record<string, unknown> = {};
  const emails = data.emailAddresses
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  if (emails.length > 0) {
    channels.email = emails;
  }
  if (data.webhookUrl.trim()) {
    const webhook: Record<string, string> = { url: data.webhookUrl.trim() };
    if (data.webhookSecret.trim()) {
      webhook.secret = data.webhookSecret.trim();
    }
    channels.webhook = webhook;
  }

  const isUpdate = !!ruleId;

  const base: Record<string, unknown> = {
    name: data.name,
    channels,
    cooldownMinutes: Number.parseInt(data.cooldownMinutes, 10) || 60,
  };

  // Only send type on create, not on update (type is immutable)
  if (!isUpdate) {
    base.type = data.type;
  }

  if (ruleId) {
    base.ruleId = ruleId;
  }

  if (data.type === "threshold") {
    return {
      ...base,
      resource: data.resource,
      operator: data.operator,
      threshold: Number.parseInt(data.threshold, 10),
    };
  }

  return {
    ...base,
    eventType: data.eventType,
  };
}

// ============================================================================
// Helper: Transform API rule data to form defaults
// ============================================================================

export function ruleToFormDefaults(rule: AlertRule): AlertRuleFormData {
  const emails = rule.channels.email?.join(", ") ?? "";
  const webhookUrl = rule.channels.webhook?.url ?? "";
  const webhookSecret = rule.channels.webhook?.secret ?? "";

  return {
    name: rule.name,
    type: rule.type,
    resource: rule.resource ?? undefined,
    operator: rule.operator ?? "gte",
    threshold: rule.threshold != null ? String(rule.threshold) : "",
    eventType: rule.eventType ?? undefined,
    emailAddresses: emails,
    webhookUrl,
    webhookSecret,
    cooldownMinutes: String(rule.cooldownMinutes),
  };
}

// ============================================================================
// Type Exports
// ============================================================================

export type AlertRule = output<typeof alertRuleSchema>;
export type AlertHistoryRecord = output<typeof alertHistoryRecordSchema>;
export type ListAlertRulesResponse = output<typeof listAlertRulesResponseSchema>;
export type GetAlertRuleDetailsResponse = output<typeof getAlertRuleDetailsResponseSchema>;
export type CreateAlertRuleResponse = output<typeof createAlertRuleResponseSchema>;
export type UpdateAlertRuleResponse = output<typeof updateAlertRuleResponseSchema>;
export type ListAlertHistoryResponse = output<typeof listAlertHistoryResponseSchema>;
export type AlertRuleFormData = output<typeof alertRuleFormSchema>;
