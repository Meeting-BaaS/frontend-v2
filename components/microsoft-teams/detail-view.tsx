"use client"

import { Building2, Plus } from "lucide-react"
import { useState } from "react"
import { DetailHeader } from "@/components/microsoft-teams/detail-header"
import { LoginCreateDialog } from "@/components/microsoft-teams/login-create"
import { LoginsTable } from "@/components/microsoft-teams/logins-table"
import { Button } from "@/components/ui/button"
import { GradientIcon } from "@/components/ui/gradient-icon"
import type { TeamsLogin } from "@/lib/schemas/teams-logins"
import type { TeamsWorkspace } from "@/lib/schemas/teams-workspaces"

interface TeamsWorkspaceDetailViewProps {
  workspace: TeamsWorkspace
  logins: TeamsLogin[]
}

export function TeamsWorkspaceDetailView({ workspace, logins }: TeamsWorkspaceDetailViewProps) {
  const [openCreateLogin, setOpenCreateLogin] = useState(false)

  return (
    <section>
      <div className="flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <DetailHeader
          workspace={workspace}
          gradientIcon={
            <GradientIcon
              color={
                workspace.state === "active" ? "var(--color-blue-300)" : "var(--color-red-300)"
              }
              size="xl"
            >
              <Building2 size={32} />
            </GradientIcon>
          }
        />
      </div>

      <div className="mt-12 flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <h2 className="text-xl font-medium">Accounts</h2>
        <Button size="sm" className="font-medium" onClick={() => setOpenCreateLogin(true)}>
          <Plus /> Add Account
        </Button>
      </div>

      <LoginsTable
        logins={logins}
        workspace={workspace}
        onAddButtonClick={() => setOpenCreateLogin(true)}
      />

      <LoginCreateDialog
        workspaceId={workspace.workspace_id}
        workspaceDomain={workspace.domain}
        open={openCreateLogin}
        onOpenChange={setOpenCreateLogin}
      />
    </section>
  )
}
