"use client"

import { MoreHorizontal, Pencil, RotateCcw, Trash } from "lucide-react"
import { useState } from "react"
import { DeleteTeamsWorkspaceDialog } from "@/components/microsoft-teams/delete"
import { ReEnableTeamsWorkspaceDialog } from "@/components/microsoft-teams/re-enable"
import { UpdateTeamsWorkspaceDialog } from "@/components/microsoft-teams/update"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import type { TeamsWorkspace } from "@/lib/schemas/teams-workspaces"

interface TeamsWorkspaceTableActionsProps {
  workspace: TeamsWorkspace
  buttonVariant?: "ghost" | "outline" | "default"
}

export function TeamsWorkspaceTableActions({
  workspace,
  buttonVariant = "ghost"
}: TeamsWorkspaceTableActionsProps) {
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
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
      <UpdateTeamsWorkspaceDialog
        workspace={workspace}
        open={openUpdateDialog}
        onOpenChange={setOpenUpdateDialog}
      />
      <ReEnableTeamsWorkspaceDialog
        workspace={workspace}
        open={openReEnableDialog}
        onOpenChange={setOpenReEnableDialog}
      />
      <DeleteTeamsWorkspaceDialog
        workspace={workspace}
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
      />
    </>
  )
}
