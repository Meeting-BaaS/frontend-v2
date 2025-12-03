"use client";

import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/currency-helpers";
import type { PlanInfo } from "@/lib/schemas/settings";
import { cn } from "@/lib/utils";

interface PlanCardProps {
  plan: PlanInfo;
  currentPlan: string;
  cancelAtPeriodEnd: boolean;
  onSelectPlan: (plan: PlanInfo) => void;
}

// Plan order for comparison
const PLAN_ORDER: Record<string, number> = {
  payg: 0,
  pro: 1,
  scale: 2,
  enterprise: 3,
};

export function PlanCard({
  plan,
  currentPlan,
  cancelAtPeriodEnd,
  onSelectPlan,
}: PlanCardProps) {
  const isCurrentPlan = currentPlan === plan.type;
  const isEnterprise = plan.type === "enterprise";
  const isPayg = plan.type === "payg";
  const currentPlanIsNotPayg = currentPlan !== "payg";
  const isDowngrade =
    PLAN_ORDER[plan.type] < PLAN_ORDER[currentPlan] && !isPayg;

  // Determine button state
  let buttonText = "Upgrade";
  let buttonVariant: "default" | "destructive" | "outline" | "link" = "default";
  let buttonDisabled = false;

  if (isPayg && currentPlanIsNotPayg) {
    buttonText = "Activated upon cancellation";
    buttonVariant = "outline";
    buttonDisabled = true;
  } else if (isCurrentPlan && isPayg) {
    buttonText = "Selected";
    buttonVariant = "outline";
    buttonDisabled = true;
  } else if (isCurrentPlan && cancelAtPeriodEnd) {
    // Show Restore button if subscription is canceled but still active
    buttonText = "Restore";
    buttonVariant = "default";
  } else if (isCurrentPlan) {
    buttonText = "Cancel";
    buttonVariant = "destructive";
  } else if (isDowngrade) {
    buttonText = "Downgrade";
    buttonVariant = "outline";
  }

  const isPopular = plan.type === "scale";

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-lg border p-6",
        isCurrentPlan && "border-baas-primary-500",
      )}
    >
      {isCurrentPlan && (
        <Badge
          variant="default"
          className="absolute -top-3 left-1/2 -translate-x-1/2"
        >
          Current Plan
        </Badge>
      )}
      {isPopular && !isCurrentPlan && (
        <Badge
          variant="secondary"
          className="absolute -top-3 left-1/2 -translate-x-1/2"
        >
          Most Popular
        </Badge>
      )}

      {/* Header */}
      <div className="flex flex-col gap-2 pb-4 border-b">
        <h3 className="text-lg font-semibold capitalize">
          {isPayg ? "Pay as You Go" : plan.name}
        </h3>
        <div className="flex items-baseline gap-1">
          {plan.price === null ? (
            <span className="text-2xl font-bold">Contact us</span>
          ) : (
            <>
              <span className="text-2xl font-bold">
                {formatCurrency(plan.price, "usd")}
              </span>
              <span className="text-sm text-muted-foreground">
                /{plan.interval}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="flex-1 py-4">
        <ul className="space-y-3 text-sm">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <Check className="size-4 text-baas-primary-500 mt-0.5 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t">
        <Button
          variant={buttonVariant}
          className="w-full"
          disabled={buttonDisabled}
          onClick={() => onSelectPlan(plan)}
        >
          {buttonText}
        </Button>
      </div>
      {isEnterprise && (
        <span className="text-xs text-muted-foreground absolute -bottom-6 left-0">
          * Feature coming soon
        </span>
      )}
    </div>
  );
}
