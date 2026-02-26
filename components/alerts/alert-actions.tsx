"use client";

import { MoreHorizontal, Pause, Pencil, Play, Send, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { DeleteAlertRuleDialog } from "@/components/alerts/delete";
import { EditAlertRuleDialog } from "@/components/alerts/edit";
import { axiosPatchInstance, axiosPostInstance } from "@/lib/api-client";
import {
  ENABLE_ALERT_RULE,
  DISABLE_ALERT_RULE,
  TEST_ALERT_RULE,
} from "@/lib/api-routes";
import { genericError } from "@/lib/errors";
import type { AlertRule } from "@/lib/schemas/alerts";

interface AlertActionsProps {
  alertRule: AlertRule;
  buttonVariant?: "ghost" | "outline" | "default";
}

export function AlertActions({
  alertRule,
  buttonVariant = "ghost",
}: AlertActionsProps) {
  const router = useRouter();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggleEnabled = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const newEnabled = !alertRule.enabled;
      const endpoint = newEnabled
        ? ENABLE_ALERT_RULE(alertRule.id)
        : DISABLE_ALERT_RULE(alertRule.id);
      await axiosPatchInstance<null, null>(endpoint, null);

      router.refresh();
      toast.success(
        newEnabled
          ? "Alert rule enabled successfully"
          : "Alert rule disabled successfully",
      );
    } catch (error) {
      console.error("Error toggling alert rule", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  const handleTestAlert = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await axiosPostInstance<null, null>(TEST_ALERT_RULE(alertRule.id), null);

      router.refresh();
      toast.success("Test alert sent successfully");
    } catch (error) {
      console.error("Error testing alert rule", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={buttonVariant}
            className="h-8 w-8 p-0"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner />
                <span className="sr-only">Loading</span>
              </>
            ) : (
              <>
                <MoreHorizontal />
                <span className="sr-only">Open menu</span>
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setOpenEditDialog(true)}>
            <Pencil /> Edit rule
          </DropdownMenuItem>
          {alertRule.enabled ? (
            <DropdownMenuItem onClick={handleToggleEnabled}>
              <Pause /> Disable rule
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={handleToggleEnabled}>
              <Play /> Enable rule
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleTestAlert}>
            <Send /> Send test alert
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive hover:!text-destructive hover:!bg-destructive/10"
            onClick={() => setOpenDeleteDialog(true)}
          >
            <Trash className="text-destructive" /> Delete rule
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditAlertRuleDialog
        alertRule={alertRule}
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
      />
      <DeleteAlertRuleDialog
        alertRule={alertRule}
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
      />
    </>
  );
}
