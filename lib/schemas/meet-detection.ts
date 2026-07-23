import { array, boolean, number, object, type output, string } from "zod"

export const meetDetectionStatsResponseSchema = object({
  success: boolean(),
  data: object({
    flagged: number(),
    notFlagged: number(),
    total: number(),
    flaggedPct: number(),
    from: string(),
    to: string()
  })
})
export type MeetDetectionStatsResponse = output<typeof meetDetectionStatsResponseSchema>

export const meetDetectionByTeamResponseSchema = object({
  success: boolean(),
  data: array(
    object({
      teamId: number(),
      teamName: string().nullable(),
      flagged: number(),
      total: number(),
      flaggedPct: number()
    })
  )
})
export type MeetDetectionByTeamResponse = output<typeof meetDetectionByTeamResponseSchema>

export const meetDetectionByUserResponseSchema = object({
  success: boolean(),
  data: array(
    object({
      userId: number(),
      email: string().nullable(),
      flagged: number(),
      total: number(),
      flaggedPct: number()
    })
  )
})
export type MeetDetectionByUserResponse = output<typeof meetDetectionByUserResponseSchema>
