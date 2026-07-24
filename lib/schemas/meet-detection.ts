import { array, boolean, int, number, object, type output, string } from "zod"

export const meetDetectionStatsResponseSchema = object({
  success: boolean(),
  data: object({
    flagged: int().nonnegative(),
    notFlagged: int().nonnegative(),
    total: int().nonnegative(),
    flaggedPct: number().nonnegative(),
    from: string(),
    to: string()
  })
})
export type MeetDetectionStatsResponse = output<typeof meetDetectionStatsResponseSchema>

export const meetDetectionByTeamResponseSchema = object({
  success: boolean(),
  data: array(
    object({
      teamId: int(),
      teamName: string().nullable(),
      flagged: int().nonnegative(),
      total: int().nonnegative(),
      flaggedPct: number().nonnegative()
    })
  )
})
export type MeetDetectionByTeamResponse = output<typeof meetDetectionByTeamResponseSchema>

export const meetDetectionByUserResponseSchema = object({
  success: boolean(),
  data: array(
    object({
      userId: int(),
      email: string().nullable(),
      flagged: int().nonnegative(),
      total: int().nonnegative(),
      flaggedPct: number().nonnegative()
    })
  )
})
export type MeetDetectionByUserResponse = output<typeof meetDetectionByUserResponseSchema>

export const meetDetectionByAsnResponseSchema = object({
  success: boolean(),
  data: array(
    object({
      asn: int(),
      country: string().nullable(),
      provider: string().nullable(),
      flagged: int().nonnegative(),
      total: int().nonnegative(),
      flaggedPct: number().nonnegative()
    })
  )
})
export type MeetDetectionByAsnResponse = output<typeof meetDetectionByAsnResponseSchema>

export const meetDetectionTrendResponseSchema = object({
  success: boolean(),
  data: array(
    object({
      day: string(),
      flagged: int().nonnegative(),
      total: int().nonnegative(),
      flaggedPct: number().nonnegative()
    })
  )
})
export type MeetDetectionTrendResponse = output<typeof meetDetectionTrendResponseSchema>
