"use client"

import { Plus } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { AddAdminDialog } from "@/components/admin/admins/add-admin-dialog"
import { AdminAdminsTable } from "@/components/admin/admins/table"
import { AdminAdminsTableSkeleton } from "@/components/admin/admins/table-skeleton"
import { PageHeading } from "@/components/layout/page-heading"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import type { AdminListUser } from "@/types/admin-users"

export function AdminAdminsView() {
  const [admins, setAdmins] = useState<AdminListUser[]>([])
  const [loadingAdmins, setLoadingAdmins] = useState(true)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [usersWithRoleUser, setUsersWithRoleUser] = useState<AdminListUser[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  const fetchAdmins = useCallback(async () => {
    setLoadingAdmins(true)
    try {
      const { data, error } = await authClient.admin.listUsers({
        query: {
          filterField: "role",
          filterValue: "admin",
          filterOperator: "eq",
          limit: 500
        }
      })
      if (error) throw new Error(error.message)
      const users = (data as { users?: AdminListUser[] })?.users ?? []
      setAdmins(users)
    } catch (err) {
      console.error("Failed to fetch admins", err)
      setAdmins([])
    } finally {
      setLoadingAdmins(false)
    }
  }, [])

  const fetchUsersWithRoleUser = useCallback(async () => {
    setLoadingUsers(true)
    try {
      const { data, error } = await authClient.admin.listUsers({
        query: {
          filterField: "role",
          filterValue: "user",
          filterOperator: "eq",
          limit: 5000
        }
      })
      if (error) throw new Error(error.message)
      const users = (data as { users?: AdminListUser[] })?.users ?? []
      setUsersWithRoleUser(users)
    } catch (err) {
      console.error("Failed to fetch users", err)
      setUsersWithRoleUser([])
    } finally {
      setLoadingUsers(false)
    }
  }, [])

  useEffect(() => {
    fetchAdmins()
  }, [fetchAdmins])

  useEffect(() => {
    if (addDialogOpen) {
      setLoadingUsers(true)
      fetchUsersWithRoleUser()
    }
  }, [addDialogOpen, fetchUsersWithRoleUser])

  return (
    <>
      <div className="flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <PageHeading title="Admins" containerClassName="md:flex-1" />
        <Button
          size="sm"
          className="w-full sm:w-auto font-medium"
          onClick={() => setAddDialogOpen(true)}
        >
          <Plus /> Add Admin
        </Button>
      </div>
      {loadingAdmins ? (
        <AdminAdminsTableSkeleton />
      ) : (
        <AdminAdminsTable admins={admins} onSuccess={fetchAdmins} />
      )}
      <AddAdminDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        usersWithRoleUser={usersWithRoleUser}
        loadingUsers={loadingUsers}
        onSuccess={fetchAdmins}
        refetchUsers={fetchUsersWithRoleUser}
      />
    </>
  )
}
