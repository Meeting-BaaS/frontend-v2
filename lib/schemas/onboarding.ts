import { object, output, string, url } from "zod";
import { speechToTextProviderSchema } from "@/lib/schemas/bots";

const baseSendBotFormSchema = object({
  meeting_url: url("Enter a valid meeting URL"),
  provider: speechToTextProviderSchema,
  provider_api_key: string().optional(),
});

export const sendBotFormSchema = baseSendBotFormSchema.refine(
  (data) => {
    // Require API key for non-default providers (except "none")
    if (data.provider !== "gladia" && data.provider !== "none") {
      return !!data.provider_api_key?.trim();
    }
    return true;
  },
  {
    message: "API key is required for this provider",
    path: ["provider_api_key"],
  },
);

export type SendBotFormValues = output<typeof baseSendBotFormSchema>;


