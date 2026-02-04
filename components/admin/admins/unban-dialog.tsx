"use client"

import { useState } from "react"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/admin/admins/confirm-dialog"
import { authClient } from "@/lib/auth-client"
import { genericError } from "@/lib/errors"
import type { AdminListUser } from "@/types/admin-users"

interface AdminTableActionsUnbanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: AdminListUser
  onSuccess: () => void
}

export function AdminTableActionsUnbanDialog({
  open,
  onOpenChange,
  user,
  onSuccess
}: AdminTableActionsUnbanDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      const { error } = await authClient.admin.unbanUser({
        userId: user.id
      })
      if (error) throw new Error(error.message)
      toast.success("User unbanned")
      onSuccess()
      onOpenChange(false)
    } catch (err) {
      console.error("Failed to unban user", err)
      toast.error(err instanceof Error ? err.message : genericError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Unban user"
      description={`Are you sure you want to unban ${user.email}? They will be able to sign in again.`}
      confirmLabel="Yes, unban"
      onConfirm={handleConfirm}
      loading={loading}
    />
  )
}
