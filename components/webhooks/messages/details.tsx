"use client"

import { Info, Lock, Mail, RotateCw } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { ItemHeading } from "@/components/layout/item-heading"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/ui/copy-button"
import { GradientIcon } from "@/components/ui/gradient-icon"
import { NameValuePair } from "@/components/ui/name-value-pair"
import { Spinner } from "@/components/ui/spinner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { AttemptsTable } from "@/components/webhooks/messages/attempts-table"
import { axiosPostInstance } from "@/lib/api-client"
import { RESEND_WEBHOOK_MESSAGE } from "@/lib/api-routes"
import { formatRelativeDate } from "@/lib/date-helpers"
import { genericError } from "@/lib/errors"
import type { WebhookMessageDetails } from "@/lib/schemas/webhooks"

function isRedactedPayload(
  payload: WebhookMessageDetails["payload"]
): payload is { redacted: true; reason: string; bot_id: string | null } {
  return payload !== null && "redacted" in payload && payload.redacted === true
}

function getBotId(payload: WebhookMessageDetails["payload"]): string | null {
  if (!payload) return null
  if (isRedactedPayload(payload)) return payload.bot_id
  return (payload.data?.bot_id as string) ?? null
}

function ResendButton({
  loading,
  onClick,
  children
}: {
  loading: boolean
  onClick: () => void
  children?: React.ReactNode
}) {
  return (
    <Button size="sm" onClick={onClick} disabled={loading}>
      {loading ? (
        <>
          <Spinner />
          <span>Resending</span>
        </>
      ) : (
        <>
          <RotateCw /> Resend
          {children}
        </>
      )}
    </Button>
  )
}

interface WebhookMessageDetailsProps {
  endpointId: string
  messageId: string
  webhookMessage: WebhookMessageDetails
}

export function ViewWebhookMessageDetails({
  webhookMessage,
  endpointId,
  messageId
}: WebhookMessageDetailsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleResendMessage = async () => {
    if (loading) return

    setLoading(true)
    const data = {
      endpointId,
      messageId
    }
    try {
      await axiosPostInstance(RESEND_WEBHOOK_MESSAGE, data)
      toast.success("Webhook message resent successfully")
      router.refresh()
    } catch (error) {
      console.error("Error resending webhook message", error)
      toast.error(error instanceof Error ? error.message : genericError)
    } finally {
      setLoading(false)
    }
  }

  const isBotCompleted = webhookMessage.eventType === "bot.completed"
  const botId = getBotId(webhookMessage.payload)

  return (
    <section>
      <div className="flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <ItemHeading
          title="Event Type"
          name={webhookMessage.eventType}
          nameClassName="text-xl"
          containerClassName="md:flex-1"
          gradientIcon={
            <GradientIcon color="var(--color-purple-300)" size="xl">
              <Mail size={32} />
            </GradientIcon>
          }
        />
        <div className="flex w-full sm:w-auto gap-2 flex-row sm:items-center">
          {isBotCompleted ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ResendButton loading={loading} onClick={handleResendMessage}>
                    <Info className="ml-1 size-3.5 text-muted-foreground" />
                  </ResendButton>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs text-sm">
                  <p>
                    This replays the original payload. Download URLs may have expired.
                    For fresh URLs, use{" "}
                    {botId ? (
                      <Link href={`/bots/${botId}`} className="underline font-medium">
                        Resend Webhook
                      </Link>
                    ) : (
                      <span className="font-medium">Resend Webhook</span>
                    )}{" "}
                    on the Bot Details page.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <ResendButton loading={loading} onClick={handleResendMessage} />
          )}
        </div>
      </div>

      <div className="grid mt-10 md:mt-12 grid-cols-1 md:grid-cols-2 gap-4">
        <NameValuePair
          title="Created At"
          valueClassName="capitalize"
          value={formatRelativeDate(webhookMessage.timestamp)}
        />
        <NameValuePair
          title="Bot ID"
          value={botId ?? "N/A"}
        />
      </div>

      {webhookMessage.attempts && webhookMessage.attempts.length > 0 && (
        <AttemptsTable attempts={webhookMessage.attempts} />
      )}

      <div className="mt-10 flex flex-col gap-2">
        <div className="text-muted-foreground text-xs uppercase">Payload</div>
        {isRedactedPayload(webhookMessage.payload) ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground border border-dashed rounded-md p-4">
            <Lock className="size-4 shrink-0" />
            <span>{webhookMessage.payload.reason}</span>
          </div>
        ) : (
          <pre className="text-xs border border-dashed rounded-md p-4 relative whitespace-pre-wrap break-words overflow-wrap-anywhere">
            <Button variant="ghost" size="icon" asChild className="absolute top-0 right-0 m-1">
              <CopyButton text={JSON.stringify(webhookMessage.payload, null, 2)} />
            </Button>
            {JSON.stringify(webhookMessage.payload, null, 2)}
          </pre>
        )}
      </div>
    </section>
  )
}
