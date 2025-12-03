import { object, output, url } from "zod";

export const sendBotFormSchema = object({
  meeting_url: url("Enter a valid meeting URL"),
});

export type SendBotFormValues = output<typeof sendBotFormSchema>;


