import {
  array,
  literal,
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
