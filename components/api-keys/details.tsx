"use client";

import { TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { KeyRound } from "lucide-react";
import Link from "next/link";
import { TableActions } from "@/components/api-keys/table-actions";
import { DocsButton } from "@/components/layout/docs-button";
import { ItemHeading } from "@/components/layout/item-heading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { NameValuePair } from "@/components/ui/name-value-pair";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { formatRelativeDate } from "@/lib/date-helpers";
import { type ApiKeyDetails, permissionMap } from "@/lib/schemas/api-keys";

interface ApiKeyDetailsProps {
  apiKeyDetails: ApiKeyDetails;
}

export function ViewApiKeyDetails({ apiKeyDetails }: ApiKeyDetailsProps) {
  const lastRequest = apiKeyDetails.lastRequest
    ? formatRelativeDate(apiKeyDetails.lastRequest)
    : "Never";
  return (
    <section>
      <div className="flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <ItemHeading
          title="API Key"
          name={apiKeyDetails.name ?? "Unnamed"}
          containerClassName="md:flex-1"
          gradientIcon={
            <GradientIcon color="var(--color-orange-300)" size="xl">
              <KeyRound size={32} />
            </GradientIcon>
          }
        />
        <div className="flex w-full sm:w-auto gap-2 flex-row sm:items-center">
          <DocsButton uriSuffix="api-v2/api-keys" />
          <TableActions apiKey={apiKeyDetails} buttonVariant="outline" />
        </div>
      </div>

      <div className="grid mt-10 md:mt-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <NameValuePair
          title="Token"
          value={<Badge variant="secondary">{apiKeyDetails.start}...</Badge>}
        />
        <NameValuePair
          title="Permission"
          value={permissionMap[apiKeyDetails.permissions.access.join("_")]}
        />
        <NameValuePair
          title="Total Uses"
          value={apiKeyDetails.requestCount ?? 0}
        />
        <NameValuePair
          title="Last Used"
          valueClassName="capitalize"
          value={
            apiKeyDetails.requestId ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      className="flex gap-3 items-center decoration-dashed underline hover:decoration-baas-primary-500 hover:decoration-solid"
                      href={`/logs/${apiKeyDetails.requestId?.toString()}`}
                    >
                      {lastRequest}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    View the last used log
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              lastRequest
            )
          }
        />
        <NameValuePair
          title="Created At"
          valueClassName="capitalize"
          value={formatRelativeDate(apiKeyDetails.createdAt)}
        />
        <NameValuePair
          title="Created By"
          value={
            <div className="flex items-center gap-2">
              <Avatar className="size-6">
                <AvatarImage
                  src={apiKeyDetails.creatorImage ?? ""}
                  alt={apiKeyDetails.creatorName}
                />
                <AvatarFallback>
                  {apiKeyDetails.creatorName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span>{apiKeyDetails.creatorName}</span>
            </div>
          }
        />
      </div>
    </section>
  );
}
