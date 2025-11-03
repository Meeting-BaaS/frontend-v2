import {
  boolean,
  iso,
  number,
  object,
  type output,
  string,
  enum as zodEnum,
} from "zod";

export const planTypeSchema = zodEnum(["PAYG", "Pro", "Scale", "Enterprise"]);
export const settingsPageTabsSchema = zodEnum([
  "usage",
  "billing",
  "team",
  "emails",
  "integrations",
]);

export const settingsPageQuerySchema = object({
  tab: settingsPageTabsSchema.default("usage"),
});

export const usageStatsSchema = object({
  plan: object({
    type: planTypeSchema,
    name: string(),
    dailyBotCap: number().nullable(),
    calendarIntegrationsLimit: number().nullable(),
    rateLimitPerSecond: number().nullable(),
    dataRetentionDays: number(),
    byokTranscriptionEnabled: boolean(),
    autoPurchaseEnabled: boolean(),
    tokenThreshold: number().nullable(),
    autoPurchaseTokenPackId: string().nullable(),
    autoPurchasePriceId: string().nullable(),
    stripeCustomerId: string(),
  }),
  usage: object({
    botsCreatedToday: number(),
    calendarIntegrations: number(),
  }),
  tokens: object({
    totalPurchased: number(),
    totalUsed: number(),
    available: number(),
    reserved: number(),
  }),
  lastTokenPurchase: object({
    tokensPurchased: number(),
    isGift: boolean(),
    isRefund: boolean(),
    createdAt: iso.datetime(),
  }),
});

export const usageStatsResponseSchema = object({
  success: boolean(),
  data: usageStatsSchema,
});

export type PlanType = output<typeof planTypeSchema>;
export type SettingsPageTabs = output<typeof settingsPageTabsSchema>;
export type SettingsPageQuery = output<typeof settingsPageQuerySchema>;
export type UsageStats = output<typeof usageStatsSchema>;
export type UsageStatsResponse = output<typeof usageStatsResponseSchema>;
