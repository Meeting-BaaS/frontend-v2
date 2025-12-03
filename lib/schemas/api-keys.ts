import {
  array,
  boolean,
  iso,
  number,
  object,
  type output,
  preprocess,
  string,
  enum as zodEnum,
} from "zod";

export const permissionsEnum = ["Full access", "Sending access"] as const;

// Transform the permissions array from backend to frontend enum
export const permissionMap: Record<string, (typeof permissionsEnum)[number]> = {
  read_write_delete: "Full access",
  write: "Sending access",
} as const;

export const createAPIKeyFormSchema = object({
  name: string().trim().min(1, "Please enter name").max(50, "Name is too long"),
  permissions: zodEnum(permissionsEnum),
});

export const apiKey = object({
  id: string(),
  name: string(),
  start: string(),
  prefix: string(),
  enabled: boolean(),
  requestCount: number(),
  lastRequest: iso.datetime().nullable(),
  expiresAt: iso.datetime().nullable(),
  createdAt: iso.datetime(),
  updatedAt: iso.datetime(),
  permissions: object({
    access: array(zodEnum(["read", "write", "delete"])),
  }),
  metadata: object({
    teamId: number(),
    rateLimit: number(),
  }).nullable(),
});

export const createApiKeyResponseSchema = object({
  success: boolean(),
  data: apiKey.extend({
    key: string(),
  }),
});

export const apiKeyListResponseSchema = object({
  success: boolean(),
  data: array(apiKey).nullable(),
});

export const apiKeyDetails = apiKey
  .extend({
    creatorName: string(),
    creatorImage: string().nullable(),
    requestId: number().int().positive().nullable(),
  })
  .omit({
    metadata: true,
  });

// API Key slug utility
// The slug is a combination of the timestamp and the id of the API key separated by an "A" character
// This is done to avoid exposing API key ID which is incremented sequentially
// Just a redundancy, as the endpoint is protected.
export const getApiKeyDetailsRequestParamsSchema = object({
  slug: preprocess(
    (value) => {
      if (typeof value !== "string") return value;

      const parts = value.split("A");
      if (parts.length !== 2) return value;

      const id = Number.parseInt(parts[0], 10);
      const timestamp = Number.parseInt(parts[1], 10);
      return { id, timestamp };
    },
    object({
      id: number().int().positive(),
      timestamp: number().int().positive(),
    }),
  ),
});

export const getApiKeyDetailsResponseSchema = object({
  success: boolean(),
  data: apiKeyDetails,
});

export type CreateAPIKeyFormData = output<typeof createAPIKeyFormSchema>;
export type ApiKey = output<typeof apiKey>;
export type ApiKeyListResponse = output<typeof apiKeyListResponseSchema>;
export type CreateApiKeyResponse = output<typeof createApiKeyResponseSchema>;
export type ApiKeyDetails = output<typeof apiKeyDetails>;
export type GetApiKeyDetailsRequestParams = output<
  typeof getApiKeyDetailsRequestParamsSchema
>;
export type GetApiKeyDetailsResponse = output<
  typeof getApiKeyDetailsResponseSchema
>;
