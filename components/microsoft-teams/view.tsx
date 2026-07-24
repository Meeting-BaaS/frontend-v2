"use client"

import { Plus } from "lucide-react"
import { usePathname, useSearchParams } from "next/navigation"
import { useState } from "react"
import { CreateTeamsWorkspaceDialog } from "@/components/microsoft-teams/create"
import { TeamsWorkspacesTable } from "@/components/microsoft-teams/table"
import { UtilizationStrip } from "@/components/microsoft-teams/utilization-strip"
import { PageHeading } from "@/components/layout/page-heading"
import { Button } from "@/components/ui/button"
import type { TeamsLoginUtilizationResponse } from "@/lib/schemas/teams-logins"
import type { TeamsWorkspace } from "@/lib/schemas/teams-workspaces"

interface MicrosoftTeamsViewProps {
  workspaces: TeamsWorkspace[]
  utilization: TeamsLoginUtilizationResponse["data"]
  newWorkspace?: boolean
}

export function MicrosoftTeamsView({
  workspaces,
  utilization,
  newWorkspace
}: MicrosoftTeamsViewProps) {
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
          title="Microsoft Teams"
          description="Manage Microsoft 365 tenants and accounts for authenticated Teams bots"
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
      <TeamsWorkspacesTable workspaces={workspaces} onAddButtonClick={handleCreateButtonClick} />
      <CreateTeamsWorkspaceDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
