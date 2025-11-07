import {
  array,
  boolean,
  discriminatedUnion,
  email,
  iso,
  literal,
  number,
  object,
  type output,
  preprocess,
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
    autoPurchaseTokenThreshold: number().nullable(),
    autoPurchasePriceId: string().nullable(),
    reminderEnabled: boolean(),
    reminderThreshold: number().nullable(),
    reminderEmail: string().nullable(),
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
  byokTranscriptionEnabled: boolean(),
  tokenPackDiscount: number(),
});

export const plansDataSchema = object({
  currentPlan: string(),
  currentSubscriptionId: string().nullable(),
  cancelAtPeriodEnd: boolean(),
  plans: array(planInfoSchema),
});

export const plansResponseSchema = object({
  success: boolean(),
  data: plansDataSchema,
});

// Invoices list schemas
export const listInvoicesRequestQuerySchema = object({
  limit: preprocess((value) => {
    if (value == null) return value;
    if (typeof value === "string") {
      return Number.parseInt(value, 10);
    }
    return value;
  }, number().int().positive().max(100).default(10).nullable()),
  starting_after: string().optional(),
  ending_before: string().optional(),
});

export const invoicesListResponseSchema = object({
  success: boolean(),
  data: array(invoiceSchema),
  hasMore: boolean(),
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
export type ListInvoicesRequestQueryParams = output<
  typeof listInvoicesRequestQuerySchema
>;
export type InvoicesListResponse = output<typeof invoicesListResponseSchema>;

// Token packs schemas
export const tokenPackSchema = object({
  id: string(),
  name: string(),
  tokens: number().int().positive(),
  originalPrice: number().int().positive(), // in cents (before discount)
  priceId: string(),
  discountPercentage: number().int().min(0).max(100), // discount percentage (0-100)
});

export const tokenPacksResponseSchema = object({
  success: boolean(),
  data: array(tokenPackSchema),
});

// Token settings schemas - using discriminated unions
export const updateAutoRefillSettingsSchema = discriminatedUnion("enabled", [
  object({
    enabled: literal(false),
  }),
  object({
    enabled: literal(true),
    threshold: number().int().positive().min(1, "Threshold must be at least 1"),
    priceId: string().min(
      1,
      "Token pack price ID is required when enabling auto-refill",
    ),
  }),
]);

export const updateReminderSettingsSchema = discriminatedUnion("enabled", [
  object({
    enabled: literal(false),
  }),
  object({
    enabled: literal(true),
    threshold: number().int().positive().min(1, "Threshold must be at least 1"),
    email: email("Invalid email address"),
  }),
]);

export type TokenPack = output<typeof tokenPackSchema>;
export type TokenPacksResponse = output<typeof tokenPacksResponseSchema>;
export type UpdateAutoRefillSettings = output<
  typeof updateAutoRefillSettingsSchema
>;
export type UpdateReminderSettings = output<
  typeof updateReminderSettingsSchema
>;

// Token purchase schemas
export const purchaseTokenPackSchema = object({
  priceId: string().min(1, "Price ID is required"),
});

export const purchaseTokenPackResponseSchema = object({
  success: literal(true),
  data: object({
    hostedInvoiceUrl: string(),
  }),
});

export type PurchaseTokenPack = output<typeof purchaseTokenPackSchema>;
export type PurchaseTokenPackResponse = output<
  typeof purchaseTokenPackResponseSchema
>;
