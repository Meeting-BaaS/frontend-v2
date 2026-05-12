"use client"

import { ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/ui/copy-button"
import { env } from "@/env"
import type { MeetWorkspace } from "@/lib/schemas/meet-workspaces"

const SIGN_IN_URL = `${env.NEXT_PUBLIC_API_SERVER_BASEURL}/v2/meet-sso/sign-in`
const SIGN_OUT_URL = `${env.NEXT_PUBLIC_API_SERVER_BASEURL}/v2/meet-sso/sign-out`

interface CertSectionProps {
  workspace: MeetWorkspace
  defaultOpen?: boolean
}

export function CertSection({ workspace, defaultOpen = false }: CertSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="mt-10 rounded-lg border">
      <Button
        type="button"
        variant="ghost"
        className="w-full justify-between px-4 py-3 font-medium"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          Google Admin Console — values to paste
        </span>
        <span className="text-xs text-muted-foreground font-normal">{open ? "Hide" : "Show"}</span>
      </Button>

      {open && (
        <div className="border-t px-4 py-4 space-y-6">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs uppercase text-muted-foreground">Sign-in URL</span>
              <Button variant="ghost" size="icon" asChild>
                <CopyButton text={SIGN_IN_URL} />
              </Button>
            </div>
            <code className="block rounded-md bg-muted px-3 py-2 text-xs font-mono break-all">
              {SIGN_IN_URL}
            </code>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs uppercase text-muted-foreground">Sign-out URL</span>
              <Button variant="ghost" size="icon" asChild>
                <CopyButton text={SIGN_OUT_URL} />
              </Button>
            </div>
            <code className="block rounded-md bg-muted px-3 py-2 text-xs font-mono break-all">
              {SIGN_OUT_URL}
            </code>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs uppercase text-muted-foreground">
                Verification certificate (PEM)
              </span>
              <Button variant="ghost" size="icon" asChild>
                <CopyButton text={workspace.cert_pem} />
              </Button>
            </div>
            <pre className="max-h-72 overflow-auto rounded-md bg-muted px-3 py-2 text-xs font-mono whitespace-pre-wrap break-all">
              {workspace.cert_pem}
            </pre>
            <p className="mt-2 text-xs text-muted-foreground">
              Paste this into Google Admin Console → Security → SSO with third-party IdP → Legacy
              SSO profile → Verification certificate. Enable &quot;Use a domain-specific
              issuer&quot; and assign the profile to all users.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
