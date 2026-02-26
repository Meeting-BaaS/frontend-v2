"use client";

import { MoreHorizontal, Pencil, Power, PowerOff, Trash2 } from "lucide-react";
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
import { DeleteAlertRuleDialog } from "@/components/alerts/delete";
import { EditAlertRuleDialog } from "@/components/alerts/edit";
import { axiosPatchInstance } from "@/lib/api-client";
import { ENABLE_ALERT_RULE, DISABLE_ALERT_RULE } from "@/lib/api-routes";
import { genericError } from "@/lib/errors";
import type { AlertRule } from "@/lib/schemas/alerts";

interface TableActionsProps {
  rule: AlertRule;
}

export function TableActions({ rule }: TableActionsProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toggling, setToggling] = useState(false);

  const handleToggleEnabled = async () => {
    if (toggling) return;
    try {
      setToggling(true);
      const endpoint = rule.enabled
        ? DISABLE_ALERT_RULE(rule.id)
        : ENABLE_ALERT_RULE(rule.id);
      await axiosPatchInstance(endpoint, {});
      router.refresh();
      toast.success(
        rule.enabled ? "Alert rule disabled" : "Alert rule enabled",
      );
    } catch (error) {
      console.error("Error toggling alert rule", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setToggling(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil className="mr-2 size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleToggleEnabled} disabled={toggling}>
            {rule.enabled ? (
              <>
                <PowerOff className="mr-2 size-4" />
                Disable
              </>
            ) : (
              <>
                <Power className="mr-2 size-4" />
                Enable
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditAlertRuleDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        alertRule={rule}
      />
      <DeleteAlertRuleDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        alertRule={rule}
      />
    </>
  );
}
