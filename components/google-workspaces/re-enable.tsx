"use client"

import { RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { axiosPatchInstance } from "@/lib/api-client"
import { UPDATE_MEET_WORKSPACE } from "@/lib/api-routes"
import { genericError } from "@/lib/errors"
import {
  type MeetWorkspace,
  type MeetWorkspaceSingleResponse,
  meetWorkspaceSingleResponseSchema,
  type ReEnableMeetWorkspaceRequest
} from "@/lib/schemas/meet-workspaces"

interface ReEnableWorkspaceDialogProps {
  workspace: MeetWorkspace
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReEnableWorkspaceDialog({
  workspace,
  open,
  onOpenChange
}: ReEnableWorkspaceDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const onSubmit = async () => {
    if (loading) return
    try {
      setLoading(true)

      const response = await axiosPatchInstance<
        ReEnableMeetWorkspaceRequest,
        MeetWorkspaceSingleResponse
      >(
        UPDATE_MEET_WORKSPACE(workspace.workspace_id),
        { state: "active" },
        meetWorkspaceSingleResponseSchema
      )

      if (!response || !response.success) {
        console.error("Failed to re-enable workspace", response)
        throw new Error("Failed to re-enable workspace")
      }

      toast.success("Workspace re-enabled successfully")
      onCancel(false, true)
    } catch (error) {
      console.error("Error re-enabling workspace", error)
      toast.error(error instanceof Error ? error.message : genericError)
    } finally {
      setLoading(false)
    }
  }

  const onCancel = (updatedOpen: boolean, refresh?: boolean) => {
    if (updatedOpen || loading) return
    onOpenChange(updatedOpen)
    if (refresh) router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Re-enable Workspace</DialogTitle>
          <DialogDescription>
            Mark <strong>{workspace.name}</strong> as active again. Only do this after fixing the
            underlying issue (e.g., re-uploading the correct certificate to Google Admin).
          </DialogDescription>
        </DialogHeader>
        {workspace.last_error_message && (
          <div className="rounded-md border border-destructive/50 bg-destructive/5 p-3 text-sm text-destructive">
            <p className="font-medium">Last error</p>
            <p className="mt-1 text-xs">{workspace.last_error_message}</p>
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            aria-busy={loading}
            aria-disabled={loading}
            aria-label={loading ? "Re-enabling" : "Re-enable"}
          >
            {loading ? (
              <>
                <Spinner /> Re-enabling
              </>
            ) : (
              <>
                <RotateCcw />
                Re-enable
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
