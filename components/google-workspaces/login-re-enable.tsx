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
import { UPDATE_MEET_LOGIN } from "@/lib/api-routes"
import { genericError } from "@/lib/errors"
import {
  type MeetLogin,
  type MeetLoginSingleResponse,
  meetLoginSingleResponseSchema,
  type ReEnableMeetLoginRequest
} from "@/lib/schemas/meet-logins"

interface LoginReEnableDialogProps {
  login: MeetLogin
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginReEnableDialog({ login, open, onOpenChange }: LoginReEnableDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const onSubmit = async () => {
    if (loading) return
    try {
      setLoading(true)
      const response = await axiosPatchInstance<ReEnableMeetLoginRequest, MeetLoginSingleResponse>(
        UPDATE_MEET_LOGIN(login.credential_id),
        { state: "active" },
        meetLoginSingleResponseSchema
      )

      if (!response || !response.success) {
        console.error("Failed to re-enable login", response)
        throw new Error("Failed to re-enable login")
      }

      toast.success("Login re-enabled successfully")
      onCancel(false, true)
    } catch (error) {
      console.error("Error re-enabling login", error)
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
          <DialogTitle>Re-enable Login</DialogTitle>
          <DialogDescription>
            Mark <strong>{login.email}</strong> as active again. Only do this after fixing the
            underlying issue (e.g., restoring the suspended Workspace user).
          </DialogDescription>
        </DialogHeader>
        {login.last_error_message && (
          <div className="rounded-md border border-destructive/50 bg-destructive/5 p-3 text-sm text-destructive">
            <p className="font-medium">Last error</p>
            <p className="mt-1 text-xs">{login.last_error_message}</p>
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
