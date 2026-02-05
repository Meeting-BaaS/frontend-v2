"use client"

import { Mail, MoreHorizontal, Trash2, X } from "lucide-react"
import { useState } from "react"
import { AdminRemoveMemberDialog } from "@/components/admin/users/remove-member-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import { useCancelInvite, useResendInvite } from "@/hooks/use-member-mutations"
import { useUser } from "@/hooks/use-user"
import type { InputRole, TeamMember } from "@/lib/schemas/teams"

interface UsersTableActionsProps {
  member: TeamMember
  onSuccess: () => void
  buttonVariant?: "ghost" | "outline" | "default"
}

export function UsersTableActions({
  member,
  onSuccess,
  buttonVariant = "ghost"
}: UsersTableActionsProps) {
  const { user, activeTeam } = useUser()
  const resendInvite = useResendInvite()
  const cancelInvite = useCancelInvite()
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)

  const isCurrentUser = user?.email != null && member.email.toLowerCase() === user.email.toLowerCase()
  const isPendingInvite = member.invitationStatus === "pending"

  if (isCurrentUser) {
    return null
  }

  const onResendInviteClick = async () => {
    if (!member.invitationId || resendInvite.isPending) return
    try {
      await resendInvite.mutate({
        email: member.email,
        role: (member.role ?? "member") as InputRole,
        organizationId: activeTeam.id.toString(),
        throwOnError: true
      })
    } catch {
      // Hook already toasts on error
    }
  }

  const onCancelInviteClick = async () => {
    if (!member.invitationId || cancelInvite.isPending) return
    try {
      await cancelInvite.mutate({
        invitationId: String(member.invitationId),
        throwOnError: true
      })
    } catch {
      // Hook already toasts on error
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={buttonVariant} className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isPendingInvite ? (
            <>
              <DropdownMenuItem onClick={onResendInviteClick} disabled={resendInvite.isPending}>
                {resendInvite.isPending ? (
                  <>
                    <Spinner className="size-4" /> Resending...
                  </>
                ) : (
                  <>
                    <Mail /> Resend invite
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive hover:!text-destructive hover:!bg-destructive/10"
                onClick={onCancelInviteClick}
                disabled={cancelInvite.isPending}
              >
                {cancelInvite.isPending ? (
                  <>
                    <Spinner className="size-4" /> Canceling...
                  </>
                ) : (
                  <>
                    <X className="text-destructive" /> Cancel invite
                  </>
                )}
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem
              className="text-destructive hover:!text-destructive hover:!bg-destructive/10"
              onClick={() => setRemoveDialogOpen(true)}
            >
              <Trash2 className="text-destructive" /> Remove user
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <AdminRemoveMemberDialog
        member={member}
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
        onSuccess={onSuccess}
      />
    </>
  )
}
