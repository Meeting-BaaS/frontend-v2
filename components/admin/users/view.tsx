"use client"

import { Plus } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { InviteUserDialog } from "@/components/admin/users/invite-user-dialog"
import { AdminUsersTable } from "@/components/admin/users/table"
import { AdminUsersTableSkeleton } from "@/components/admin/users/table-skeleton"
import { PageHeading } from "@/components/layout/page-heading"
import { Button } from "@/components/ui/button"
import { axiosGetInstance } from "@/lib/api-client"
import { LIST_TEAM_MEMBERS } from "@/lib/api-routes"
import type { TeamMember } from "@/lib/schemas/teams"
import { type TeamMembersListResponse, teamMembersListResponseSchema } from "@/lib/schemas/teams"

export function AdminUsersView() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)

  const fetchMembers = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axiosGetInstance<TeamMembersListResponse>(
        LIST_TEAM_MEMBERS,
        teamMembersListResponseSchema
      )
      setMembers(response.data.members)
    } catch (err) {
      console.error("Failed to fetch team members", err)
      setMembers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  return (
    <>
      <div className="flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <PageHeading title="Users" containerClassName="md:flex-1" />
        <Button
          size="sm"
          className="w-full sm:w-auto font-medium"
          onClick={() => setInviteDialogOpen(true)}
        >
          <Plus /> Invite User
        </Button>
      </div>
      {loading ? (
        <AdminUsersTableSkeleton />
      ) : (
        <AdminUsersTable members={members} onSuccess={fetchMembers} />
      )}
      <InviteUserDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        onSuccess={fetchMembers}
      />
    </>
  )
}
