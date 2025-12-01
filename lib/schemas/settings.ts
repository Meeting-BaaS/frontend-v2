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
import { integerPreprocess } from "@/lib/schemas/common";

export const planTypeSchema = zodEnum(["payg", "pro", "scale", "enterprise"]);
export const settingsPageTabsSchema = zodEnum([
  "usage",
  "billing",
  "team",
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
    isV1SubscriptionActive: boolean(),
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

// Usage page search params schemas
export const usagePageSearchParamsSchema = object({
  api_plans: preprocess((value) => {
    if (typeof value === "string") {
      return value === "true";
    }
    return value;
  }, boolean().optional()),
  token_packs: preprocess((value) => {
    if (typeof value === "string") {
      return value === "true";
    }
    return value;
  }, boolean().optional()),
});

// Invoices list schemas
export const listInvoicesRequestQuerySchema = object({
  limit: integerPreprocess(
    number().int().positive().max(100).default(10).nullable(),
  ),
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
export type UsagePageSearchParams = output<typeof usagePageSearchParamsSchema>;

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

// Active subscriptions list schema (from Better Auth)
export const activeSubscriptionSchema = object({
  id: string().optional(),
  status: zodEnum([
    "active",
    "trialing",
    "past_due",
    "incomplete",
    "incomplete_expired",
    "paused",
    "canceled",
    "unpaid",
  ]),
  stripeSubscriptionId: string().optional(),
  cancelAtPeriodEnd: boolean().optional(),
  periodEnd: iso.datetime().optional(),
  periodStart: iso.datetime().optional(),
});

export const listActiveSubscriptionsResponseSchema = array(
  activeSubscriptionSchema,
);

export type ActiveSubscription = output<typeof activeSubscriptionSchema>;
export type ListActiveSubscriptionsResponse = output<
  typeof listActiveSubscriptionsResponseSchema
>;

// V1 token import schemas
export const getV1AvailableTokensResponseSchema = object({
  success: literal(true),
  data: object({
    availableTokens: string(),
    email: string(),
  }),
});

export const importTokensFromV1RequestSchema = object({
  amount: number().positive("Amount must be greater than 0"),
});

export const importTokensFromV1ResponseSchema = object({
  success: literal(true),
  data: object({
    tokensImported: string(),
    newBalance: string(),
  }),
});

export type GetV1AvailableTokensResponse = output<
  typeof getV1AvailableTokensResponseSchema
>;
export type ImportTokensFromV1Request = output<
  typeof importTokensFromV1RequestSchema
>;
export type ImportTokensFromV1Response = output<
  typeof importTokensFromV1ResponseSchema
>;
