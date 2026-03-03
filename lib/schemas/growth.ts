import { boolean, object, string, uuid, enum as zodEnum } from "zod"

export const unsubscribeSearchParamsSchema = object({
  token: uuid(),
  type: zodEnum(["growth"])
})

export const unsubscribeResponseSchema = object({
  success: boolean(),
  message: string()
})
