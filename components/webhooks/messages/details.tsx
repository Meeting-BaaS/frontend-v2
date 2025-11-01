"use client";

import { Mail, RotateCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ItemHeading } from "@/components/layout/item-heading";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { NameValuePair } from "@/components/ui/name-value-pair";
import { Spinner } from "@/components/ui/spinner";
import { axiosPostInstance } from "@/lib/api-client";
import { RESEND_WEBHOOK_MESSAGE } from "@/lib/api-routes";
import { formatRelativeDate } from "@/lib/date-helpers";
import { genericError } from "@/lib/errors";
import type { WebhookMessageDetails } from "@/lib/schemas/webhooks";

interface WebhookMessageDetailsProps {
  endpointId: string;
  messageId: string;
  webhookMessage: WebhookMessageDetails;
}

export function ViewWebhookMessageDetails({
  webhookMessage,
  endpointId,
  messageId,
}: WebhookMessageDetailsProps) {
  const [loading, setLoading] = useState(false);

  const handleResendMessage = async () => {
    if (loading) return;

    setLoading(true);
    const data = {
      endpointId,
      messageId,
    };
    try {
      await axiosPostInstance(RESEND_WEBHOOK_MESSAGE, data);
      toast.success("Webhook message resent successfully");
    } catch (error) {
      console.error("Error resending webhook message", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

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
          <Button size="sm" onClick={handleResendMessage} disabled={loading}>
            {loading ? (
              <>
                <Spinner />
                <span>Resending</span>
              </>
            ) : (
              <>
                <RotateCw /> Resend
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid mt-10 md:mt-12 grid-cols-1 md:grid-cols-2 gap-4">
        <NameValuePair
          title="Created At"
          valueClassName="capitalize"
          value={formatRelativeDate(webhookMessage.timestamp)}
        />
        <NameValuePair
          title="Bot UUID"
          value={(webhookMessage.payload?.data?.bot_uuid as string) ?? "N/A"}
        />
      </div>
      <div className="mt-10 flex flex-col gap-2">
        <div className="text-muted-foreground text-xs uppercase">Payload</div>
        <pre className="text-xs border border-dashed rounded-md p-4 relative">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="absolute top-0 right-0 m-1"
          >
            <CopyButton
              text={JSON.stringify(webhookMessage.payload, null, 2)}
            />
          </Button>
          {JSON.stringify(webhookMessage.payload, null, 2)}
        </pre>
      </div>
    </section>
  );
}
