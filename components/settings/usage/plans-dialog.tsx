"use client";

import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CancelPlanDialog } from "@/components/settings/usage/cancel-plan-dialog";
import { PlanCard } from "@/components/settings/usage/plan-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { usePlans } from "@/hooks/use-plans";
import { useUser } from "@/hooks/use-user";
import { authClient } from "@/lib/auth-client";
import { genericError } from "@/lib/errors";
import type { PlanInfo } from "@/lib/schemas/settings";

interface PlansDialogProps {
  children: React.ReactNode;
}

export function PlansDialog({ children }: PlansDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanInfo | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null);

  // Get plans and subscription ID from context
  const { plans, currentPlan, currentSubscriptionId, loading, refetch } =
    usePlans();
  const { teamDetails } = useUser();

  const handleSelectPlan = async (plan: PlanInfo) => {
    const isCurrentPlan = currentPlan === plan.type;
    const isPAYG = plan.type === "PAYG";
    const isEnterprise = plan.type === "Enterprise";

    // Skip if Enterprise (handled by mailto link)
    if (isEnterprise) {
      return;
    }

    // Skip if disabled states
    if (isPAYG && currentPlan !== "PAYG") {
      return;
    }

    if (isCurrentPlan && isPAYG) {
      return;
    }

    // If cancelling current plan, show cancel dialog
    if (isCurrentPlan && !isPAYG) {
      setSelectedPlan(plan);
      setCancelDialogOpen(true);
      return;
    }

    // For upgrade/downgrade, directly upgrade without confirmation dialog
    try {
      setUpgradingPlan(plan.type);

      // Get the active team ID
      const teamId = teamDetails.find((team) => team.isActive)?.id;

      // Build the upgrade params
      const upgradeParams: {
        plan: string;
        successUrl: string;
        cancelUrl: string;
        subscriptionId?: string;
        returnUrl: string;
        referenceId: string;
      } = {
        plan: plan.type,
        successUrl: `${window.location.origin}/settings/billing?success=true`,
        cancelUrl: `${window.location.origin}/settings/usage`,
        returnUrl: `${window.location.origin}/settings/billing`,
        referenceId: teamId?.toString() ?? "",
      };

      // Always provide subscriptionId if user has an active subscription
      // This prevents Stripe currency mismatch errors by modifying the existing
      // subscription instead of creating a new checkout session
      if (currentSubscriptionId) {
        upgradeParams.subscriptionId = currentSubscriptionId;
      }

      const { data, error } =
        await authClient.subscription.upgrade(upgradeParams);

      if (error || !data) {
        throw new Error(error?.message || "Failed to upgrade plan");
      }

      // Refetch plans to update current plan
      await refetch();

      // If there's a checkout URL, the browser will navigate away
      // Otherwise show success message
      if (data.url) {
        toast.success("Redirecting to checkout...");
        // The redirect happens automatically by better-auth
      } else {
        toast.success("Upgrade successful!");
        setOpen(false);
      }
    } catch (error) {
      console.error("Error upgrading plan", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setUpgradingPlan(null);
    }
  };

  const handleCancelSuccess = () => {
    setCancelDialogOpen(false);
    setSelectedPlan(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="h-[80svh] max-w-6xl sm:max-w-7xl">
        <DialogHeader>
          <DialogTitle>Choose Your Plan</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            Select a plan that fits your needs.{" "}
            <Button variant="link" size="sm" className="p-0 h-auto" asChild>
              <a
                href="https://meetingbaas.com/pricing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 has-[>svg]:!px-0"
              >
                Compare plans
                <ExternalLink className="size-3" />
              </a>
            </Button>
          </DialogDescription>
        </DialogHeader>
        <div className="h-full overflow-y-auto md:pr-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="size-8" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 py-4">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.type}
                  plan={plan}
                  currentPlan={currentPlan}
                  onSelectPlan={handleSelectPlan}
                />
              ))}
            </div>
          )}

          {/* Upgrading overlay */}
          {upgradingPlan && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
              <div className="flex items-center gap-2">
                <Spinner />
                <span className="text-sm text-muted-foreground">
                  Redirecting to checkout...
                </span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>

      {/* Cancel Dialog */}
      <CancelPlanDialog
        open={cancelDialogOpen}
        planName={selectedPlan?.name ?? ""}
        subscriptionId={currentSubscriptionId}
        onOpenChange={(open) => {
          if (!open) {
            setCancelDialogOpen(false);
            setSelectedPlan(null);
          }
        }}
        onSuccess={handleCancelSuccess}
      />
    </Dialog>
  );
}
