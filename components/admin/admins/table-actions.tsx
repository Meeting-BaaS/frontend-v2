"use client"

import { MoreHorizontal, UserMinus, UserX } from "lucide-react"
import { useState } from "react"
import { AdminTableActionsBanDialog } from "@/components/admin/admins/ban-dialog"
import { AdminTableActionsDemoteDialog } from "@/components/admin/admins/demote-dialog"
import { AdminTableActionsUnbanDialog } from "@/components/admin/admins/unban-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useUser } from "@/hooks/use-user"
import type { AdminListUser } from "@/types/admin-users"

interface AdminTableActionsProps {
  user: AdminListUser
  onSuccess: () => void
  buttonVariant?: "ghost" | "outline" | "default"
}

export function AdminTableActions({
  user: rowUser,
  onSuccess,
  buttonVariant = "ghost"
}: AdminTableActionsProps) {
  const { user: currentUser } = useUser()
  const [openDemote, setOpenDemote] = useState(false)
  const [openBan, setOpenBan] = useState(false)
  const [openUnban, setOpenUnban] = useState(false)

  const isCurrentUser =
    currentUser?.email != null &&
    rowUser.email.toLowerCase() === currentUser.email.toLowerCase()

  if (isCurrentUser) {
    return null
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
          <DropdownMenuItem onClick={() => setOpenDemote(true)}>
            <UserMinus /> Demote user
          </DropdownMenuItem>
          {rowUser.banned ? (
            <DropdownMenuItem onClick={() => setOpenUnban(true)}>
              <UserX /> Unban user
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              className="text-destructive hover:text-destructive! hover:bg-destructive/10!"
              onClick={() => setOpenBan(true)}
            >
              <UserX className="text-destructive" /> Ban user
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {openDemote && (
        <AdminTableActionsDemoteDialog
          open={openDemote}
          onOpenChange={setOpenDemote}
          user={rowUser}
          onSuccess={onSuccess}
        />
      )}
      {openBan && (
        <AdminTableActionsBanDialog
          open={openBan}
          onOpenChange={setOpenBan}
          user={rowUser}
          onSuccess={onSuccess}
        />
      )}
      {openUnban && (
        <AdminTableActionsUnbanDialog
          open={openUnban}
          onOpenChange={setOpenUnban}
          user={rowUser}
          onSuccess={onSuccess}
        />
      )}
    </>
  )
}
