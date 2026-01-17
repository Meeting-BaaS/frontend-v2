"use client";

import { AlertTriangle, LogOut, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { CreateAdminSupportTicketDialog } from "@/components/admin/bots/create-support-ticket-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { axiosPostInstance } from "@/lib/api-client";
import { ADMIN_LEAVE_BOT } from "@/lib/api-routes";
import { genericError } from "@/lib/errors";

interface AdminBotActionsProps {
  botUuid: string;
  teamId: number;
  buttonVariant?: "ghost" | "outline" | "default";
}

export function AdminBotActions({
  botUuid,
  teamId,
  buttonVariant = "outline",
}: AdminBotActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [openSupportDialog, setOpenSupportDialog] = useState(false);

  const handleLeaveBot = async () => {
    if (loading) return;

    try {
      setLoading(true);
      await axiosPostInstance(ADMIN_LEAVE_BOT(botUuid), null, undefined);
      toast.success("Bot leave request sent successfully");
      router.refresh();
    } catch (error) {
      console.error("Error leaving bot", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSupportTicket = () => {
    setOpenSupportDialog(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={buttonVariant} className="h-9 px-3">
            <span className="sr-only">Open menu</span>
            <span className="mr-2">Actions</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleLeaveBot} disabled={loading}>
            <LogOut /> Make bot leave
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleCreateSupportTicket}
            disabled={loading}
          >
            <AlertTriangle /> Create support ticket
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateAdminSupportTicketDialog
        open={openSupportDialog}
        onOpenChange={setOpenSupportDialog}
        teamId={teamId}
        initialBotUuid={botUuid}
        initialModule="bots"
        initialType="bug"
      />
    </>
  );
}
