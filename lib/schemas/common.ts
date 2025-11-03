import { object, type output, uuid } from "zod";

export const slugSchema = uuid();

export const slugRequestParamsSchema = object({
  slug: slugSchema,
});

export type SlugRequestParams = output<typeof slugRequestParamsSchema>;
export type Slug = output<typeof slugSchema>;
