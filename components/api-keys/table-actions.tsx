import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { DeleteAPIKeyDialog } from "@/components/api-keys/delete";
import { EditAPIKeyDialog } from "@/components/api-keys/edit";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ApiKey } from "@/lib/schemas/api-keys";

interface TableActionsProps {
  apiKey: Omit<ApiKey, "key" | "metadata">;
  buttonVariant?: "ghost" | "outline" | "default";
}

export function TableActions({
  apiKey,
  buttonVariant = "ghost",
}: TableActionsProps) {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
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
            <Pencil /> Edit API Key
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive hover:!text-destructive hover:!bg-destructive/10"
            onClick={() => setOpenDeleteDialog(true)}
          >
            <Trash className="text-destructive" /> Delete API Key
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditAPIKeyDialog
        apiKey={apiKey}
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
      />
      <DeleteAPIKeyDialog
        apiKey={apiKey}
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
      />
    </>
  );
}
