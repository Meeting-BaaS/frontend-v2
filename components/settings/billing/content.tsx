"use client";

import { ArrowUpRight, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BillingEmailForm } from "@/components/settings/billing/email-form";
import { InvoiceTable } from "@/components/settings/billing/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { axiosGetInstance } from "@/lib/api-client";
import { GET_CUSTOMER_PORTAL_URL } from "@/lib/api-routes";
import { formatCurrency } from "@/lib/currency-helpers";
import { formatISODateString } from "@/lib/date-helpers";
import { genericError } from "@/lib/errors";
import type {
  BillingInfo,
  CustomerPortalUrlResponse,
} from "@/lib/schemas/settings";
import { customerPortalUrlResponseSchema } from "@/lib/schemas/settings";

interface BillingContentProps {
  billingInfo: BillingInfo;
}

export function BillingContent({ billingInfo }: BillingContentProps) {
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);
  const planName =
    billingInfo.subscription.plan.name === "payg"
      ? "Pay as You Go"
      : billingInfo.subscription.plan.name;

  const handleOpenPortal = async () => {
    if (isLoadingPortal) return;
    try {
      setIsLoadingPortal(true);
      const response = await axiosGetInstance<CustomerPortalUrlResponse>(
        GET_CUSTOMER_PORTAL_URL,
        customerPortalUrlResponseSchema,
      );

      if (!response || !response.success) {
        throw new Error("Failed to get customer portal URL");
      }

      // Open Stripe customer portal in a new tab
      window.open(response.data.url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error opening customer portal", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setIsLoadingPortal(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 mt-10">
      {/* Active Subscription Section */}
      <div className="flex flex-col border-b pb-8 gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-md md:text-lg font-semibold">
            Active Subscription
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Your current subscription plan and billing details.
          </p>
        </div>
        <div className="flex flex-col items-start justify-center md:items-center md:flex-row gap-2">
          <div className="grow">
            <Badge
              variant={
                billingInfo.subscription.plan.name === "payg"
                  ? "warning"
                  : "primary"
              }
              className="text-sm capitalize"
            >
              {planName}
            </Badge>
          </div>
          <div className="flex flex-row items-center gap-3">
            {billingInfo.subscription.currentPeriodEnd ? (
              <Badge variant="secondary">
                {billingInfo.subscription.cancelAtPeriodEnd
                  ? "Expires"
                  : "Renews"}{" "}
                {formatISODateString(
                  billingInfo.subscription.currentPeriodEnd,
                  "MMM d",
                )}
              </Badge>
            ) : null}
            <span className="text-sm">
              {formatCurrency(
                billingInfo.subscription.plan.amount,
                billingInfo.subscription.plan.currency,
              )}{" "}
              / {billingInfo.subscription.plan.interval}
            </span>
            <Button variant="ghost" size="icon">
              <MoreHorizontal />
            </Button>
          </div>
        </div>
      </div>

      {/* Billing Email Section */}
      <div className="flex flex-col border-b pb-8 gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg md:text-xl font-semibold">Billing Email</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Update the email address where you want to receive billing
            notifications and invoices.
          </p>
        </div>
        <div className="flex flex-col w-1/3">
          <BillingEmailForm defaultEmail={billingInfo.billingEmail} />
        </div>
      </div>

      {/* Payment Method Section */}
      <div className="flex flex-col border-b pb-8 md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg md:text-xl font-semibold">
            Payment & Billing
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            To update your payment method, billing address, and Tax ID, use the
            Stripe Customer Portal.
          </p>
          <div className="mt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleOpenPortal}
              disabled={isLoadingPortal}
            >
              {isLoadingPortal ? (
                <>
                  <Spinner /> Loading...
                </>
              ) : (
                <>
                  Open Customer Portal
                  <ArrowUpRight className="size-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Invoices Section */}
      <div className="flex flex-col pb-8 gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg md:text-xl font-semibold">Invoices</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            View and download your past invoices.
          </p>
        </div>
        <InvoiceTable invoices={billingInfo.invoices} />
      </div>
    </div>
  );
}
