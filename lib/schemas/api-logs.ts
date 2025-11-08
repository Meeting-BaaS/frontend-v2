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
  unknown as zodUnknown,
} from "zod";
import { isDateBefore } from "@/lib/date-helpers";
import { integerPreprocess } from "@/lib/schemas/common";

export const apiLogMethodSchema = zodEnum([
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
]);

// HTTP status schema for validation
export const httpStatusSchema = integerPreprocess(
  number().int().min(100).max(599),
);

export const ListApiLogsRequestQuerySchema = object({
  limit: integerPreprocess(
    number().int().positive().max(250).default(50).nullable(),
  ),
  createdBefore: iso.datetime().nullable().default(null),
  createdAfter: iso.datetime().nullable().default(null),
  cursor: preprocess(
    (value) => {
      if (value == null || value === "") return null;
      if (typeof value !== "string") return value;

      try {
        // Check for "-" prefix indicating backward pagination
        const isPrevDirection = value.startsWith("-");
        const cursorValue = isPrevDirection ? value.slice(1) : value;

        const decoded = Buffer.from(cursorValue, "base64").toString("utf8");
        const parts = decoded.split("::");
        if (parts.length !== 2) {
          return value; // Let schema validation handle the error
        }
        return {
          createdAt: parts[0],
          id: parts[1] ? Number.parseInt(parts[1], 10) : null,
          isPrevDirection,
        };
      } catch {
        // Return original value to let schema validation handle the error
        return value;
      }
    },
    object({
      createdAt: iso.datetime(),
      id: number().int().positive(),
      isPrevDirection: boolean().default(false),
    })
      .nullable()
      .default(null),
  ),
  responseStatus: preprocess((value) => {
    if (value == null) return null;
    if (typeof value === "string") {
      return value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .map((s) => Number.parseInt(s, 10));
    }
    return value;
  }, array(httpStatusSchema).min(1).nullable().default(null)),
  apiKeyId: preprocess((value) => {
    if (value == null || value === "") return null;
    if (typeof value === "string") {
      return Number.parseInt(value, 10);
    }
    return value;
  }, number().int().positive().nullable().default(null)),
})
  .refine(
    (data) => {
      // Only validate if both dates are provided
      if (data.createdAfter && data.createdBefore) {
        return isDateBefore(data.createdAfter, data.createdBefore);
      }
      return true;
    },
    {
      message: "createdAfter must be before createdBefore",
      path: ["createdAfter"],
    },
  )
  .nullable();

export const apiLogListEntry = object({
  id: number().int().positive(),
  endpoint: string(),
  responseStatus: httpStatusSchema,
  method: apiLogMethodSchema,
  createdAt: iso.datetime(),
});

export const apiLogsListResponseSchema = object({
  data: array(apiLogListEntry),
  success: boolean(),
  cursor: string().nullable(),
  prevCursor: string().nullable(),
});

export const apiLogDetailsSchema = object({
  id: number().int().positive(),
  endpoint: string(),
  method: apiLogMethodSchema,
  responseStatus: httpStatusSchema,
  durationMs: number().int().positive(),
  userAgent: string().nullable(),
  requestBody: zodUnknown().nullable(),
  responseBody: zodUnknown().nullable(),
  createdAt: iso.datetime(),
});

export const apiLogDetailsResponseSchema = object({
  data: apiLogDetailsSchema,
  success: boolean(),
});

export type ListApiLogsRequestQueryParams = output<
  typeof ListApiLogsRequestQuerySchema
>;
export type ApiLogListEntry = output<typeof apiLogListEntry>;
export type ApiLogsListResponse = output<typeof apiLogsListResponseSchema>;
export type ApiLogDetails = output<typeof apiLogDetailsSchema>;
export type ApiLogDetailsResponse = output<typeof apiLogDetailsResponseSchema>;
