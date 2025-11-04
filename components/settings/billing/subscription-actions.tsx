"use client";

import { CircleArrowUp, MoreHorizontal, RotateCcw, Trash } from "lucide-react";
import { useRef, useState } from "react";
import { CancelPlanDialog } from "@/components/settings/usage/cancel-plan-dialog";
import { PlansDialog } from "@/components/settings/usage/plans-dialog";
import { RestorePlanDialog } from "@/components/settings/usage/restore-plan-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePlans } from "@/hooks/use-plans";
import type { BillingInfo } from "@/lib/schemas/settings";

interface SubscriptionActionsProps {
  billingInfo: BillingInfo;
}

export function SubscriptionActions({ billingInfo }: SubscriptionActionsProps) {
  const plansDialogTriggerRef = useRef<HTMLButtonElement>(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  const { currentSubscriptionId } = usePlans();

  const planName = billingInfo.subscription.plan.name;
  const isPayg = planName === "payg";
  const isEnterprise = planName === "enterprise";
  const cancelAtPeriodEnd = billingInfo.subscription.cancelAtPeriodEnd;

  // Show upgrade for all non-enterprise plans
  const showUpgrade = !isEnterprise;

  // Show cancel for non-PAYG plans that are not already canceled
  const showCancel = !isPayg && !cancelAtPeriodEnd;

  // Show restore for non-PAYG plans that are canceled but still active
  const showRestore = !isPayg && cancelAtPeriodEnd;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {showUpgrade && (
            <DropdownMenuItem
              onClick={() => {
                // Programmatically trigger the plans dialog
                plansDialogTriggerRef.current?.click();
              }}
            >
              <CircleArrowUp /> Upgrade subscription
            </DropdownMenuItem>
          )}
          {showCancel && (
            <DropdownMenuItem
              className="text-destructive hover:!text-destructive hover:!bg-destructive/10"
              onClick={() => setOpenCancelDialog(true)}
            >
              <Trash className="text-destructive" /> Cancel subscription
            </DropdownMenuItem>
          )}
          {showRestore && (
            <DropdownMenuItem onClick={() => setOpenRestoreDialog(true)}>
              <RotateCcw /> Restore subscription
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Plans Dialog */}
      {showUpgrade && (
        <PlansDialog>
          <Button
            ref={plansDialogTriggerRef}
            variant="ghost"
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
          >
            Open Plans Dialog
          </Button>
        </PlansDialog>
      )}

      {/* Cancel Dialog */}
      {showCancel && (
        <CancelPlanDialog
          open={openCancelDialog}
          planName={planName}
          subscriptionId={currentSubscriptionId}
          onOpenChange={setOpenCancelDialog}
        />
      )}

      {/* Restore Dialog */}
      {showRestore && (
        <RestorePlanDialog
          open={openRestoreDialog}
          planName={planName}
          subscriptionId={currentSubscriptionId}
          onOpenChange={setOpenRestoreDialog}
          onSuccess={() => setOpenRestoreDialog(false)}
        />
      )}
    </>
  );
}
