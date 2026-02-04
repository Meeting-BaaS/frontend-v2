import { boolean, literal, object, type output } from "zod";

const featuresSchema = object({
  stripe: boolean(),
  svix: boolean(),
  calendar: boolean(),
  multitenant: boolean(),
  dashboard: boolean(),
  transcription: boolean(),
  email: boolean(),
});

export const configurationResponseSchema = object({
  success: literal(true),
  data: object({
    selfHosted: boolean(),
    features: featuresSchema,
  }),
});

export type ConfigurationResponse = output<typeof configurationResponseSchema>;
export type Features = output<typeof featuresSchema>;
