"use client"

import { Plus } from "lucide-react"
import { usePathname, useSearchParams } from "next/navigation"
import { useState } from "react"
import { CreateWorkspaceDialog } from "@/components/google-workspaces/create"
import { WorkspacesTable } from "@/components/google-workspaces/table"
import { UtilizationStrip } from "@/components/google-workspaces/utilization-strip"
import { PageHeading } from "@/components/layout/page-heading"
import { Button } from "@/components/ui/button"
import type { MeetLoginUtilizationResponse } from "@/lib/schemas/meet-logins"
import type { MeetWorkspace } from "@/lib/schemas/meet-workspaces"

interface GoogleWorkspacesViewProps {
  workspaces: MeetWorkspace[]
  utilization: MeetLoginUtilizationResponse["data"]
  newWorkspace?: boolean
}

export function GoogleWorkspacesView({
  workspaces,
  utilization,
  newWorkspace
}: GoogleWorkspacesViewProps) {
  const [open, setOpen] = useState(newWorkspace ?? false)
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const handleCreateButtonClick = () => {
    setOpen(true)

    if (searchParams.get("new") !== "true") {
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.set("new", "true")
      const newUrl = `${pathname}?${newSearchParams.toString()}`
      window.history.pushState(null, "", newUrl)
    }
  }

  return (
    <>
      <div className="flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <PageHeading
          title="Google Workspaces"
          description="Manage SAML SSO workspaces for authenticated Google Meet bots"
          containerClassName="md:flex-1"
        />
        <div className="flex w-full sm:w-auto flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            size="sm"
            className="w-full sm:w-auto font-medium"
            onClick={handleCreateButtonClick}
          >
            <Plus /> Add Workspace
          </Button>
        </div>
      </div>
      <UtilizationStrip utilization={utilization} />
      <WorkspacesTable workspaces={workspaces} onAddButtonClick={handleCreateButtonClick} />
      <CreateWorkspaceDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
