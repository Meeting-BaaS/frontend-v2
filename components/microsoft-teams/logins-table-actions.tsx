"use client"

import { MoreHorizontal, Pencil, RotateCcw, Trash } from "lucide-react"
import { useState } from "react"
import { LoginDeleteDialog } from "@/components/microsoft-teams/login-delete"
import { LoginReEnableDialog } from "@/components/microsoft-teams/login-re-enable"
import { LoginUpdateDialog } from "@/components/microsoft-teams/login-update"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import type { TeamsLogin } from "@/lib/schemas/teams-logins"
import type { TeamsWorkspace } from "@/lib/schemas/teams-workspaces"

interface LoginTableActionsProps {
  login: TeamsLogin
  workspace: TeamsWorkspace
  buttonVariant?: "ghost" | "outline" | "default"
}

export function LoginTableActions({
  login,
  workspace,
  buttonVariant = "ghost"
}: LoginTableActionsProps) {
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
  const [openReEnableDialog, setOpenReEnableDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  const isInvalid = login.state === "invalid"

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
          <DropdownMenuItem onClick={() => setOpenUpdateDialog(true)}>
            <Pencil /> Update Account
          </DropdownMenuItem>
          {isInvalid && (
            <DropdownMenuItem onClick={() => setOpenReEnableDialog(true)}>
              <RotateCcw /> Re-enable
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive hover:text-destructive! hover:bg-destructive/10!"
            onClick={() => setOpenDeleteDialog(true)}
          >
            <Trash className="text-destructive" /> Delete Account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <LoginUpdateDialog
        login={login}
        workspace={workspace}
        open={openUpdateDialog}
        onOpenChange={setOpenUpdateDialog}
      />
      <LoginReEnableDialog
        login={login}
        open={openReEnableDialog}
        onOpenChange={setOpenReEnableDialog}
      />
      <LoginDeleteDialog login={login} open={openDeleteDialog} onOpenChange={setOpenDeleteDialog} />
    </>
  )
}
