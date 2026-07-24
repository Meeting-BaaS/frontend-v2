"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { PageHeading } from "@/components/layout/page-heading"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { axiosGetInstance } from "@/lib/api-client"
import {
  ADMIN_MEET_DETECTION_BY_ASN,
  ADMIN_MEET_DETECTION_BY_TEAM,
  ADMIN_MEET_DETECTION_BY_USER,
  ADMIN_MEET_DETECTION_STATS,
  ADMIN_MEET_DETECTION_TREND
} from "@/lib/api-routes"
import {
  type MeetDetectionByAsnResponse,
  type MeetDetectionByTeamResponse,
  type MeetDetectionByUserResponse,
  type MeetDetectionStatsResponse,
  type MeetDetectionTrendResponse,
  meetDetectionByAsnResponseSchema,
  meetDetectionByTeamResponseSchema,
  meetDetectionByUserResponseSchema,
  meetDetectionStatsResponseSchema,
  meetDetectionTrendResponseSchema
} from "@/lib/schemas/meet-detection"

const RANGES = [
  { label: "24h", hours: 24 },
  { label: "7d", hours: 24 * 7 },
  { label: "30d", hours: 24 * 30 }
] as const

function rangeQuery(hours: number): string {
  const to = new Date()
  const from = new Date(to.getTime() - hours * 60 * 60 * 1000)
  return `?from=${encodeURIComponent(from.toISOString())}&to=${encodeURIComponent(to.toISOString())}`
}

function pctColor(pct: number): string {
  if (pct >= 20) return "text-destructive"
  if (pct >= 5) return "text-amber-500"
  return "text-emerald-500"
}

export function AdminMeetDetectionView() {
  const [hours, setHours] = useState<number>(24 * 7)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [stats, setStats] = useState<MeetDetectionStatsResponse["data"] | null>(null)
  const [byTeam, setByTeam] = useState<MeetDetectionByTeamResponse["data"]>([])
  const [byUser, setByUser] = useState<MeetDetectionByUserResponse["data"]>([])
  const [byAsn, setByAsn] = useState<MeetDetectionByAsnResponse["data"]>([])
  const [trend, setTrend] = useState<MeetDetectionTrendResponse["data"]>([])
  // Monotonic request id: only the latest fetch may write state, so a slow
  // earlier range can't resolve late and clobber a newer one (or its loading).
  const reqIdRef = useRef(0)

  const fetchAll = useCallback(async () => {
    const reqId = ++reqIdRef.current
    setLoading(true)
    setError(false)
    const qs = rangeQuery(hours)
    try {
      const [s, t, u, a, tr] = await Promise.all([
        axiosGetInstance<MeetDetectionStatsResponse>(
          ADMIN_MEET_DETECTION_STATS(qs),
          meetDetectionStatsResponseSchema
        ),
        axiosGetInstance<MeetDetectionByTeamResponse>(
          ADMIN_MEET_DETECTION_BY_TEAM(qs),
          meetDetectionByTeamResponseSchema
        ),
        axiosGetInstance<MeetDetectionByUserResponse>(
          ADMIN_MEET_DETECTION_BY_USER(qs),
          meetDetectionByUserResponseSchema
        ),
        axiosGetInstance<MeetDetectionByAsnResponse>(
          ADMIN_MEET_DETECTION_BY_ASN(qs),
          meetDetectionByAsnResponseSchema
        ),
        axiosGetInstance<MeetDetectionTrendResponse>(
          ADMIN_MEET_DETECTION_TREND(qs),
          meetDetectionTrendResponseSchema
        )
      ])
      if (reqId !== reqIdRef.current) return // superseded by a newer range
      setStats(s.data)
      setByTeam(t.data)
      setByUser(u.data)
      setByAsn(a.data)
      setTrend(tr.data)
    } catch (err) {
      if (reqId !== reqIdRef.current) return
      console.error("Failed to fetch Meet detection telemetry", err)
      // Distinct error state — do NOT zero the data, or a failed fetch reads as
      // a confirmed clean range.
      setError(true)
    } finally {
      if (reqId === reqIdRef.current) setLoading(false)
    }
  }, [hours])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <PageHeading
          title="Meet Detection"
          description="Google Meet bot-detection rate (detectedAsBot signal from the CreateMeetingDevice RPC)"
        />
        <div className="flex gap-1">
          {RANGES.map((r) => (
            <Button
              key={r.label}
              size="sm"
              variant={hours === r.hours ? "default" : "outline"}
              onClick={() => setHours(r.hours)}
            >
              {r.label}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="flex flex-col items-start gap-3 py-8">
          <p className="text-sm text-destructive">
            Failed to load Meet detection telemetry for this range.
          </p>
          <Button size="sm" variant="outline" onClick={() => fetchAll()}>
            Retry
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Flagged by Meet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-destructive">{stats?.flagged ?? 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Not flagged</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-500">{stats?.notFlagged ?? 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Flagged rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${pctColor(stats?.flaggedPct ?? 0)}`}>
                  {(stats?.flaggedPct ?? 0).toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stats?.total ?? 0} signals
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Flagged-rate trend (per day)</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendChart data={trend} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top flagged networks (ASN)</CardTitle>
            </CardHeader>
            <CardContent>
              <RankTable
                rows={byAsn.map((r) => ({
                  key: String(r.asn),
                  label: `AS${r.asn}${r.provider ? ` · ${r.provider}` : ""}${r.country ? ` · ${r.country}` : ""}`,
                  flagged: r.flagged,
                  total: r.total,
                  pct: r.flaggedPct
                }))}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top flagged teams</CardTitle>
              </CardHeader>
              <CardContent>
                <RankTable
                  rows={byTeam.map((r) => ({
                    key: String(r.teamId),
                    label: r.teamName ?? `Team ${r.teamId}`,
                    flagged: r.flagged,
                    total: r.total,
                    pct: r.flaggedPct
                  }))}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top flagged users</CardTitle>
              </CardHeader>
              <CardContent>
                <RankTable
                  rows={byUser.map((r) => ({
                    key: String(r.userId),
                    label: r.email ?? `User ${r.userId}`,
                    flagged: r.flagged,
                    total: r.total,
                    pct: r.flaggedPct
                  }))}
                />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </section>
  )
}

interface RankRow {
  key: string
  label: string
  flagged: number
  total: number
  pct: number
}

function RankTable({ rows }: { rows: RankRow[] }) {
  const ranked = [...rows].filter((r) => r.flagged > 0).sort((a, b) => b.flagged - a.flagged)
  if (ranked.length === 0) {
    return <div className="text-muted-foreground py-4 text-sm">No flagged bots in this range.</div>
  }
  return (
    <div className="space-y-2">
      {ranked.map((r) => (
        <div key={r.key} className="flex items-center justify-between gap-2 text-sm">
          <span className="truncate">{r.label}</span>
          <span className="flex items-center gap-2 shrink-0">
            <Badge variant="destructive">{r.flagged} flagged</Badge>
            <span className="text-muted-foreground">
              {r.pct.toFixed(0)}% of {r.total}
            </span>
          </span>
        </div>
      ))}
    </div>
  )
}

// Lightweight dependency-free daily flagged-% bar chart. Bar height = flagged
// rate; color grades green→amber→red like the gauge. Empty days (no signals)
// render as a faint zero-height slot so gaps are visible.
function TrendChart({ data }: { data: MeetDetectionTrendResponse["data"] }) {
  if (data.length === 0) {
    return <div className="text-muted-foreground py-4 text-sm">No signals in this range.</div>
  }
  return (
    <div className="flex items-end gap-1 h-32">
      {data.map((d) => {
        const barColor =
          d.flaggedPct >= 20
            ? "bg-destructive"
            : d.flaggedPct >= 5
              ? "bg-amber-500"
              : "bg-emerald-500"
        const heightPct = d.total > 0 ? Math.max(2, d.flaggedPct) : 0
        return (
          <div
            key={d.day}
            className="flex-1 flex flex-col items-center justify-end h-full min-w-0"
            title={`${d.day}: ${d.flaggedPct.toFixed(1)}% flagged (${d.flagged}/${d.total})`}
          >
            <span className="text-[10px] text-muted-foreground mb-0.5">
              {d.total > 0 ? `${Math.round(d.flaggedPct)}%` : ""}
            </span>
            <div
              className={`w-full rounded-t ${d.total > 0 ? barColor : "bg-muted"}`}
              style={{ height: `${heightPct}%` }}
            />
            <span className="text-[10px] text-muted-foreground mt-1 truncate w-full text-center">
              {d.day.slice(5)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
