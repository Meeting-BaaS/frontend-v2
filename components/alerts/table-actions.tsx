"use client"

import { FlaskConical, MoreHorizontal, Pause, Pencil, Play, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { DeleteAlertDialog } from "@/components/alerts/delete"
import { EditAlertDialog } from "@/components/alerts/edit"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import { axiosPatchInstance, axiosPostInstance } from "@/lib/api-client"
import { DISABLE_ALERT_RULE, ENABLE_ALERT_RULE, TEST_ALERT_RULE } from "@/lib/api-routes"
import { genericError } from "@/lib/errors"
import type { AlertRule } from "@/lib/schemas/alerts"

interface AlertActionsProps {
  rule: AlertRule
  buttonVariant?: "ghost" | "outline" | "default"
}

export function AlertActions({ rule, buttonVariant = "ghost" }: AlertActionsProps) {
  const router = useRouter()
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDisable = async () => {
    if (loading) return
    try {
      setLoading(true)
      await axiosPatchInstance<{ ruleId: string }, null>(DISABLE_ALERT_RULE, {
        ruleId: rule.uuid
      })
      router.refresh()
      toast.success("Alert rule disabled")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : genericError)
    } finally {
      setLoading(false)
    }
  }

  const handleEnable = async () => {
    if (loading) return
    try {
      setLoading(true)
      await axiosPatchInstance<{ ruleId: string }, null>(ENABLE_ALERT_RULE, {
        ruleId: rule.uuid
      })
      router.refresh()
      toast.success("Alert rule enabled")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : genericError)
    } finally {
      setLoading(false)
    }
  }

  const handleTest = async () => {
    if (loading) return
    try {
      setLoading(true)
      await axiosPostInstance<{ ruleId: string }, unknown>(TEST_ALERT_RULE, {
        ruleId: rule.uuid
      })
      toast.success("Test alert sent successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : genericError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={buttonVariant} className="h-8 w-8 p-0" disabled={loading}>
            {loading ? (
              <>
                <Spinner />
                <span className="sr-only">Loading</span>
              </>
            ) : (
              <>
                <MoreHorizontal />
                <span className="sr-only">Open menu</span>
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setOpenEditDialog(true)}>
            <Pencil /> Edit rule
          </DropdownMenuItem>
          {rule.enabled ? (
            <DropdownMenuItem onClick={handleDisable}>
              <Pause /> Disable rule
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={handleEnable}>
              <Play /> Enable rule
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleTest}>
            <FlaskConical /> Test rule
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive hover:!text-destructive hover:!bg-destructive/10"
            onClick={() => setOpenDeleteDialog(true)}
          >
            <Trash className="text-destructive" /> Delete rule
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditAlertDialog rule={rule} open={openEditDialog} onOpenChange={setOpenEditDialog} />
      <DeleteAlertDialog rule={rule} open={openDeleteDialog} onOpenChange={setOpenDeleteDialog} />
    </>
  )
}
