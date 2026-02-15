"use client"

import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import { useState } from "react"
import { DeleteCredentialDialog } from "@/components/credentials/delete"
import { EditCredentialDialog } from "@/components/credentials/edit"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import type { ZoomCredential } from "@/lib/schemas/credentials"

interface CredentialTableActionsProps {
  credential: ZoomCredential
  buttonVariant?: "ghost" | "outline" | "default"
}

export function CredentialTableActions({
  credential,
  buttonVariant = "ghost"
}: CredentialTableActionsProps) {
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

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
          <DropdownMenuItem onClick={() => setOpenEditDialog(true)}>
            <Pencil /> Edit Credential
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive hover:text-destructive! hover:bg-destructive/10!"
            onClick={() => setOpenDeleteDialog(true)}
          >
            <Trash className="text-destructive" /> Delete Credential
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditCredentialDialog
        credential={credential}
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
      />
      <DeleteCredentialDialog
        credential={credential}
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
      />
    </>
  )
}
