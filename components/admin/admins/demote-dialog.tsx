"use client"

import { useState } from "react"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/admin/admins/confirm-dialog"
import { authClient } from "@/lib/auth-client"
import { genericError } from "@/lib/errors"
import type { AdminListUser } from "@/types/admin-users"

interface AdminTableActionsDemoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: AdminListUser
  onSuccess: () => void
}

export function AdminTableActionsDemoteDialog({
  open,
  onOpenChange,
  user,
  onSuccess
}: AdminTableActionsDemoteDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      const { error } = await authClient.admin.setRole({
        userId: user.id,
        role: "user"
      })
      if (error) throw new Error(error.message)
      toast.success("User demoted to user role")
      onSuccess()
      onOpenChange(false)
    } catch (err) {
      console.error("Failed to demote user", err)
      toast.error(err instanceof Error ? err.message : genericError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Demote user"
      description={`Are you sure you want to demote ${user.email} from admin to user? They will lose admin access.`}
      confirmLabel="Yes, demote"
      onConfirm={handleConfirm}
      loading={loading}
    />
  )
}
