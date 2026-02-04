"use client"

import { useState } from "react"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/admin/admins/confirm-dialog"
import { authClient } from "@/lib/auth-client"
import { genericError } from "@/lib/errors"
import type { AdminListUser } from "@/types/admin-users"

interface AdminTableActionsBanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: AdminListUser
  onSuccess: () => void
}

export function AdminTableActionsBanDialog({
  open,
  onOpenChange,
  user,
  onSuccess
}: AdminTableActionsBanDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      const { error } = await authClient.admin.banUser({
        userId: user.id
      })
      if (error) throw new Error(error.message)
      toast.success("User banned")
      onSuccess()
      onOpenChange(false)
    } catch (err) {
      console.error("Failed to ban user", err)
      toast.error(err instanceof Error ? err.message : genericError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Ban user"
      description={`Are you sure you want to ban ${user.email}? They will not be able to sign in and their sessions will be revoked.`}
      confirmLabel="Yes, ban"
      variant="destructive"
      onConfirm={handleConfirm}
      loading={loading}
    />
  )
}
