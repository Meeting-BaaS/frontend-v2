import {
  array,
  boolean,
  email,
  iso,
  number,
  object,
  type output,
  string,
  enum as zodEnum,
} from "zod";

export const planTypeSchema = zodEnum(["payg", "pro", "scale", "enterprise"]);
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

// Billing schemas
export const subscriptionSchema = object({
  id: string(),
  status: string(),
  currentPeriodEnd: iso.datetime().nullable(),
  cancelAtPeriodEnd: boolean(),
  plan: object({
    name: string(),
    amount: number(),
    currency: string(),
    interval: string(),
  }),
});

export const invoiceSchema = object({
  id: string(),
  number: string().nullable(),
  status: string().nullable(),
  amountDue: number(),
  amountPaid: number(),
  currency: string(),
  created: number(),
  invoicePdf: string().nullable(),
  hostedInvoiceUrl: string().nullable(),
});

export const billingInfoSchema = object({
  billingEmail: string().nullable(),
  subscription: subscriptionSchema,
  invoices: array(invoiceSchema),
});

export const billingInfoResponseSchema = object({
  success: boolean(),
  data: billingInfoSchema,
});

export const updateBillingEmailSchema = object({
  email: email("Invalid email address"),
});

export const customerPortalUrlResponseSchema = object({
  success: boolean(),
  data: object({
    url: string(),
  }),
});

// Plans schemas
export const planInfoSchema = object({
  type: string(),
  name: string(),
  price: number().nullable(),
  interval: zodEnum(["month", "year"]),
  features: array(string()),
  dailyBotCap: number().nullable(),
  rateLimitPerSecond: number().nullable(),
  calendarIntegrationsLimit: number().nullable(),
  dataRetentionDays: number(),
  teamsEnabled: boolean(),
  byokTranscriptionEnabled: boolean(),
  tokenPackDiscount: number(),
});

export const plansDataSchema = object({
  currentPlan: string(),
  currentSubscriptionId: string().nullable(),
  plans: array(planInfoSchema),
});

export const plansResponseSchema = object({
  success: boolean(),
  data: plansDataSchema,
});

export type PlanType = output<typeof planTypeSchema>;
export type SettingsPageTabs = output<typeof settingsPageTabsSchema>;
export type SettingsPageQuery = output<typeof settingsPageQuerySchema>;
export type UsageStats = output<typeof usageStatsSchema>;
export type UsageStatsResponse = output<typeof usageStatsResponseSchema>;
export type Subscription = output<typeof subscriptionSchema>;
export type Invoice = output<typeof invoiceSchema>;
export type BillingInfo = output<typeof billingInfoSchema>;
export type BillingInfoResponse = output<typeof billingInfoResponseSchema>;
export type UpdateBillingEmail = output<typeof updateBillingEmailSchema>;
export type CustomerPortalUrlResponse = output<
  typeof customerPortalUrlResponseSchema
>;
export type PlanInfo = output<typeof planInfoSchema>;
export type PlansData = output<typeof plansDataSchema>;
export type PlansResponse = output<typeof plansResponseSchema>;
