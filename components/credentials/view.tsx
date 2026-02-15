"use client"

import { Plus } from "lucide-react"
import { usePathname, useSearchParams } from "next/navigation"
import { useState } from "react"
import { CreateCredentialDialog } from "@/components/credentials/create"
import { CredentialsTable } from "@/components/credentials/table"
import { DocsButton } from "@/components/layout/docs-button"
import { PageHeading } from "@/components/layout/page-heading"
import { Button } from "@/components/ui/button"
import type { ZoomCredential } from "@/lib/schemas/credentials"

interface CredentialsViewProps {
  credentials: ZoomCredential[]
  newCredential?: boolean
}

export function CredentialsView({ credentials, newCredential }: CredentialsViewProps) {
  const [open, setOpen] = useState(newCredential ?? false)
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const handleCreateButtonClick = () => {
    setOpen(true)

    // Add new=true to searchParams when dialog opens
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
          title="Credentials"
          description="Manage your Zoom OAuth credentials for bot authentication"
          containerClassName="md:flex-1"
        />
        <div className="flex w-full sm:w-auto flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            size="sm"
            className="w-full sm:w-auto font-medium"
            onClick={handleCreateButtonClick}
          >
            <Plus /> Add Credential
          </Button>
          <DocsButton uriSuffix="api-v2/getting-started/zoom" />
        </div>
      </div>
      <CredentialsTable credentials={credentials} onAddButtonClick={handleCreateButtonClick} />
      <CreateCredentialDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
