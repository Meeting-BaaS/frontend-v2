import {
  array,
  literal,
  object,
  type output,
  string,
  union,
  uuid,
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
