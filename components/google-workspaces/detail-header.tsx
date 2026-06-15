"use client"

import { useState } from "react"
import { ReEnableWorkspaceDialog } from "@/components/google-workspaces/re-enable"
import { WorkspaceTableActions } from "@/components/google-workspaces/table-actions"
import { ItemHeading } from "@/components/layout/item-heading"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { NameValuePair } from "@/components/ui/name-value-pair"
import { formatRelativeDate } from "@/lib/date-helpers"
import type { MeetWorkspace } from "@/lib/schemas/meet-workspaces"

interface DetailHeaderProps {
  workspace: MeetWorkspace
  gradientIcon: React.ReactNode
}

export function DetailHeader({ workspace, gradientIcon }: DetailHeaderProps) {
  const [openReEnable, setOpenReEnable] = useState(false)
  const isInvalid = workspace.state === "invalid"

  return (
    <>
      <ItemHeading
        title={workspace.name}
        name={workspace.domain}
        nameClassName="text-xl"
        containerClassName="md:flex-1"
        gradientIcon={gradientIcon}
      />
      <div className="flex w-full sm:w-auto gap-2 flex-row sm:items-center">
        {isInvalid && (
          <Button variant="primary" size="sm" onClick={() => setOpenReEnable(true)}>
            Re-enable
          </Button>
        )}
        <WorkspaceTableActions workspace={workspace} buttonVariant="outline" />
      </div>

      <div className="grid mt-10 md:mt-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <NameValuePair
          title="Created At"
          valueClassName="capitalize"
          value={formatRelativeDate(workspace.created_at)}
        />
        <NameValuePair
          title="Status"
          value={
            workspace.state === "active" ? (
              <Badge variant="success">Active</Badge>
            ) : (
              <Badge variant="destructive">Invalid</Badge>
            )
          }
        />
        <NameValuePair title="Domain" value={workspace.domain} copyText={workspace.domain} />
        <NameValuePair
          title="Workspace ID"
          value={workspace.workspace_id}
          copyText={workspace.workspace_id}
        />
      </div>

      {isInvalid && workspace.last_error_message && (
        <div className="mt-6 rounded-md border border-destructive/50 bg-destructive/5 p-4 text-sm">
          <p className="font-medium text-destructive">Last error</p>
          <p className="mt-1 text-xs text-destructive">{workspace.last_error_message}</p>
          {workspace.last_error_at && (
            <p className="mt-1 text-xs text-muted-foreground">
              {formatRelativeDate(workspace.last_error_at)}
            </p>
          )}
        </div>
      )}

      <ReEnableWorkspaceDialog
        workspace={workspace}
        open={openReEnable}
        onOpenChange={setOpenReEnable}
      />
    </>
  )
}
