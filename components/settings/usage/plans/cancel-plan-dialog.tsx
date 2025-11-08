"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { genericError } from "@/lib/errors";

interface CancelPlanDialogProps {
  open: boolean;
  planName: string;
  subscriptionId: string | null;
  onOpenChange: (open: boolean) => void;
}

export function CancelPlanDialog({
  open,
  planName,
  subscriptionId,
  onOpenChange,
}: CancelPlanDialogProps) {
  const [typedText, setTypedText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCancel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading || typedText !== "cancel" || !subscriptionId) return;

    try {
      setLoading(true);

      const { data, error } = await authClient.subscription.cancel({
        subscriptionId,
        returnUrl: `${window.location.origin}/settings/billing`,
      });

      if (error || !data) {
        throw new Error(error?.message || "Failed to cancel subscription");
      }
      // Better Auth will handle the cancellation and redirect to the return URL
      toast.success("Redirecting to cancellation page...");
    } catch (error) {
      console.error("Error canceling subscription", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  const onCloseDialog = (updatedOpen: boolean) => {
    if (updatedOpen || loading) {
      return;
    }
    setTypedText("");
    onOpenChange(updatedOpen);
  };

  return (
    <Dialog open={open} onOpenChange={onCloseDialog}>
      <DialogContent className="sm:max-w-md" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Cancel {planName} Plan</DialogTitle>
          <DialogDescription className="sr-only">
            Confirm cancellation of your subscription
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCancel} noValidate>
          <div className="space-y-6 pb-8">
            <div className="flex flex-col gap-1">
              <p>Are you sure you want to cancel your {planName} plan?</p>
              <p className="text-sm text-muted-foreground">
                Your subscription will remain active until the end of your
                current billing period. You'll still have access to all features
                until then.
              </p>
            </div>

            <Field>
              <FieldLabel htmlFor="cancel-confirmation">
                Type{" "}
                <Badge
                  variant="warning"
                  className="flex items-center gap-2 py-1 text-sm"
                >
                  cancel
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-3 [&_svg]:size-3 [&_svg]:text-foreground"
                    asChild
                  >
                    <CopyButton text="cancel" />
                  </Button>
                </Badge>{" "}
                to confirm
              </FieldLabel>
              <FieldContent>
                <Input
                  value={typedText}
                  id="cancel-confirmation"
                  onChange={(e) => setTypedText(e.target.value)}
                  disabled={loading}
                  aria-label="Type 'cancel' to confirm"
                  aria-required="true"
                />
              </FieldContent>
            </Field>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading}>
                Keep Plan
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant="destructive"
              disabled={loading || typedText !== "cancel"}
              aria-busy={loading}
              aria-disabled={loading}
              aria-label={loading ? "Canceling..." : "Cancel Plan"}
            >
              {loading ? (
                <>
                  <Spinner /> Canceling...
                </>
              ) : (
                "Cancel Plan"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
