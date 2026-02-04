import { boolean, email, iso, number, object, type output, string, enum as zodEnum } from "zod"

export const session = object({
  expiresAt: iso.datetime(),
  token: string(),
  createdAt: iso.datetime(),
  updatedAt: iso.datetime(),
  ipAddress: string().nullable(),
  userAgent: string().nullable(),
  userId: string().transform((str) => Number.parseInt(str, 10)),
  impersonatedBy: string().nullable(),
  activeOrganizationId: string()
    .transform((str) => Number.parseInt(str, 10))
    .nullable(),
  id: string().transform((str) => Number.parseInt(str, 10))
})

export const user = object({
  name: string(),
  email: email(),
  emailVerified: boolean(),
  image: string().nullable(),
  createdAt: iso.datetime(),
  updatedAt: iso.datetime(),
  role: zodEnum(["user", "admin"]).nullable().default("user"),
  banned: boolean(),
  banReason: string().nullable(),
  banExpires: iso.datetime().nullable(),
  stripeCustomerId: string().nullable().optional(),
  lastActiveTeamId: number().nullable(),
  id: string().transform((str) => Number.parseInt(str, 10))
})

export const sessionResponseSchema = object({
  session: session,
  user: user
}).nullable()

export type SessionResponse = output<typeof sessionResponseSchema>
export type Session = output<typeof session>
export type User = output<typeof user>
