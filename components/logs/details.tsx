"use client";

import { Logs } from "lucide-react";
import { ItemHeading } from "@/components/layout/item-heading";
import { getStatusVariant } from "@/components/logs/columns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { NameValuePair } from "@/components/ui/name-value-pair";
import { formatRelativeDate } from "@/lib/date-helpers";
import { HTTP_STATUSES } from "@/lib/http-codes";
import type { ApiLogDetails } from "@/lib/schemas/api-logs";

interface LogDetailsProps {
  logDetails: ApiLogDetails;
}

export function ViewLogDetails({ logDetails }: LogDetailsProps) {
  const variants = getStatusVariant(logDetails.responseStatus);

  return (
    <section>
      <div className="flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <ItemHeading
          title={logDetails.method}
          name={logDetails.endpoint}
          nameClassName="text-xl"
          containerClassName="md:flex-1"
          gradientIcon={
            <GradientIcon color={variants.color} size="xl">
              <Logs size={32} />
            </GradientIcon>
          }
        />
      </div>

      <div className="grid mt-10 md:mt-12 md:space-y-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <NameValuePair title="Endpoint" value={logDetails.endpoint} />
        <NameValuePair
          title="Status Code"
          value={
            <Badge variant={variants.badge}>
              {
                HTTP_STATUSES.find((s) => s.value === logDetails.responseStatus)
                  ?.label
              }
            </Badge>
          }
        />
        <NameValuePair title="Method" value={logDetails.method} />
        <NameValuePair
          title="Created At"
          valueClassName="capitalize"
          value={formatRelativeDate(logDetails.createdAt)}
        />
        <NameValuePair title="Duration" value={`${logDetails.durationMs} ms`} />
        <NameValuePair title="User Agent" value={logDetails.userAgent} />
      </div>

      <div className="mt-4 flex flex-col gap-6">
        {/* Request Body */}
        <div className="flex flex-col gap-2">
          <div className="text-muted-foreground text-xs uppercase">
            Request Body
          </div>
          {logDetails.requestBody ? (
            <pre className="text-xs border border-dashed rounded-md p-4 relative overflow-auto max-h-[500px]">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="absolute top-0 right-0 m-1 z-10 bg-background/80 backdrop-blur-sm"
              >
                <CopyButton
                  text={JSON.stringify(logDetails.requestBody, null, 2)}
                />
              </Button>
              {JSON.stringify(logDetails.requestBody, null, 2)}
            </pre>
          ) : (
            <div className="text-sm text-muted-foreground border border-dashed rounded-md p-4">
              No request body
            </div>
          )}
        </div>

        {/* Response Body */}
        <div className="flex flex-col gap-2">
          <div className="text-muted-foreground text-xs uppercase">
            Response Body
          </div>
          {logDetails.responseBody ? (
            <pre className="text-xs border border-dashed rounded-md p-4 relative overflow-auto max-h-[500px]">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="absolute top-0 right-0 m-1 z-10 bg-background/80 backdrop-blur-sm"
              >
                <CopyButton
                  text={JSON.stringify(logDetails.responseBody, null, 2)}
                />
              </Button>
              {JSON.stringify(logDetails.responseBody, null, 2)}
            </pre>
          ) : (
            <div className="text-sm text-muted-foreground border border-dashed rounded-md p-4">
              No response body
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
