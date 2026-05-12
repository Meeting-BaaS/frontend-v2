"use client"

import { Building2, Plus } from "lucide-react"
import { useState } from "react"
import { CertSection } from "@/components/google-workspaces/cert-section"
import { DetailHeader } from "@/components/google-workspaces/detail-header"
import { LoginCreateDialog } from "@/components/google-workspaces/login-create"
import { LoginsTable } from "@/components/google-workspaces/logins-table"
import { Button } from "@/components/ui/button"
import { GradientIcon } from "@/components/ui/gradient-icon"
import type { MeetLogin } from "@/lib/schemas/meet-logins"
import type { MeetWorkspace } from "@/lib/schemas/meet-workspaces"

interface WorkspaceDetailViewProps {
  workspace: MeetWorkspace
  logins: MeetLogin[]
  justCreated?: boolean
}

export function WorkspaceDetailView({ workspace, logins, justCreated }: WorkspaceDetailViewProps) {
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

      <CertSection workspace={workspace} defaultOpen={justCreated ?? false} />

      <div className="mt-12 flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <h2 className="text-xl font-medium">Logins</h2>
        <Button size="sm" className="font-medium" onClick={() => setOpenCreateLogin(true)}>
          <Plus /> Add Login
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
