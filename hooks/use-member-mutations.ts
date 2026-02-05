"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { axiosPostInstance } from "@/lib/api-client"
import { AFTER_LEAVE_CLEANUP } from "@/lib/api-routes"
import { authClient } from "@/lib/auth-client"
import { genericError } from "@/lib/errors"
import type { InputRole } from "@/lib/schemas/teams"

/**
 * Hooks for member-related operations
 * Separates API calls from component logic
 * Uses router.refresh() to refresh RSC data
 */

interface InviteMemberVariables {
  email: string
  role: InputRole
  organizationId: string
  throwOnError?: boolean
}

export function useInviteMember() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const mutate = async (variables: InviteMemberVariables) => {
    if (isPending) return

    try {
      setIsPending(true)
      const { error } = await authClient.organization.inviteMember({
        email: variables.email,
        role: variables.role,
        organizationId: variables.organizationId
      })

      if (error) {
        throw new Error(error.message || genericError)
      }

      toast.success("Invitation sent successfully")
      // Refresh server components to show new invitation
      router.refresh()
    } catch (error) {
      console.error("Error inviting member", error)
      toast.error(error instanceof Error ? error.message : genericError)
      if (variables.throwOnError) {
        throw error
      }
    } finally {
      setIsPending(false)
    }
  }

  return { mutate, isPending }
}

interface ResendInviteVariables {
  email: string
  role: InputRole
  organizationId: string
}

export function useResendInvite() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const mutate = async (variables: ResendInviteVariables) => {
    if (isPending) return

    try {
      setIsPending(true)
      const { error } = await authClient.organization.inviteMember({
        email: variables.email,
        role: variables.role,
        organizationId: variables.organizationId,
        resend: true
      })

      if (error) {
        throw new Error(error.message || genericError)
      }

      toast.success("Invitation resent successfully")
      // Refresh server components to show updated invitation
      router.refresh()
    } catch (error) {
      console.error("Error resending invitation", error)
      toast.error(error instanceof Error ? error.message : genericError)
    } finally {
      setIsPending(false)
    }
  }

  return { mutate, isPending }
}

interface CancelInviteVariables {
  invitationId: string
}

export function useCancelInvite() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const mutate = async (variables: CancelInviteVariables) => {
    if (isPending) return

    try {
      setIsPending(true)
      const { error } = await authClient.organization.cancelInvitation({
        invitationId: variables.invitationId
      })

      if (error) {
        throw new Error(error.message || genericError)
      }

      toast.success("Invitation canceled successfully")
      // Refresh server components to show updated member list
      router.refresh()
    } catch (error) {
      console.error("Error canceling invitation", error)
      toast.error(error instanceof Error ? error.message : genericError)
    } finally {
      setIsPending(false)
    }
  }

  return { mutate, isPending }
}

interface UpdateMemberRoleVariables {
  memberId: string
  role: InputRole
  organizationId: string
}

export function useUpdateMemberRole() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const mutate = async (variables: UpdateMemberRoleVariables) => {
    if (isPending) return

    try {
      setIsPending(true)
      const { error } = await authClient.organization.updateMemberRole({
        memberId: variables.memberId,
        role: variables.role,
        organizationId: variables.organizationId
      })

      if (error) {
        throw new Error(error.message || genericError)
      }

      toast.success("Member role updated successfully")
      // Refresh server components to show updated role
      router.refresh()
    } catch (error) {
      console.error("Error updating member role", error)
      toast.error(error instanceof Error ? error.message : genericError)
    } finally {
      setIsPending(false)
    }
  }

  return { mutate, isPending }
}

interface RemoveMemberVariables {
  memberId: string
  organizationId: string
}

export function useRemoveMember() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const mutate = async (variables: RemoveMemberVariables) => {
    if (isPending) return

    try {
      setIsPending(true)
      const { error } = await authClient.organization.removeMember({
        memberIdOrEmail: variables.memberId,
        organizationId: variables.organizationId
      })

      if (error) {
        throw new Error(error.message || genericError)
      }

      toast.success("Member removed successfully")
      // Refresh server components to show updated member list
      router.refresh()
    } catch (error) {
      console.error("Error removing member", error)
      toast.error(error instanceof Error ? error.message : genericError)
    } finally {
      setIsPending(false)
    }
  }

  return { mutate, isPending }
}

interface LeaveTeamVariables {
  organizationId: string
}

export function useLeaveTeam() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const mutate = async (variables: LeaveTeamVariables) => {
    if (isPending) return

    try {
      setIsPending(true)
      const { error: leaveError } = await authClient.organization.leave({
        organizationId: variables.organizationId
      })

      if (leaveError) {
        throw new Error(leaveError.message || genericError)
      }

      // After successfully leaving, clean up resources (e.g., API keys)
      // This is done after leaving because the user is no longer a member,
      // so we need a separate endpoint that doesn't require team membership
      try {
        await axiosPostInstance<{ teamId: number }, null>(
          AFTER_LEAVE_CLEANUP,
          {
            teamId: Number.parseInt(variables.organizationId, 10)
          },
          undefined // No response schema expected (204 No Content)
        )
      } catch (cleanupError) {
        // Log cleanup error but don't fail the leave operation
        // The user has already left the team, so cleanup failure shouldn't block them
        console.error("Error during after-leave cleanup:", cleanupError)
      }

      toast.success("Left team successfully")
      // Refresh server components to show updated team list
      router.refresh()
    } catch (error) {
      console.error("Error leaving team", error)
      toast.error(error instanceof Error ? error.message : genericError)
    } finally {
      setIsPending(false)
    }
  }

  return { mutate, isPending }
}
