import {
  array,
  boolean,
  iso,
  literal,
  number,
  object,
  type output,
  preprocess,
  string,
  union,
  uuid,
  type ZodTypeAny,
  null as zodNull,
} from "zod";

export const slugSchema = uuid();

export const slugRequestParamsSchema = object({
  slug: slugSchema,
});

export type SlugRequestParams = output<typeof slugRequestParamsSchema>;
export type Slug = output<typeof slugSchema>;

/**
 * Schema for API error response details
 */
const errorDetailItemSchema = object({
  field: string(),
  message: string(),
  code: string(),
});

/**
 * Schema for API error responses
 */
export const errorResponseSchema = object({
  success: literal(false),
  error: string(),
  code: string(),
  details: union([
    string(),
    array(errorDetailItemSchema),
    zodNull(),
  ]).optional(),
});

export type ErrorResponse = output<typeof errorResponseSchema>;

export function integerPreprocess<T extends ZodTypeAny>(schema: T) {
  return preprocess((value) => {
    // Convert null to undefined so .default() will apply
    if (value === null || value === undefined) {
      return undefined;
    }
    if (typeof value === "string") {
      // Handle empty string
      if (value === "") {
        return undefined;
      }
      const parsed = Number.parseInt(value, 10);
      return Number.isNaN(parsed) ? undefined : parsed;
    }
    if (typeof value === "number") {
      return value;
    }
    return undefined;
  }, schema);
}

export const CursorSchema = preprocess(
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
);
