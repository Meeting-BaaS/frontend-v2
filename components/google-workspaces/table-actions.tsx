"use client"

import { KeyRound, MoreHorizontal, Pencil, RotateCcw, Trash } from "lucide-react"
import { useState } from "react"
import { DeleteWorkspaceDialog } from "@/components/google-workspaces/delete"
import { ReEnableWorkspaceDialog } from "@/components/google-workspaces/re-enable"
import { RotateWorkspaceKeypairDialog } from "@/components/google-workspaces/rotate"
import { UpdateWorkspaceDialog } from "@/components/google-workspaces/update"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import type { MeetWorkspace } from "@/lib/schemas/meet-workspaces"

interface WorkspaceTableActionsProps {
  workspace: MeetWorkspace
  buttonVariant?: "ghost" | "outline" | "default"
}

export function WorkspaceTableActions({
  workspace,
  buttonVariant = "ghost"
}: WorkspaceTableActionsProps) {
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
  const [openRotateDialog, setOpenRotateDialog] = useState(false)
  const [openReEnableDialog, setOpenReEnableDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  const isInvalid = workspace.state === "invalid"

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
            <Pencil /> Update Workspace
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenRotateDialog(true)}>
            <KeyRound /> Rotate Keypair
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
            <Trash className="text-destructive" /> Delete Workspace
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UpdateWorkspaceDialog
        workspace={workspace}
        open={openUpdateDialog}
        onOpenChange={setOpenUpdateDialog}
      />
      <RotateWorkspaceKeypairDialog
        workspace={workspace}
        open={openRotateDialog}
        onOpenChange={setOpenRotateDialog}
      />
      <ReEnableWorkspaceDialog
        workspace={workspace}
        open={openReEnableDialog}
        onOpenChange={setOpenReEnableDialog}
      />
      <DeleteWorkspaceDialog
        workspace={workspace}
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
      />
    </>
  )
}
