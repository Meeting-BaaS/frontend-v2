"use client";

import { Eye, EyeOff, Webhook } from "lucide-react";
import { useState } from "react";
import { DocsButton } from "@/components/layout/docs-button";
import { ItemHeading } from "@/components/layout/item-heading";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import { GradientIcon } from "@/components/ui/gradient-icon";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { NameValuePair } from "@/components/ui/name-value-pair";
import { MessagesTable } from "@/components/webhooks/messages/table";
import { WebhookActions } from "@/components/webhooks/webhook-actions";
import { formatRelativeDate } from "@/lib/date-helpers";
import type {
  WebhookEndpointWithSecret,
  WebhookMessage,
} from "@/lib/schemas/webhooks";

interface WebhookDetailsProps {
  webhookEndpoint: WebhookEndpointWithSecret;
  allWebhookEvents: string[];
  webhookMessages: WebhookMessage[];
  prevIterator: string | null;
  nextIterator: string | null;
}

export function ViewWebhookDetails({
  webhookEndpoint,
  allWebhookEvents,
  webhookMessages,
  prevIterator,
  nextIterator,
}: WebhookDetailsProps) {
  const [show, setShow] = useState(false);
  const eventCount = webhookEndpoint.events.length;
  return (
    <section>
      <div className="flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <ItemHeading
          title={webhookEndpoint.name}
          name={webhookEndpoint.url}
          nameClassName="text-xl"
          containerClassName="md:flex-1"
          gradientIcon={
            <GradientIcon
              color={
                webhookEndpoint.enabled
                  ? "var(--color-green-300)"
                  : "var(--color-gray-300)"
              }
              size="xl"
            >
              <Webhook size={32} />
            </GradientIcon>
          }
        />
        <div className="flex w-full sm:w-auto gap-2 flex-row sm:items-center">
          <DocsButton uriSuffix="api-v2/webhooks" />
          <WebhookActions
            webhookEndpoint={webhookEndpoint}
            allWebhookEvents={allWebhookEvents}
            buttonVariant="outline"
          />
        </div>
      </div>

      <div className="grid mt-10 md:mt-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <NameValuePair
          title="Created At"
          valueClassName="capitalize"
          value={formatRelativeDate(webhookEndpoint.createdAt)}
        />
        <NameValuePair
          title="Status"
          value={
            webhookEndpoint.enabled ? (
              <Badge variant="success">Enabled</Badge>
            ) : (
              <Badge variant="disabled">Disabled</Badge>
            )
          }
        />
        <NameValuePair
          title="Linked Events"
          value={
            <HoverCard openDelay={0}>
              <HoverCardTrigger asChild>
                <Badge variant="secondary" className="cursor-default">
                  {eventCount} {eventCount === 1 ? "event" : "events"}
                </Badge>
              </HoverCardTrigger>
              <HoverCardContent className="w-48 p-1">
                {webhookEndpoint.events.map((event: string) => (
                  <div
                    key={event}
                    className="text-xs text-foreground/80 bg-muted rounded-md p-2 my-1"
                  >
                    {event}
                  </div>
                ))}
              </HoverCardContent>
            </HoverCard>
          }
        />
        <NameValuePair
          title="Signing Secret"
          value={
            <InputGroup className="h-7">
              <InputGroupInput
                name="webhook-secret"
                placeholder="Webhook secret"
                className="disabled:opacity-100"
                value={webhookEndpoint.secret}
                readOnly
                type={show ? "text" : "password"}
                disabled
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="icon-xs"
                  aria-label="Show/Hide API Key"
                  onClick={() => setShow(!show)}
                >
                  {show ? <Eye /> : <EyeOff />}
                </InputGroupButton>
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <InputGroupButton size="icon-xs" asChild>
                  <CopyButton text={webhookEndpoint.secret} />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          }
        />
      </div>
      <MessagesTable
        endpointId={webhookEndpoint.uuid}
        webhookMessages={webhookMessages}
        prevIterator={prevIterator}
        nextIterator={nextIterator}
      />
    </section>
  );
}
